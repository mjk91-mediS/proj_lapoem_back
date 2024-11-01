const router = require('express').Router();
const { getBookList } = require('../controllers/getBookList');
const { verifyToken } = require('../controllers/authController');

router.get('/book-list', getBookList);

// 토큰 검증 라우트
router.get('/verify', verifyToken);

module.exports = router; // router 모듈 내보내기
