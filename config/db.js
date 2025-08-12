const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * 数据库连接配置
 * 使用 mysql2 连接阿里云 RDS MySQL
 */
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // 连接池配置
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 时区配置
  timezone: '+08:00',
  // 字符集配置
  charset: 'utf8mb4'
};

/**
 * 创建数据库连接池
 * 使用连接池可以提高性能，避免频繁创建和销毁连接
 */
const pool = mysql.createPool(dbConfig);

/**
 * 测试数据库连接
 * @returns {Promise<boolean>} 连接是否成功
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

/**
 * 执行 SQL 查询
 * @param {string} sql - SQL 语句
 * @param {Array} params - 查询参数
 * @returns {Promise<Array>} 查询结果
 */
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('数据库查询错误:', error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  query
};
