const { query } = require('../config/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

/**
 * Todo 控制器
 * 处理待办事项的增删改查操作
 */

/**
 * 获取所有待办事项
 * @route GET /api/todos
 * @returns {Object} 包含所有待办事项的响应
 */
const getAllTodos = asyncHandler(async (req, res) => {
  logger.info('获取所有待办事项');
  
  const sql = `
    SELECT 
      id,
      value,
      is_completed,
      created_at
    FROM todo_list 
    ORDER BY created_at DESC
  `;
  
  const todos = await query(sql);
  
  logger.info(`成功获取 ${todos.length} 个待办事项`);
  
  res.status(200).json({
    success: true,
    data: todos,
    count: todos.length
  });
});

/**
 * 根据 ID 获取单个待办事项
 * @route GET /api/todos/:id
 * @param {number} id - 待办事项 ID
 * @returns {Object} 包含待办事项详情的响应
 */
const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  logger.info(`获取待办事项 ID: ${id}`);
  
  const sql = `
    SELECT 
      id,
      value,
      is_completed,
      created_at
    FROM todo_list 
    WHERE id = ?
  `;
  
  const todos = await query(sql, [id]);
  
  if (todos.length === 0) {
    throw new AppError('待办事项不存在', 404);
  }
  
  logger.info(`成功获取待办事项 ID: ${id}`);
  
  res.status(200).json({
    success: true,
    data: todos[0]
  });
});

/**
 * 创建新的待办事项
 * @route POST /api/todos
 * @param {string} value - 待办事项内容
 * @returns {Object} 包含新创建的待办事项的响应
 */
const createTodo = asyncHandler(async (req, res) => {
  const { value } = req.body;
  
  // 验证输入
  if (!value || value.trim() === '') {
    throw new AppError('待办事项内容不能为空', 400);
  }
  
  if (value.length > 255) {
    throw new AppError('待办事项内容不能超过255个字符', 400);
  }
  
  logger.info(`创建新待办事项: ${value}`);
  
  const sql = `
    INSERT INTO todo_list (value, is_completed) 
    VALUES (?, 0)
  `;
  
  const result = await query(sql, [value.trim()]);
  
  // 获取新创建的待办事项
  const getTodoSql = `
    SELECT 
      id,
      value,
      is_completed,
      created_at
    FROM todo_list 
    WHERE id = ?
  `;
  
  const newTodo = await query(getTodoSql, [result.insertId]);
  
  logger.info(`成功创建待办事项 ID: ${result.insertId}`);
  
  res.status(201).json({
    success: true,
    message: '待办事项创建成功',
    data: newTodo[0]
  });
});

/**
 * 更新待办事项
 * @route PUT /api/todos/:id
 * @param {number} id - 待办事项 ID
 * @param {string} value - 新的待办事项内容
 * @param {boolean} is_completed - 完成状态
 * @returns {Object} 包含更新后的待办事项的响应
 */
const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { value, is_completed } = req.body;
  
  logger.info(`更新待办事项 ID: ${id}`);
  
  // 检查待办事项是否存在
  const checkSql = 'SELECT id FROM todo_list WHERE id = ?';
  const existingTodo = await query(checkSql, [id]);
  
  if (existingTodo.length === 0) {
    throw new AppError('待办事项不存在', 404);
  }
  
  // 构建更新 SQL
  let updateFields = [];
  let updateValues = [];
  
  if (value !== undefined) {
    if (value.trim() === '') {
      throw new AppError('待办事项内容不能为空', 400);
    }
    if (value.length > 255) {
      throw new AppError('待办事项内容不能超过255个字符', 400);
    }
    updateFields.push('value = ?');
    updateValues.push(value.trim());
  }
  
  if (is_completed !== undefined) {
    updateFields.push('is_completed = ?');
    updateValues.push(is_completed ? 1 : 0);
  }
  
  if (updateFields.length === 0) {
    throw new AppError('请提供要更新的字段', 400);
  }
  
  updateValues.push(id);
  
  const sql = `
    UPDATE todo_list 
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `;
  
  await query(sql, updateValues);
  
  // 获取更新后的待办事项
  const getTodoSql = `
    SELECT 
      id,
      value,
      is_completed,
      created_at
    FROM todo_list 
    WHERE id = ?
  `;
  
  const updatedTodo = await query(getTodoSql, [id]);
  
  logger.info(`成功更新待办事项 ID: ${id}`);
  
  res.status(200).json({
    success: true,
    message: '待办事项更新成功',
    data: updatedTodo[0]
  });
});

