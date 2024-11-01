const express = require('express');
const router = express.Router();
const { joinUser, loginUser } = require('../controllers/authController'); // authController를 사용

// 회원가입 라우트 설정
router.post('/join', joinUser);
// 로그인 라우트 설정
router.post('/login', loginUser);

module.exports = router;
