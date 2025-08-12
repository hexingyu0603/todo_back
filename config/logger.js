const winston = require('winston');
const path = require('path');

/**
 * 日志配置
 * 使用 winston 进行日志管理，支持控制台和文件输出
 */

// 定义日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 根据环境设置日志级别
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// 定义日志颜色
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// 添加颜色支持
winston.addColors(colors);

// 定义日志格式
const format = winston.format.combine(
  // 添加时间戳
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // 添加颜色
  winston.format.colorize({ all: true }),
  // 定义日志输出格式
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// 定义日志输出目标
const transports = [
  // 控制台输出
  new winston.transports.Console(),
  // 错误日志文件
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
  }),
  // 所有日志文件
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/all.log'),
  }),
];

/**
 * 创建日志记录器
 */
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = logger;
