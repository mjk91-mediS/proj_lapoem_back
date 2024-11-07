const database = require("../database/database");

exports.getBestBook = async (req, res) => {
  try {
    const query = `
      SELECT 
        book.book_id, 
        book.book_cover, 
        book.book_title, 
        book.book_author, 
        book.book_publisher, 
        ROUND(COALESCE(AVG(book_review.rating), 0), 1) AS average_rating,  -- 평균 별점, 리뷰 없으면 0
        COUNT(book_review.review_num) AS review_count           -- 리뷰 개수
      FROM 
        book
      LEFT JOIN 
        book_review ON book.book_id = book_review.book_id      -- LEFT JOIN을 사용해 리뷰가 없는 책도 포함
      WHERE 
        book.publish_date IS NOT NULL                          -- 출판일이 NULL이 아닌 책만 포함
        AND book.is_book_best = true                           -- best 책만 포함
      GROUP BY 
        book.book_id, book.book_cover, book.book_title, book.book_author, book.book_publisher
      LIMIT 5                                                -- 5권의 데이터만 가져오기
    `;

    const { rows: bestBooks } = await database.query(query);

    // 데이터가 없는 경우 404 응답
    if (bestBooks.length === 0) {
      return res.status(404).json({ message: "No best books found" });
    }

    // 데이터를 성공적으로 가져온 경우 200 응답
    return res.status(200).json(bestBooks);
  } catch (error) {
    console.error("Error fetching best books:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch best books", error: error.message });
  }
};
