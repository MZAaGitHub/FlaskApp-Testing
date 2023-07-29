function fetchBooks() {
    fetch('/books')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '';

            data.forEach((book, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'book-item';
                listItem.innerHTML = `
                <strong>Title:</strong> ${book.title}<br>
                <strong>Author:</strong> ${book.author}<br>
                <strong id="book-id">ID: ${index + 1}</strong>
                <button onclick="editBook(${book.id},'${book.title}','${book.author}')">Edit</button>
                <button onclick="deleteBook(${book.id})">Delete</button>
            `;
                bookList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

function addOrUpdateBook() {
    const bookId = document.getElementById('bookId').value;
    const bookTitle = document.getElementById('bookTitle').value;
    const bookAuthor = document.getElementById('bookAuthor').value;

    const data = {
        title: bookTitle,
        author: bookAuthor
    };

    if (bookId) {
        // If bookId is present, it's an update operation
        fetch(`/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                fetchBooks();
                clearForm();
            })
            .catch(error => console.error('Error updating book:', error));
    } else {
        // If bookId is not present, it's an add operation
        fetch('/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                fetchBooks();
                clearForm();
            })
            .catch(error => console.error('Error adding book:', error));
    }
}

function deleteBook(bookId) {
    if (confirm("Are you sure you want to delete this book?")) {
        fetch(`/books/${bookId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                fetchBooks();
            })
            .catch(error => console.error('Error deleting book:', error));
    }
}

function editBook(bookId, bookTitle, bookAuthor) {
    document.getElementById('bookId').value = bookId;
    document.getElementById('bookTitle').value = bookTitle;
    document.getElementById('bookAuthor').value = bookAuthor;
}

function clearForm() {
    document.getElementById('bookId').value = '';
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
}

fetchBooks();