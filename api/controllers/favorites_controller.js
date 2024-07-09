import Favorites from '../models/favorites_model.js';
import Recipes from '../models/recipes_model.js';
import Users from '../models/users_model.js';


/**
 * Agrega un favorito
 */
export const addFavorite = async (req, res) => {
    try {
        const existingFavorite = await Favorites.findOne({
            userId: req.body.userId,
            recipeId: req.body.recipeId,
        });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Ya está en favoritos.' });
        }

        const recipe = await Recipes.findById(req.body.recipeId);
        const user = await Users.findById(req.body.userId);

        if (!recipe || !user) {
            return res.status(404).json({ message: 'Usuario o receta no encontrados.' });
        }

        const newFavorite = new Favorites({
            userId: req.body.userId,
            recipeId: req.body.recipeId,
            username: user.username,
            recipeName: recipe.name,
        });
        await newFavorite.save();
        
        recipe.favorites += 1;
        await recipe.save();
        
        res.json(newFavorite);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar a favoritos.', error: error.message  });
    }
};


/**
 * Borra un favorito
 */
export const removeFavorite = async (req, res) => {
    try {
        const favorite = await Favorites.findOneAndDelete({
            userId: req.body.userId,
            recipeId: req.body.recipeId,
        });

        if (favorite) {
            const recipe = await Recipes.findById(req.body.recipeId);
            if (recipe) {
                recipe.favorites -= 1;
                await recipe.save();
            }
        }
        
        res.json({ message: 'Eliminado de favoritos.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar de favoritos.', error: error.message  });
    }
};


/**
 * Lee los favoritos de un usuario por su id
 */
export const getUserFavorites = async (req, res) => {
    try {
        const favorites = await Favorites.find({ userId: req.params.userId }).populate('recipeId');
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener favoritos.', error: error.message });
    }
};
