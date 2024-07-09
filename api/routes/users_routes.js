import express from 'express';
import { getUsers, getUser, registerUser, loginUser, updateUser, deleteUser } from '../controllers/users_controller.js';
import { verificarToken } from '../middlewares/auth.js';

const userRoutes = express.Router();

userRoutes.get('/', verificarToken, getUsers);
userRoutes.get('/find/:userId', getUser);
userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.put('/update/:userId', verificarToken, updateUser);
userRoutes.delete('/delete/:userId', verificarToken, deleteUser);

export { userRoutes };