/**
 * 删除待办事项
 * @route DELETE /api/todos/:id
 * @param {number} id - 待办事项 ID
 * @returns {Object} 删除成功的响应
 */
const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  logger.info(`删除待办事项 ID: ${id}`);
  
  // 检查待办事项是否存在
  const checkSql = 'SELECT id FROM todo_list WHERE id = ?';
  const existingTodo = await query(checkSql, [id]);
  
  if (existingTodo.length === 0) {
    throw new AppError('待办事项不存在', 404);
  }
  
  const sql = 'DELETE FROM todo_list WHERE id = ?';
  await query(sql, [id]);
  
  logger.info(`成功删除待办事项 ID: ${id}`);
  
  res.status(200).json({
    success: true,
    message: '待办事项删除成功'
  });
});

/**
 * 批量删除待办事项
 * @route DELETE /api/todos
 * @param {Array} ids - 待删除的待办事项 ID 数组
 * @returns {Object} 批量删除成功的响应
 */
const deleteMultipleTodos = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new AppError('请提供要删除的待办事项 ID 数组', 400);
  }
  
  logger.info(`批量删除待办事项: ${ids.join(', ')}`);
  
  // 验证所有 ID 是否存在
  const placeholders = ids.map(() => '?').join(',');
  const checkSql = `SELECT id FROM todo_list WHERE id IN (${placeholders})`;
  const existingTodos = await query(checkSql, ids);
  
  if (existingTodos.length !== ids.length) {
    throw new AppError('部分待办事项不存在', 404);
  }
  
  const deleteSql = `DELETE FROM todo_list WHERE id IN (${placeholders})`;
  await query(deleteSql, ids);
  
  logger.info(`成功批量删除 ${ids.length} 个待办事项`);
  
  res.status(200).json({
    success: true,
    message: `成功删除 ${ids.length} 个待办事项`
  });
});

/**
 * 切换待办事项完成状态
 * @route PATCH /api/todos/:id/toggle
 * @param {number} id - 待办事项 ID
 * @returns {Object} 包含更新后的待办事项的响应
 */
const toggleTodoStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  logger.info(`切换待办事项状态 ID: ${id}`);
  
  // 检查待办事项是否存在并获取当前状态
  const checkSql = 'SELECT id, is_completed FROM todo_list WHERE id = ?';
  const existingTodo = await query(checkSql, [id]);
  
  if (existingTodo.length === 0) {
    throw new AppError('待办事项不存在', 404);
  }
  
  const currentStatus = existingTodo[0].is_completed;
  const newStatus = currentStatus ? 0 : 1;
  
  const sql = `
    UPDATE todo_list 
    SET is_completed = ?
    WHERE id = ?
  `;
  
  await query(sql, [newStatus, id]);
  
  // 获取更新后的待办事项
  const getTodoSql = `
    SELECT 
      id,
      value,
      is_completed,
      created_at
    FROM todo_list 
    WHERE id = ?
  `;
  
  const updatedTodo = await query(getTodoSql, [id]);
  
  logger.info(`成功切换待办事项状态 ID: ${id}, 新状态: ${newStatus ? '已完成' : '未完成'}`);
  
  res.status(200).json({
    success: true,
    message: `待办事项已${newStatus ? '完成' : '取消完成'}`,
    data: updatedTodo[0]
  });
});

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteMultipleTodos,
  toggleTodoStatus
};
