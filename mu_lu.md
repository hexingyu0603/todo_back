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
├── .env                 # 环境变量（不提交到代码仓库）
├── .env.example         # 环境变量示例（提交到仓库，指导配置）
├── app.js               # Express应用入口
└── server.js            # 服务器启动文件