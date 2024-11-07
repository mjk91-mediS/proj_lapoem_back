const database = require('../database/database');
const jwt = require('jsonwebtoken');

// ------------------리뷰 작성---------------------------

// JWT를 사용해 로그인 상태를 확인하는 미들웨어
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: 'Token is invalid or expired' });
    req.user = decoded; // 인증된 사용자 정보 저장
    next();
  });
};

// 리뷰 작성 컨트롤러
const postBookReview = async (req, res) => {
  try {
    const { bookId } = req.params; // URL에서 bookId 가져오기
    const { review_content, rating = 0 } = req.body; // 기본 평점은 0
    const member_num = req.user.memberNum; // 인증된 사용자 ID 가져오기

    // 필수 필드 검증
    if (!bookId || !review_content) {
      return res
        .status(400)
        .json({ error: 'Book ID and review content are required.' });
    }

    // 평점 유효성 검사 (0.5 ~ 10 범위, 0.5 단위)
    const validRatings = Array.from({ length: 20 }, (_, i) => (i + 1) * 0.5); // [0.5, 1.0, ..., 10.0]
    if (!validRatings.includes(parseFloat(rating))) {
      return res.status(400).json({
        error: 'Rating must be between 0.5 and 10, in 0.5 increments.',
      });
    }

    // 리뷰를 데이터베이스에 삽입
    const result = await database.query(
      `INSERT INTO book_review (book_id, member_num, review_content, rating, review_created_at, review_status)
       VALUES ($1, $2, $3, $4, NOW(), 'active') RETURNING review_num`,
      [bookId, member_num, review_content, rating]
    );

    // 성공 응답 반환
    res.status(201).json({
      message: 'Review created successfully',
      reviewId: result.rows[0].review_num,
    });
  } catch (error) {
    console.error('Error posting review:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while posting the review' });
  }
};

module.exports = { postBookReview, verifyToken };

// ------------------리뷰 삭제---------------------------
const deleteBookReview = async (req, res) => {
  try {
    const { reviewId } = req.params; // URL에서 reviewId 가져오기
    const member_num = req.user.memberNum; // 인증된 사용자 ID 가져오기

    // 리뷰가 존재하고, 사용자 권한이 있는지 확인
    const review = await database.query(
      `SELECT * FROM book_review WHERE review_num = $1 AND member_num = $2 AND review_status = 'active'`,
      [reviewId, member_num]
    );

    if (review.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'Review not found or access denied' });
    }

    // review_status를 'inactive'로 업데이트하여 리뷰를 숨기기
    await database.query(
      `UPDATE book_review
       SET review_status = 'inactive', review_deleted_at = NOW()
       WHERE review_num = $1`,
      [reviewId]
    );

    // 성공 응답 반환
    res.status(200).json({
      message: 'Review deleted successfully (status set to inactive)',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the review' });
  }
};

module.exports = { postBookReview, verifyToken, deleteBookReview };
