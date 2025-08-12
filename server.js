const app = require('./app');
const { testConnection } = require('./config/db');
const logger = require('./config/logger');

/**
 * 服务器启动文件
 * 负责启动 HTTP 服务器和初始化数据库连接
 */

// 获取端口号，默认为 3000
const PORT = process.env.PORT || 3000;

/**
 * 启动服务器
 * 包括数据库连接测试和 HTTP 服务器启动
 */
async function startServer() {
  try {
    // 测试数据库连接
    logger.info('正在测试数据库连接...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.error('数据库连接失败，服务器启动终止');
      process.exit(1);
    }
    
    // 启动 HTTP 服务器
    const server = app.listen(PORT, () => {
      logger.info(`🚀 服务器启动成功`);
      logger.info(`📍 服务器地址: http://localhost:${PORT}`);
      logger.info(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
      
      // 显示可用的 API 端点
      logger.info('📋 可用的 API 端点:');
      logger.info('   GET  /                    - API 信息');
      logger.info('   GET  /api/health          - 健康检查');
      logger.info('   GET  /api/todos           - 获取所有待办事项');
      logger.info('   GET  /api/todos/:id       - 获取单个待办事项');
      logger.info('   POST /api/todos           - 创建待办事项');
      logger.info('   PUT  /api/todos/:id       - 更新待办事项');
      logger.info('   PATCH /api/todos/:id/toggle - 切换完成状态');
      logger.info('   DELETE /api/todos/:id     - 删除单个待办事项');
      logger.info('   DELETE /api/todos         - 批量删除待办事项');
    });
    
    /**
     * 优雅关闭服务器
     * 处理进程终止信号，确保资源正确释放
     */
    const gracefulShutdown = (signal) => {
      logger.info(`收到 ${signal} 信号，正在优雅关闭服务器...`);
      
      server.close((err) => {
        if (err) {
          logger.error('服务器关闭时发生错误:', err);
          process.exit(1);
        }
        
        logger.info('HTTP 服务器已关闭');
        logger.info('服务器已成功停止');
        process.exit(0);
      });
      
      // 如果 10 秒内没有正常关闭，强制退出
      setTimeout(() => {
        logger.error('强制关闭服务器');
        process.exit(1);
      }, 10000);
    };
    
    // 监听进程终止信号
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // 处理未捕获的异常
    process.on('uncaughtException', (err) => {
      logger.error('未捕获的异常:', err);
      process.exit(1);
    });
    
    // 处理未处理的 Promise 拒绝
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('未处理的 Promise 拒绝:', reason);
      process.exit(1);
    });
    
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer();
