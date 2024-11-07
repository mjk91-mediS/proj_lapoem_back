const database = require("../database/database");

exports.registerBestSeller = async (req, res) => {
  const { book_id, book_best_start, book_best_end } = req.body;

  // 필수 필드 검증
  if (!book_id || !book_best_start || !book_best_end) {
    return res.status(400).json({
      message: "book_id, book_best_start, and book_best_end are required",
    });
  }

  try {
    const query = `
      INSERT INTO book_best (book_id, book_best_start, book_best_end, book_best_status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const startDate = new Date(`${book_best_start}T12:00:00`); // 시작일을 12:00:00로 설정
    const endDate = new Date(`${book_best_end}T23:59:59`); // 종료일을 23:59:59로 설정

    const params = [
      book_id,
      startDate.toISOString(),
      endDate.toISOString(),
      true, // 상태 항상 true로 설정 // true = 노출, 추후 유지보수 시 false=미노출
    ];

    const { rows } = await database.query(query, params);
    const newBestSeller = rows[0];

    return res.status(201).json(newBestSeller);
  } catch (error) {
    console.error("Error registering best seller:", error);
    return res.status(500).json({
      message: "Failed to register best seller",
      error: error.message,
    });
  }
};
