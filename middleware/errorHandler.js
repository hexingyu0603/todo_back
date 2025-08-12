const logger = require('../config/logger');

/**
 * 全局错误处理中间件
 * 统一处理应用中的错误，提供标准化的错误响应格式
 */

/**
 * 自定义错误类
 * 用于创建带有状态码和消息的自定义错误
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 异步错误处理包装器
 * 用于包装异步路由处理器，自动捕获错误
 * @param {Function} fn - 异步函数
 * @returns {Function} 包装后的函数
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 全局错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 记录错误日志
  logger.error(`错误: ${err.message}`);
  logger.error(`请求路径: ${req.originalUrl}`);
  logger.error(`请求方法: ${req.method}`);
  logger.error(`请求IP: ${req.ip}`);
  logger.error(`用户代理: ${req.get('User-Agent')}`);
  logger.error(`错误堆栈: ${err.stack}`);

  // MySQL 错误处理
  if (err.code === 'ER_DUP_ENTRY') {
    const message = '数据已存在，请检查输入信息';
    error = new AppError(message, 400);
  }

  // MySQL 连接错误
  if (err.code === 'ECONNREFUSED') {
    const message = '数据库连接失败，请检查数据库配置';
    error = new AppError(message, 500);
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // 类型转换错误
  if (err.name === 'CastError') {
    const message = '无效的数据格式';
    error = new AppError(message, 400);
  }

  // 默认错误响应
  const statusCode = error.statusCode || 500;
  const message = error.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * 404 错误处理中间件
 * 处理未找到的路由
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const notFound = (req, res, next) => {
  const error = new AppError(`路径 ${req.originalUrl} 不存在`, 404);
  next(error);
};

module.exports = {
  AppError,
  asyncHandler,
  errorHandler,
  notFound
};
