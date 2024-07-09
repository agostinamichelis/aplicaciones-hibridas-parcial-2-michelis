// routes/commentRoutes.js
import express from 'express';
import { getCommentsByRecipeId, createComment, updateComment, deleteComment } from '../controllers/comments_controller.js';

const commentsRoutes = express.Router();

commentsRoutes.get('/:recipeId', getCommentsByRecipeId);
commentsRoutes.post('/', createComment);
commentsRoutes.put('/:commentId', updateComment);
commentsRoutes.delete('/:commentId', deleteComment);

export { commentsRoutes };