const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = '8002';

const app = express(); //express 모듈을 사용하기 위해 app 변수에 할당

app.use(express.json()); //express 모듈의 json()메소드를 사용한다.
app.use(cookieParser()); // 쿠키 파서 추가

app.use(
  cors({
    origin: 'http://localhost:3002',
    credentials: true,
  })
);
//http, https 프로토콜을 사용하는 서버 간의 통신을 허용한다.

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(require('./routes/getRoutes'));
app.use(require('./routes/postRoutes')); // postRoutes 경로 설정

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
