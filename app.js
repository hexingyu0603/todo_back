const express = require('express');
const cors = require('cors');
require('dotenv').config();

const todoRoutes = require('./routes/todoRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./config/logger');

/**
 * Express 应用主文件
 * 配置中间件、路由和错误处理
 */

const app = express();

/**
 * 中间件配置
 */

// CORS 配置 - 允许跨域请求
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // 生产环境指定域名
    : true, // 开发环境允许所有域名
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 请求体解析中间件
app.use(express.json({ limit: '10mb' })); // 限制请求体大小为 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req, res, next) => {
  const start = Date.now();
  
  // 记录请求信息
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
  
  // 记录请求完成时间
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

/**
 * 路由配置
 */

// 根路径 - API 信息
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Todo List API 服务运行正常',
    version: '1.0.0',
    endpoints: {
      todos: '/api/todos',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '服务健康状态良好',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Todo 路由
app.use('/api/todos', todoRoutes);

/**
 * 错误处理中间件
 * 注意：错误处理中间件必须放在所有路由之后
 */

// 404 错误处理 - 处理未找到的路由
app.use(notFound);

// 全局错误处理 - 处理所有其他错误
app.use(errorHandler);

module.exports = app;
