const express = require('express');
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteMultipleTodos,
  toggleTodoStatus
} = require('../controllers/todoController');

const router = express.Router();

/**
 * Todo 路由配置
 * 定义所有待办事项相关的 API 端点
 */

/**
 * @route   GET /api/todos
 * @desc    获取所有待办事项
 * @access  Public
 * @returns {Object} 包含所有待办事项的数组
 */
router.get('/', getAllTodos);

/**
 * @route   GET /api/todos/:id
 * @desc    根据 ID 获取单个待办事项
 * @access  Public
 * @param   {number} id - 待办事项 ID
 * @returns {Object} 包含待办事项详情的对象
 */
router.get('/:id', getTodoById);

/**
 * @route   POST /api/todos
 * @desc    创建新的待办事项
 * @access  Public
 * @body    {string} value - 待办事项内容
 * @returns {Object} 包含新创建的待办事项的对象
 */
router.post('/', createTodo);

/**
 * @route   PUT /api/todos/:id
 * @desc    更新待办事项
 * @access  Public
 * @param   {number} id - 待办事项 ID
 * @body    {string} value - 新的待办事项内容（可选）
 * @body    {boolean} is_completed - 完成状态（可选）
 * @returns {Object} 包含更新后的待办事项的对象
 */
router.put('/:id', updateTodo);

/**
 * @route   PATCH /api/todos/:id/toggle
 * @desc    切换待办事项完成状态
 * @access  Public
 * @param   {number} id - 待办事项 ID
 * @returns {Object} 包含更新后的待办事项的对象
 */
router.patch('/:id/toggle', toggleTodoStatus);

/**
 * @route   DELETE /api/todos/:id
 * @desc    删除单个待办事项
 * @access  Public
 * @param   {number} id - 待办事项 ID
 * @returns {Object} 删除成功的消息
 */
router.delete('/:id', deleteTodo);

/**
 * @route   DELETE /api/todos
 * @desc    批量删除待办事项
 * @access  Public
 * @body    {Array} ids - 待删除的待办事项 ID 数组
 * @returns {Object} 批量删除成功的消息
 */
router.delete('/', deleteMultipleTodos);

module.exports = router;
