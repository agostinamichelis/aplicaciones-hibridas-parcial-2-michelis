import Comments from '../models/comments_model.js';
import Recipes from '../models/recipes_model.js';


/**
 * Busca los comentarios de una receta por el id de la receta
 */
export const getCommentsByRecipeId = async (req, res) => {
    try {
        const comments = await Comments.find({ recipeId: req.params.recipeId }).sort({ date: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comentarios.', error: error.message  });
    }
};


/**
 * Crea un comentario
 */
export const createComment = async (req, res) => {
    try {
        const newComment = new Comments({
            recipeId: req.body.recipeId,
            userId: req.body.userId,
            username: req.body.username,
            content: req.body.content,
        });
        const savedComment = await newComment.save();

        await Recipes.findByIdAndUpdate(req.body.recipeId, { $inc: { comments: 1 } });

        res.json(savedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear comentario.', error: error.message  });
    }
};


/**
 * Borra un comentario
 */
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comments.findByIdAndDelete(req.params.commentId);

        if (comment) {
            await Recipes.findByIdAndUpdate(comment.recipeId, { $inc: { comments: -1 } });
            res.json({ message: 'Comentario eliminado correctamente.' });
        } else {
            res.status(404).json({ message: 'Comentario no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar comentario.', error: error.message  });
    }
};


/**
 * Edita un comentario
 */
export const updateComment = async (req, res) => {
    try {
        const updatedComment = await Comments.findByIdAndUpdate(
            req.params.commentId,
            { content: req.body.content },
            { new: true }
        );
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar comentario.', error: error.message  });
    }
};
