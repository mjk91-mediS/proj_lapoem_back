// controllers/authController.js
const database = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 회원가입 함수
exports.joinUser = async (req, res) => {
  try {
    const {
      member_id,
      member_password,
      member_nickname,
      member_email,
      member_phone,
      member_gender,
      member_birth_date,
    } = req.body;

    // 중복 확인 (아이디, 닉네임, 이메일)
    const idCheck = await database.query('SELECT member_num FROM member WHERE member_id = $1', [member_id]);
    if (idCheck.rows.length > 0) {
      return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
    }

    const nicknameCheck = await database.query('SELECT member_num FROM member WHERE member_nickname = $1', [
      member_nickname,
    ]);
    if (nicknameCheck.rows.length > 0) {
      return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
    }

    const emailCheck = await database.query('SELECT member_num FROM member WHERE member_email = $1', [member_email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 암호화
    const salt = 10;
    const hashed_password = await bcrypt.hash(member_password, salt);

    // 회원 정보 데이터베이스 삽입
    const query = `
      INSERT INTO member 
      (member_id, member_password, member_nickname, member_email, member_phone, member_join_date, 
       member_leave_date, member_gender, member_birth_date, member_status) 
      VALUES 
      ($1, $2, $3, $4, $5, CURRENT_DATE, NULL, $6, $7, 'active') 
      RETURNING member_num
    `;
    const values = [
      member_id,
      hashed_password,
      member_nickname,
      member_email,
      member_phone,
      member_gender,
      member_birth_date,
    ];

    const userResult = await database.query(query, values);
    return res.status(201).json({ message: '회원가입이 완료되었습니다.', userId: userResult.rows[0].member_num });
  } catch (error) {
    console.error('회원가입 오류:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// 로그인 함수
exports.loginUser = async (req, res) => {
  try {
    const { rows } = await database.query('SELECT * FROM member WHERE member_id = $1', [req.body.member_id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const compare = await bcrypt.compare(req.body.member_password, rows[0].member_password);
    if (!compare) {
      return res.status(401).json({ message: 'Password not matched' });
    }

    // JWT 토큰 생성 및 반환
    const { member_num, member_nickname, member_email, member_id } = rows[0];
    const token = jwt.sign(
      { memberNum: member_num, nickname: member_nickname, email: member_email, memberId: member_id },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    // 쿠키에 토큰 설정
    res.cookie('token', token, { httpOnly: true, sameSite: 'Strict', secure: true });
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('로그인 오류:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

// 토큰 검증 함수
exports.verifyToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token is invalid or expired' });
    res.status(200).json({ user: decoded });
  });
};
