const database = require('../database/database');

exports.getBookList = async (req, res) => {
  try {
    const query = `SELECT book_id, book_title, book_author, genre_tag_name, isbn, book_description, book_price FROM book`;
    const allBooks = await database.query(query);

    if (!allBooks.rows.length) {
      return res.status(404).json({ message: 'No books found' });
    }
    return res.status(200).json(allBooks.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
