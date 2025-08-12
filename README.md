# Todo List API 后端项目

基于 Node.js 和 Express 框架开发的待办事项管理 API 服务。

## 项目特性

- ✅ 完整的 CRUD 操作（增删改查）
- ✅ 批量删除功能
- ✅ 状态切换功能
- ✅ 数据库连接池
- ✅ 全局错误处理
- ✅ 请求日志记录
- ✅ CORS 跨域支持
- ✅ 优雅关闭服务器
- ✅ 健康检查端点

## 技术栈

- **Node.js** - JavaScript 运行时
- **Express.js** - Web 应用框架
- **MySQL2** - MySQL 数据库驱动
- **Winston** - 日志管理
- **CORS** - 跨域资源共享
- **Dotenv** - 环境变量管理

## 项目结构

```
back/
├── config/              # 配置文件夹
│   ├── db.js            # 数据库连接配置
│   └── logger.js        # 日志配置
├── controllers/         # 控制器（处理业务逻辑）
│   └── todoController.js # 待办事项相关逻辑
├── routes/              # 路由（定义API接口）
│   └── todoRoutes.js    # 待办事项路由
├── middleware/          # 中间件（如错误处理、日志）
│   └── errorHandler.js  # 全局错误处理
├── logs/                # 日志文件目录
├── .env                 # 环境变量（不提交到代码仓库）
├── .env.example         # 环境变量示例
├── app.js               # Express应用入口
├── server.js            # 服务器启动文件
└── package.json         # 项目依赖配置
```

## 安装和配置

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

创建 `.env` 文件并配置以下环境变量：

```env
# 数据库配置
DB_HOST=your_rds_host
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=todo_db

# 服务器配置
PORT=3000
NODE_ENV=development

# 日志配置
LOG_LEVEL=info
```

### 3. 数据库配置

确保已创建数据库和表：

```sql
CREATE DATABASE todo_db;
USE todo_db;

CREATE TABLE todo_list (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(255) NOT NULL,
  is_completed TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 启动服务

### 开发环境

```bash
npm run dev
```

### 生产环境

```bash
npm start
```

## API 接口文档

### 基础信息

- **基础URL**: `http://localhost:3000`
- **API前缀**: `/api`
- **内容类型**: `application/json`

### 接口列表

#### 1. 获取所有待办事项

```http
GET /api/todos
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "value": "完成项目文档",
      "is_completed": 0,
      "created_at": "2024-01-01T10:00:00.000Z",
      "updated_at": "2024-01-01T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### 2. 获取单个待办事项

```http
GET /api/todos/:id
```

#### 3. 创建待办事项

```http
POST /api/todos
Content-Type: application/json

{
  "value": "新的待办事项"
}
```

#### 4. 更新待办事项

```http
PUT /api/todos/:id
Content-Type: application/json

{
  "value": "更新后的内容",
  "is_completed": true
}
```

#### 5. 切换完成状态

```http
PATCH /api/todos/:id/toggle
```

#### 6. 删除单个待办事项

```http
DELETE /api/todos/:id
```

#### 7. 批量删除待办事项

```http
DELETE /api/todos
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

#### 8. 健康检查

```http
GET /api/health
```

## 错误处理

API 使用标准 HTTP 状态码，错误响应格式：

```json
{
  "success": false,
  "error": {
    "message": "错误描述",
    "statusCode": 400
  }
}
```

## 日志

- 日志文件位置：`logs/`
- 错误日志：`logs/error.log`
- 所有日志：`logs/all.log`
- 控制台输出：彩色日志

## 测试

使用 Postman 或其他 API 测试工具测试接口：

1. 启动服务器：`npm start`
2. 导入 Postman 集合（可选）
3. 测试各个接口

## 部署

### 阿里云 ECS 部署

1. 上传代码到服务器
2. 安装 Node.js 和 npm
3. 配置环境变量
4. 安装依赖：`npm install --production`
5. 启动服务：`npm start`

### 使用 PM2 管理进程

```bash
npm install -g pm2
pm2 start server.js --name "todo-api"
pm2 save
pm2 startup
```

## 注意事项

1. 确保数据库连接配置正确
2. 生产环境请修改 CORS 配置
3. 定期备份数据库
4. 监控服务器日志
5. 设置适当的防火墙规则

## 许可证

MIT License
