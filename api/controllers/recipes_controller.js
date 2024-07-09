import Recipes from '../models/recipes_model.js';
import Comments from '../models/comments_model.js';
import Favorites from '../models/favorites_model.js';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';


/**
 * Lee todas las recetas
 */
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    const formattedRecipes = recipes.map(recipe => ({
      ...recipe._doc,
      date: format(new Date(recipe.date), 'dd MMM yy', { locale: es }) 
    }));
    res.json(formattedRecipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Crea una receta
 */
export const createRecipe = async (req, res) => {
  console.log(req.body)
  const recipe = new Recipes({
    name: req.body.name,
    description: req.body.description,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    time: req.body.time,
    portions: req.body.portions,
    favorites: req.body.favorites,
    creator: req.body.creator,
  });

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/**
 * Lee una receta por su id
 */
export const getRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipes.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }
    const formattedRecipe = {
      ...recipe._doc,
      date: format(new Date(recipe.date), 'dd MMM yy', { locale: es }) 
    };
    res.json(formattedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Actualiza una receta
 */
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    recipe.name = req.body.name ?? recipe.name;
    recipe.description = req.body.description ?? recipe.description;
    recipe.ingredients = req.body.ingredients ?? recipe.ingredients;
    recipe.steps = req.body.steps ?? recipe.steps;
    recipe.time = req.body.time ?? recipe.time;
    recipe.portions = req.body.portions ?? recipe.portions;
    recipe.favorites = req.body.favorites ?? recipe.favorites;
    recipe.creator = req.body.creator ?? recipe.creator;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/**
 * Borra una receta
 */
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findByIdAndDelete(req.params.id);
    if (recipe == null) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }
    await Comments.deleteMany({ recipeId: req.params.id });
    await Favorites.deleteMany({ recipeId: req.params.id });

    res.json({ message: 'Receta y datos relacionados eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const getRecipesByCreator = async (req, res) => {
  const { userId } = req.params;
  try {
    const recipes = await Recipes.find({ 'creator.userId': userId });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const searchRecipes = async (req, res) => {
  const { name } = req.query;
  try {
    const recipes = await Recipes.find({ name: { $regex: name, $options: 'i' } });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};