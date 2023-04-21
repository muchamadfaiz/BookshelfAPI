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
  const { name, reading, finished } = request.query;
  if (!name && !reading && !finished) {
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
  }
  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading) {
    filteredBooks = filteredBooks.filter(
      (book) => book.reading === (reading === '1')
    );
  } else if (reading === '0') {
    filteredBooks = filteredBooks.filter((book) => !book.reading);
  }

  if (finished) {
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === (finished === '1')
    );
  } else if (finished === '0') {
    filteredBooks = filteredBooks.filter((book) => !book.finished);
  }
  const response = h.response(
    {
      status: 'success',
      data: {
        books: filteredBooks.map((book) => (
          {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }
        ))
      }
    }
  );
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

const updateBookByIdHandler = (request, h) => {
  const { name, year, author, summary, publisher, reading, readPage, pageCount } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      }
    );
    response.code(400);
    return response;
  }

  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      }
    );
    response.code(404);
    return response;
  }

  const updatedAt = new Date().toISOString();
  books[index] = {
    ...books[index],
    name,
    readPage,
    pageCount,
    year,
    author,
    summary,
    publisher,
    reading,
    updatedAt,
  };

  const response = h.response(
    {
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        books
      }
    }
  );
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
      }
    );
    response.code(404);
    return response;
  }
  books.splice(index, 1);
  const response = h.response(
    {
      status: 'success',
      message: 'Buku berhasil dihapus'
    }
  );
  response.code(200);
  return response;
};


module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };