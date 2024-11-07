const database = require('../database/database');

const getBookDetail = async (req, res) => {
  const { bookId } = req.params;

  try {
    // 책 정보와 리뷰의 평균 평점 및 총 리뷰 개수 조회
    const query = `
        SELECT 
            b.book_id,
            b.book_cover,
            b.book_publisher,
            b.publish_date,
            b.isbn,
            b.book_description,
            b.book_price,
            b.is_book_best,
            b.book_title,
            b.book_author,
            b.genre_tag_name,
            CASE 
            WHEN AVG(br.rating) IS NULL THEN 0 
            ELSE ROUND(AVG(br.rating), 1) 
            END AS average_rating, -- NULL일 때는 0, 아닐 때는 소수점 1자리로 반올림
            COUNT(br.rating) AS review_count  -- 리뷰 개수
        FROM 
            book AS b
        LEFT JOIN 
            book_review AS br ON b.book_id = br.book_id
        WHERE 
            b.book_id = $1
        GROUP BY 
            b.book_id
    `;

    const result = await database.query(query, [bookId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json(result.rows[0]); // 첫 번째 책 정보 반환
  } catch (error) {
    console.error('Error fetching book details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getBookDetail;
