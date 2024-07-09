import express from 'express';
import { getAllRecipes, createRecipe, getRecipeById, updateRecipe, deleteRecipe, getRecipesByCreator, searchRecipes } from '../controllers/recipes_controller.js';

const recipesRoutes = express.Router();

recipesRoutes.get('/', getAllRecipes);
recipesRoutes.post('/add', createRecipe);
recipesRoutes.get('/recipe-detail/:recipeId', getRecipeById);
recipesRoutes.get('/my-recipes/:userId', getRecipesByCreator);
recipesRoutes.put('/edit/:id', updateRecipe);
recipesRoutes.delete('/delete/:id', deleteRecipe);
recipesRoutes.get('/search', searchRecipes);

export { recipesRoutes };
