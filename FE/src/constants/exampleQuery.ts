import { ExampleQuery } from '@/types/interfaces'

const createQueryExample = `CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- 고유 ID, 기본 키
    name VARCHAR(100) NOT NULL,              -- 이름
    city VARCHAR(100) NOT NULL,              -- 도시
    email VARCHAR(255) UNIQUE NOT NULL,      -- 이메일, 고유값
    phone VARCHAR(20) NOT NULL,              -- 전화번호
    age INT CHECK (age >= 0),                -- 나이 (0 이상만 허용)
    gender ENUM('Male', 'Female', 'Other') NOT NULL,  -- 성별 (열거형)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- 생성 날짜
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 수정 날짜
  );`

const insertQueryExample = `INSERT INTO users (name, city, email, phone, age, gender)
  VALUES
  ('Alice Johnson', 'New York', 'alice.johnson@example.com', '123-456-7890', 30, 'Female'),
  ('Bob Smith', 'Los Angeles', 'bob.smith@example.com', '987-654-3210', 45, 'Male'),
  ('Charlie Brown', 'Chicago', 'charlie.brown@example.com', '555-555-5555', 25, 'Other');
  `

const selectQueryExample = `SELECT * FROM users;`

const testQueries: ExampleQuery[] = [
  {
    id: 'create',
    name: 'Create Table Query',
    query: createQueryExample,
  },
  {
    id: 'insert',
    name: 'Insert Row Query',
    query: insertQueryExample,
  },
  {
    id: 'select',
    name: 'Select Row Query',
    query: selectQueryExample,
  },
]

export default testQueries
