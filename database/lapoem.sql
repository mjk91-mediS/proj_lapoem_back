CREATE TABLE "book" (
	"book_id"	INT		NOT NULL,
	"genre_tag_id"	INT		NOT NULL,
	"book_cover"	VARCHAR(255)		NOT NULL,
	"book_publisher"	VARCHAR(255)		NOT NULL,
	"publish_date"	DATE		NOT NULL,
	"isbn"	VARCHAR(255)		NOT NULL,
	"book_description"	TEXT		NOT NULL,
	"book_price"	TEXT		NOT NULL,
	"book_create_date"	TIMESTAMP		NOT NULL,
	"book_update_date"	TIMESTAMP		NULL,
	"book_delete_date"	TIMESTAMP		NULL,
	"is_book_best"	BOOLEAN		NOT NULL,
	"book_status"	VARCHAR(20)		NOT NULL,
	"book_title"	VARCHAR(255)		NOT NULL,
	"book_author"	VARCHAR(255)		NOT NULL
);

CREATE TABLE "member" (
	"member_num"	INT		NOT NULL,
	"member_id"	VARCHAR(50)		NOT NULL,
	"member_password"	VARCHAR(255)		NOT NULL,
	"member_nickname"	VARCHAR(50)		NOT NULL,
	"member_email"	VARCHAR(100)		NOT NULL,
	"member_phone"	VARCHAR(20)		NOT NULL,
	"member_join_date"	DATE		NOT NULL,
	"member_leave_date"	DATE		NULL,
	"member_gender"	CHAR(1)		NOT NULL,
	"member_birth_date"	DATE		NOT NULL,
	"member_status"	VARCHAR(20)		NOT NULL
);

CREATE TABLE "thread" (
	"thread_num"	INT		NOT NULL,
	"book_id"	INT		NOT NULL,
	"thread_created_at"	DATETIME		NOT NULL,
	"thread_delete_at"	DATETIME		NULL,
	"thread_status"	VARCHAR(20)		NOT NULL
);

CREATE TABLE "book_review" (
	"review_num"	INT		NOT NULL,
	"book_id"	INT		NOT NULL,
	"member_num"	INT		NOT NULL,
	"review_content"	TEXT		NOT NULL,
	"rating"	TINYINT		NOT NULL,
	"review_created_at"	DATETIME		NOT NULL,
	"review_deleted_at"	DATETIME		NULL,
	"review_status"	VARCHAR(20)		NOT NULL
);

CREATE TABLE "book_category" (
	"genre_tag_id"	INT		NOT NULL,
	"genre_tag_name"	VARCHAR(100)		NOT NULL
);

CREATE TABLE "book_best" (
	"book_best_id"	INT		NOT NULL,
	"book_id"	INT		NOT NULL,
	"book_best_start"	DATETIME		NOT NULL,
	"book_best_end"	DATETIME		NULL,
	"book_best_status"	VARCHAR(20)		NOT NULL
);

CREATE TABLE "chatbot" (
	"chat_id"	INT		NOT NULL,
	"book_id"	INT		NOT NULL,
	"member_num"	INT		NOT NULL
);

CREATE TABLE "chating_content" (
	"chat_id"	INT		NOT NULL,
	"chat_content"	TEXT		NOT NULL
);

COMMENT ON COLUMN "chating_content"."chat_content" IS 'json';

CREATE TABLE "community" (
	"posts_id"	INT		NOT NULL,
	"member_num"	INT		NOT NULL,
	"post_title"	VARCHAR(255)		NOT NULL,
	"post_content"	TEXT		NOT NULL,
	"post_created_at"	TIMESTAMP		NOT NULL,
	"post_updated_at"	TIMESTAMP		NULL,
	"post_deleted_at"	TIMESTAMP		NULL,
	"post_status"	VARCHAR(20)		NOT NULL,
	"visibility"	BOOLEAN		NOT NULL
);

CREATE TABLE "community_comment" (
	"comment_id"	INT		NOT NULL,
	"posts_id"	INT		NOT NULL,
	"member_num"	INT		NOT NULL,
	"comment_content"	TEXT		NOT NULL,
	"comment_created_at"	TIMESTAMP		NOT NULL,
	"comment_deleted_at"	TIMESTAMP		NULL,
	"comment_status"	VARCHAR(20)		NOT NULL
);

CREATE TABLE "book_recommended" (
	"member_num"	INT		NOT NULL,
	"book_id"	INT		NOT NULL,
	"interest"	BOOLEAN		NULL
);

COMMENT ON COLUMN "book_recommended"."interest" IS '스레드 활동 이력을 확인해서,
그 카데고리와 연관된 신간 책의 정보의
알림을 주는 것
state: 무관심/관심

회원가입하면, 우리기 설정한 책을 추천해줘서 관심을 누르게 유도,
관심 서적 등록한 유저에게 연관 도서에게 신간 도서 알림 보냄(알림은 사이트 링크 첨부)';

CREATE TABLE "term" (
	"terms_id"	INT		NOT NULL,
	"terms_version"	VARCHAR(50)		NOT NULL,
	"agreement_status"	BOOLEAN		NOT NULL,
	"terms_created_at"	DATETIME		NOT NULL,
	"terms_updated_at"	DATETIME		NULL,
	"terms_deleted_at"	DATETIME		NULL
);

CREATE TABLE "term_link" (
	"member_num"	INT		NOT NULL,
	"terms_id"	INT		NOT NULL
);

CREATE TABLE "thread_main" (
	"thread_content_num"	INT		NOT NULL,
	"thread_num"	INT		NOT NULL,
	"member_num"	INT		NOT NULL,
	"thread_content"	TEXT		NOT NULL,
	"thread_content_created_at"	DATETIME		NOT NULL,
	"thread_content_delete_at"	DATETIME		NULL,
	"thread_status"	VARCHAR(20)		NOT NULL,
	"thread_content_num2"	INT		NOT NULL
);

CREATE TABLE "member_nickname" (
	"nickname_change_id"	INT		NOT NULL,
	"member_num"	INT		NOT NULL,
	"previous_nickname"	VARCHAR(50)		NOT NULL,
	"new_nickname"	VARCHAR(50)		NOT NULL,
	"change_date"	DATETIME		NOT NULL
);

-----------------------------key type

ALTER TABLE "book" ADD CONSTRAINT "PK_BOOK" PRIMARY KEY (
	"book_id"
);

ALTER TABLE "member" ADD CONSTRAINT "PK_MEMBER" PRIMARY KEY (
	"member_num"
);

ALTER TABLE "thread" ADD CONSTRAINT "PK_THREAD" PRIMARY KEY (
	"thread_num"
);

ALTER TABLE "book_review" ADD CONSTRAINT "PK_BOOK_REVIEW" PRIMARY KEY (
	"review_num"
);

ALTER TABLE "book_category" ADD CONSTRAINT "PK_BOOK_CATEGORY" PRIMARY KEY (
	"genre_tag_id"
);

ALTER TABLE "book_best" ADD CONSTRAINT "PK_BOOK_BEST" PRIMARY KEY (
	"book_best_id"
);

ALTER TABLE "chatbot" ADD CONSTRAINT "PK_CHATBOT" PRIMARY KEY (
	"chat_id"
);

ALTER TABLE "chating_content" ADD CONSTRAINT "PK_CHATING_CONTENT" PRIMARY KEY (
	"chat_id"
);

ALTER TABLE "community" ADD CONSTRAINT "PK_COMMUNITY" PRIMARY KEY (
	"posts_id"
);

ALTER TABLE "community_comment" ADD CONSTRAINT "PK_COMMUNITY_COMMENT" PRIMARY KEY (
	"comment_id"
);

ALTER TABLE "book_recommended" ADD CONSTRAINT "PK_BOOK_RECOMMENDED" PRIMARY KEY (
	"member_num",
	"book_id"
);

ALTER TABLE "term" ADD CONSTRAINT "PK_TERM" PRIMARY KEY (
	"terms_id"
);

ALTER TABLE "term_link" ADD CONSTRAINT "PK_TERM_LINK" PRIMARY KEY (
	"member_num",
	"terms_id"
);

ALTER TABLE "thread_main" ADD CONSTRAINT "PK_THREAD_MAIN" PRIMARY KEY (
	"thread_content_num",
	"thread_num"
);

ALTER TABLE "member_nickname" ADD CONSTRAINT "PK_MEMBER_NICKNAME" PRIMARY KEY (
	"nickname_change_id"
);

ALTER TABLE "chating_content" ADD CONSTRAINT "FK_chatbot_TO_chating_content_1" FOREIGN KEY (
	"chat_id"
)
REFERENCES "chatbot" (
	"chat_id"
);

ALTER TABLE "book_recommended" ADD CONSTRAINT "FK_member_TO_book_recommended_1" FOREIGN KEY (
	"member_num"
)
REFERENCES "member" (
	"member_num"
);

ALTER TABLE "book_recommended" ADD CONSTRAINT "FK_book_TO_book_recommended_1" FOREIGN KEY (
	"book_id"
)
REFERENCES "book" (
	"book_id"
);

ALTER TABLE "term_link" ADD CONSTRAINT "FK_member_TO_term_link_1" FOREIGN KEY (
	"member_num"
)
REFERENCES "member" (
	"member_num"
);

ALTER TABLE "term_link" ADD CONSTRAINT "FK_term_TO_term_link_1" FOREIGN KEY (
	"terms_id"
)
REFERENCES "term" (
	"terms_id"
);

ALTER TABLE "thread_main" ADD CONSTRAINT "FK_thread_TO_thread_main_1" FOREIGN KEY (
	"thread_num"
)
REFERENCES "thread" (
	"thread_num"
);

