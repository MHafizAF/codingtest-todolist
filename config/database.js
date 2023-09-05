import mysql from "mysql2";

const db = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'escape',
  database: process.env.MYSQL_DBNAME || 'todolist',
  password: process.env.MYSQL_PASSWORD || 'hadehBujang123==',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,
});

export default db.promise();