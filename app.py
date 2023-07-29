import os
import json
from flask import Flask, request, jsonify, render_template

app = Flask(__name__, static_folder='static')
db_file = 'books.json'


def read_data():
    if not os.path.exists(db_file):
        return []
    with open(db_file, 'r') as f:
        data = json.load(f)
    return data


def write_data(data):
    with open(db_file, 'w') as f:
        json.dump(data, f)

# Route to serve the index.html file
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# Route to get all books


@app.route('/books', methods=['GET'])
def get_books():
    books = read_data()
    return jsonify(books)


# Route to get a specific book by id
@app.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    books = read_data()
    book = next((book for book in books if book['id'] == book_id), None)
    if book:
        return jsonify(book)
    else:
        return jsonify({"message": "Book not found"}), 404


# Route to create a new book
@app.route('/books', methods=['POST'])
def create_book():
    data = request.get_json()
    if not data or 'title' not in data or 'author' not in data:
        return jsonify({"message": "Invalid data"}), 400

    books = read_data()
    new_book = {
        "id": len(books) + 1,
        "title": data['title'],
        "author": data['author']
    }

    books.append(new_book)
    write_data(books)
    return jsonify(new_book), 201


# Route to update an existing book
@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()
    if not data or 'title' not in data or 'author' not in data:
        return jsonify({"message": "Invalid data"}), 400

    books = read_data()
    book = next((book for book in books if book['id'] == book_id), None)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    book['title'] = data['title']
    book['author'] = data['author']
    write_data(books)
    return jsonify(book)


# Route to delete a book by id
@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    books = read_data()
    books = [book for book in books if book['id'] != book_id]

    # Reassign IDs to the remaining books
    for index, book in enumerate(books):
        book['id'] = index + 1

    write_data(books)
    return jsonify({"message": "Book deleted"})

if __name__ == '__main__':
    app.run(debug=True)
