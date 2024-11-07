const database = require('../database/database');

// 특정 리뷰 ID에 따른 리뷰 정보 가져오는 컨트롤러
const getBookReviewById = async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;

    // bookId와 reviewId가 없을 경우 오류 반환
    if (!bookId || !reviewId) {
      return res
        .status(400)
        .json({ error: 'Book ID and Review ID are required.' });
    }

    // 특정 리뷰 정보를 가져오는 쿼리
    const query = `
      SELECT
        r.review_num,
        r.review_content, 
        r.rating, 
        to_char(r.review_created_at, 'DD.MM.YY (HH24:MI)') AS review_created_at,
        m.member_num, 
        m.member_nickname, 
        m.member_gender
      FROM 
        book_review r
      JOIN 
        member m ON r.member_num = m.member_num
      JOIN 
        book b ON r.book_id = b.book_id
      WHERE 
        r.book_id = $1 
        AND r.review_num = $2 
        AND r.review_status = 'active'
    `;

    // 쿼리 실행
    const result = await database.query(query, [bookId, reviewId]);

    // 결과가 없을 경우 404 에러 반환
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'Review not found or the book is not active.' });
    }

    // 결과 반환
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching book review by ID:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the review' });
  }
};

module.exports = { getBookReviewById };
