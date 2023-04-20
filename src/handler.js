const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  if (!name) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      }
    );
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      }
    );
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
  if (readPage === pageCount) {
    finished = true;
  }

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt, finished
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // jika berhasil ditambahkan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
        books
      },
    });
    response.code(201);
    return response;
  }

  // jika gagal ditambahkan
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;

};

const getAllBooksHandler = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => (
        {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }
      ))
    }
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler };