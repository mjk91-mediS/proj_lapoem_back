-- member 테이블 생성
CREATE TABLE member (
    member_num SERIAL PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL,
    member_password VARCHAR(255) NOT NULL,
    member_nickname VARCHAR(50) NOT NULL,
    member_email VARCHAR(100) NOT NULL,
    member_phone VARCHAR(20) NOT NULL,
    member_join_date DATE NOT NULL,
    member_leave_date DATE NULL,
    member_gender CHAR(1) NOT NULL,
    member_birth_date DATE NOT NULL,
    member_status VARCHAR(20) NOT NULL
);

-- member_nickname 테이블 생성
CREATE TABLE member_nickname (
    nickname_change_id SERIAL PRIMARY KEY,
    member_num INT NOT NULL,
    previous_nickname VARCHAR(50) NOT NULL,
    new_nickname VARCHAR(50) NOT NULL,
    change_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_nickname_member FOREIGN KEY (member_num) REFERENCES member (member_num)
);

-- term 테이블 생성
CREATE TABLE term (
    terms_id SERIAL PRIMARY KEY,
    terms_version VARCHAR(50) NOT NULL,
    agreement_status BOOLEAN NOT NULL,
    terms_created_at TIMESTAMP NOT NULL,
    terms_updated_at TIMESTAMP NULL,
    terms_deleted_at TIMESTAMP NULL
);

-- book_category 테이블 생성
CREATE TABLE book_category (
    genre_tag_id SERIAL PRIMARY KEY,
    genre_tag_name VARCHAR(100) NOT NULL
);

-- book 테이블 생성
CREATE TABLE book (
    book_id SERIAL PRIMARY KEY,
    book_cover VARCHAR(255) NOT NULL,
    book_publisher VARCHAR(255) NOT NULL,
    publish_date DATE NOT NULL,
    isbn VARCHAR(255) NOT NULL,
    book_description TEXT NOT NULL,
    book_price TEXT NOT NULL,
    book_create_date TIMESTAMP NOT NULL,
    book_update_date TIMESTAMP NULL,
    book_delete_date TIMESTAMP NULL,
    is_book_best BOOLEAN NOT NULL,
    book_status VARCHAR(20) NOT NULL,
    book_title VARCHAR(255) NOT NULL,
    book_author VARCHAR(255) NOT NULL,
    genre_tag_name VARCHAR(100) NOT NULL,
    genre_tag_id INT NOT NULL,
    CONSTRAINT fk_book_genre_tag FOREIGN KEY (genre_tag_id) REFERENCES book_category (genre_tag_id)
);

-- book_best 테이블 생성
CREATE TABLE book_best (
    book_best_id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    book_best_start TIMESTAMP NOT NULL,
    book_best_end TIMESTAMP NULL,
    book_best_status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_best_book FOREIGN KEY (book_id) REFERENCES book (book_id)
);



-- book_review 테이블 생성
CREATE TABLE book_review (
    review_num SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    member_num INT NOT NULL,
    review_content TEXT NOT NULL,
    rating DECIMAL NOT NULL,
    review_created_at TIMESTAMP NOT NULL,
    review_deleted_at TIMESTAMP NULL,
    review_status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_review_book FOREIGN KEY (book_id) REFERENCES book (book_id),
    CONSTRAINT fk_review_member FOREIGN KEY (member_num) REFERENCES member (member_num)
);

-- book_recommended 테이블 생성
CREATE TABLE book_recommended (
    member_num INT NOT NULL,
    book_id INT NOT NULL,
    interest BOOLEAN NULL,
    PRIMARY KEY (member_num, book_id),
    CONSTRAINT fk_recommended_member FOREIGN KEY (member_num) REFERENCES member (member_num),
    CONSTRAINT fk_recommended_book FOREIGN KEY (book_id) REFERENCES book (book_id)
);






-- chatbot 테이블 생성
CREATE TABLE chatbot (
    chat_id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    member_num INT NOT NULL,
    CONSTRAINT fk_chatbot_book FOREIGN KEY (book_id) REFERENCES book (book_id),
    CONSTRAINT fk_chatbot_member FOREIGN KEY (member_num) REFERENCES member (member_num)
);

-- chating_content 테이블 생성
CREATE TABLE chating_content (
    chat_id INT NOT NULL,
    chat_content TEXT NOT NULL,
    CONSTRAINT pk_chating_content PRIMARY KEY (chat_id),
    CONSTRAINT fk_chating_content_chat FOREIGN KEY (chat_id) REFERENCES chatbot (chat_id)
);

COMMENT ON COLUMN chating_content.chat_content IS 'json';

-- community 테이블 생성
CREATE TABLE community (
    posts_id SERIAL PRIMARY KEY,
    member_num INT NOT NULL,
    post_title VARCHAR(255) NOT NULL,
    post_content TEXT NOT NULL,
    post_created_at TIMESTAMP NOT NULL,
    post_updated_at TIMESTAMP NULL,
    post_deleted_at TIMESTAMP NULL,
    post_status VARCHAR(20) NOT NULL,
    visibility BOOLEAN NOT NULL,
    CONSTRAINT fk_community_member FOREIGN KEY (member_num) REFERENCES member (member_num)
);

-- community_comment 테이블 생성
CREATE TABLE community_comment (
    comment_id SERIAL PRIMARY KEY,
    posts_id INT NOT NULL,
    member_num INT NOT NULL,
    comment_content TEXT NOT NULL,
    comment_created_at TIMESTAMP NOT NULL,
    comment_deleted_at TIMESTAMP NULL,
    comment_status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_comment_post FOREIGN KEY (posts_id) REFERENCES community (posts_id),
    CONSTRAINT fk_comment_member FOREIGN KEY (member_num) REFERENCES member (member_num)
);




-- term_link 테이블 생성
CREATE TABLE term_link (
    member_num INT NOT NULL,
    terms_id INT NOT NULL,
    PRIMARY KEY (member_num, terms_id),
    CONSTRAINT fk_term_link_member FOREIGN KEY (member_num) REFERENCES member (member_num),
    CONSTRAINT fk_term_link_terms FOREIGN KEY (terms_id) REFERENCES term (terms_id)
);

-- thread 테이블 생성
CREATE TABLE thread (
    thread_num SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    thread_created_at TIMESTAMP NOT NULL,
    thread_delete_at TIMESTAMP NULL,
    thread_status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_thread_book FOREIGN KEY (book_id) REFERENCES book (book_id)
);

-- thread_main 테이블 생성
CREATE TABLE thread_main (
    thread_content_num SERIAL NOT NULL,
    thread_num INT NOT NULL,
    member_num INT NOT NULL,
    thread_content_num2 INT NOT NULL,
    thread_content TEXT NOT NULL,
    thread_content_created_at TIMESTAMP NOT NULL,
    thread_content_delete_at TIMESTAMP NULL,
    thread_status VARCHAR(20) NOT NULL,
    PRIMARY KEY (thread_content_num, thread_num),
    CONSTRAINT fk_thread_main_thread FOREIGN KEY (thread_num) REFERENCES thread (thread_num),
    CONSTRAINT fk_thread_main_member FOREIGN KEY (member_num) REFERENCES member (member_num),
    CONSTRAINT fk_thread_main_content FOREIGN KEY (thread_content_num2) REFERENCES thread_main (thread_content_num)
);