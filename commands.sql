CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author VARCHAR,
  url VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  likes int DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Aku Ankka', 'https://ankkalinna.fi', 'Ankkalinnan kaupunki');
INSERT INTO blogs (author, url, title) VALUES ('', 'https://ankkalinna.fi', 'Pulivari');