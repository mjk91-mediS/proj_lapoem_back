const database = require('../../database/database');

// 검색 API 로직
exports.getSearchBooks = async (req, res) => {
  const { keyword, page = 1, limit = 10 } = req.query; // 페이지, 검색어, 페이지 당 결과 수 가져오기
  const offset = (page - 1) * limit; // 페이지 오프셋 계산
  const searchTerm = `%${keyword}%`; // PostgreSQL에서 LIKE 쿼리를 위해 '%' 추가

  try {
    // 1. 제목과 저자에서 검색어와 일치하는 도서 찾기
    let query = `
      SELECT * FROM book    
      WHERE book_title ILIKE $1 OR book_author ILIKE $1
      ORDER BY 
      CASE WHEN is_book_best = true THEN 1 ELSE 0 END DESC,  -- 베스트셀러 우선 출력
      CASE WHEN book_author = '한강' THEN 1 ELSE 0 END DESC,  -- '한강' 작가의 책 우선 출력
      (LENGTH(book_title) - LENGTH(REPLACE(book_title, $1, ''))) +
      (LENGTH(book_author) - LENGTH(REPLACE(book_author, $1, ''))) DESC
      LIMIT $2 OFFSET $3
    `;

    // 쿼리 실행
    const { rows: books } = await database.query(query, [
      searchTerm,
      limit,
      offset,
    ]);

    // 2. 총 책 개수 확인
    const countQuery = `
      SELECT COUNT(*) FROM book
      WHERE book_title ILIKE $1 OR book_author ILIKE $1
    `;
    const { rows: countResult } = await database.query(countQuery, [
      searchTerm,
    ]);
    const totalBooks = parseInt(countResult[0].count, 10);

    // 결과 반환
    res.status(200).json({
      data: books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Error fetching search results' });
  }
};
