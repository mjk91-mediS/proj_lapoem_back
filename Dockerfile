# 베이스 이미지 설정
FROM node:alpine3.18

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 및 의존성 설치
COPY package.json package-lock.json ./  
RUN npm install --only=production && npm cache clean --force

# 애플리케이션 소스 코드 복사
COPY . .

# 애플리케이션에서 사용하는 포트를 노출
EXPOSE 8002

# 애플리케이션 시작 명령어
CMD ["npm", "start"]