const database = require('../../database/database');

// 북리스트----------------------------------------------------
exports.getBookList = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // 기본 페이지는 1
    const limit = parseInt(req.query.limit, 10) || 10; // 기본 페이지 크기는 20
    const category = req.query.category; // 카테고리 필터 추가

    const offset = (page - 1) * limit;

    // 기본 쿼리와 조건 설정
    let query = `
      SELECT 
        b.book_id,
        b.book_title,
        b.book_cover,
        b.book_author,
        b.book_publisher,
        b.genre_tag_name,
        b.isbn,
        b.book_description,
        b.book_price,
        b.publish_date,
        b.genre_tag_id,
        b.is_book_best,
        b.book_status,
        CASE 
        WHEN AVG(br.rating) IS NULL THEN 0 
        ELSE ROUND(AVG(br.rating), 1) 
        END AS average_rating, -- NULL일 때는 0, 아닐 때는 소수점 1자리로 반올림
        COUNT(br.rating) AS review_count  -- 리뷰 개수
      FROM book AS b
      LEFT JOIN book_review AS br ON b.book_id = br.book_id -- book_review 테이블과 조인
      WHERE b.book_status IS NOT false  -- book_status가 false인 책을 제외
    `;

    // 카테고리 필터가 있을 경우 WHERE 조건 추가
    if (category) {
      query += ` AND genre_tag_name = $3`; // SQL 인젝션 방지를 위해 $3를 사용해 파라미터 바인딩
    }

    // 정렬 및 페이징 추가
    query += `
    GROUP BY b.book_id
    ORDER BY 
      CASE WHEN b.book_author = '한강' THEN 1 ELSE 0 END DESC,          -- '한강' 저자 우선 출력
      CASE WHEN b.is_book_best = true THEN 1 ELSE 0 END DESC,           -- 베스트셀러인 책 우선 출력
      CASE WHEN b.genre_tag_name = '한국 소설' THEN 1 ELSE 0 END DESC,  -- '한국 소설' 우선 출력
      publish_date DESC,                                              -- 최신 출판일 우선 출력
      b.genre_tag_id ASC                                             -- 그다음으로 장르 ID 순으로 정렬
    LIMIT $1 OFFSET $2
  `;

    // 총 책 개수를 세는 쿼리
    let countQuery = `SELECT COUNT(*) FROM book WHERE book_status IS NOT false`;
    if (category) {
      countQuery += ` AND genre_tag_name = $1`;
    }

    // 파라미터 설정
    const queryParams = category ? [category, limit, offset] : [limit, offset];
    const countParams = category ? [category] : [];

    // 총 책 개수를 가져오기 위한 쿼리 실행
    const totalBooksResult = await database.query(countQuery, countParams);
    const totalBooks = parseInt(totalBooksResult.rows[0].count, 10);

    // 현재 페이지의 책 목록을 가져오기 위한 쿼리 실행
    const allBooks = await database.query(query, queryParams);

    if (!allBooks.rows.length) {
      return res.status(404).json({ message: 'No books found' });
    }

    return res.status(200).json({
      data: allBooks.rows,
      currentPage: page,
      totalBooks: totalBooks, // 전체 책 개수 전달
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 북의 카테고리----------------------------------------------------------------
exports.getAllCategories = async (req, res) => {
  try {
    // book_category 테이블의 모든 카테고리 정보를 가져옴
    const query = `
      SELECT genre_tag_id, genre_tag_name FROM book_category
    `;
    const { rows: categories } = await database.query(query);

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

// 책을 카테고리별로 조회하는 API----------------------------------------------------
exports.getBookByCategory = async (req, res) => {
  const { genre_tag_id = '', page = 1 } = req.query; // 카테고리 ID와 페이지 수 가져오기
  const limit = 10; // 한 페이지에 표시할 도서 수
  const offset = (page - 1) * limit; // 페이지에 따른 오프셋 계산

  try {
    // genre_tag_id가 제공되지 않을 경우 모든 책을 가져옴
    const query = `
    SELECT 
     b.*,
      CASE 
        WHEN AVG(br.rating) IS NULL THEN 0 
        ELSE ROUND(AVG(br.rating), 1) 
      END AS average_rating,  -- NULL일 때 0, 소수점 1자리로 표시
      COUNT(br.rating) AS review_count -- 리뷰 개수
    FROM 
      book AS b
    LEFT JOIN 
      book_review AS br ON b.book_id = br.book_id -- book_review와 조인
    WHERE 
      ${genre_tag_id ? `b.genre_tag_id = $1` : 'true'}
    GROUP BY 
      b.book_id
    ORDER BY 
      (CASE WHEN b.book_author = '한강' THEN 1 ELSE 0 END) DESC, -- '한강' 저자 우선 출력
      (CASE WHEN b.is_book_best = true THEN 1 ELSE 0 END) DESC, -- 베스트셀러 우선 출력
      b.publish_date DESC                                       -- 최신 출판일 순으로 정렬
    LIMIT $2 OFFSET $3
  `;

    const params = genre_tag_id
      ? [genre_tag_id, limit, offset]
      : [limit, offset]; // 파라미터 설정
    const { rows: books } = await database.query(query, params);

    // 총 도서 개수를 가져오는 쿼리
    const countQuery = `
      SELECT COUNT(*) FROM book
      ${genre_tag_id ? 'WHERE book.genre_tag_id = $1' : ''}
    `;
    const countParams = genre_tag_id ? [genre_tag_id] : []; // 파라미터 설정
    const { rows: countResult } = await database.query(countQuery, countParams);
    const totalBooks = parseInt(countResult[0].count, 10);
    const totalPages = Math.ceil(totalBooks / limit); // 총 페이지 수 계산

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: 'No books found for this category' });
    }

    res.status(200).json({
      data: books,
      totalBooks,
      totalPages,
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ error: 'Error fetching books by category' });
  }
};
