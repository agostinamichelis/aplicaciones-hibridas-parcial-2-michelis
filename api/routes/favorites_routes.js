// routes/favoriteRoutes.js
import express from 'express';
import { addFavorite, removeFavorite, getUserFavorites } from '../controllers/favorites_controller.js';

const favoritesRoutes = express.Router();

favoritesRoutes.post('/add', addFavorite);
favoritesRoutes.post('/remove', removeFavorite);
favoritesRoutes.get('/user-favorites/:userId', getUserFavorites);

export { favoritesRoutes };
