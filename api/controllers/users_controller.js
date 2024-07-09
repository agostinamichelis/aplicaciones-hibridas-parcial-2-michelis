import Users from '../models/users_model.js';
import Recipes from '../models/recipes_model.js';
import Comments from '../models/comments_model.js';
import Favorites from '../models/favorites_model.js';
import bcrypt from "bcrypt";
import 'dotenv/config'
import jwt  from 'jsonwebtoken';



/**
 * Lee todos los usuarios
 */
export const getUsers = async (req, res) =>{
    try{
        let usuarios = await Users.find();
        res.json(usuarios)
    }catch(error ) {
        res.status(400).json(
            {
                error
            }
        )
    }
}


/**
 * Lee un usuario por su id
 */
export const getUser = async (req, res) =>{
    try{
        let usuario = await Users.find({_id: req.params.userId});
        res.json(usuario)
    }catch(error ) {
        res.status(400).json(
            {
                error
            }
        )
    }
}


/**
 * Registra un usuario
 */
export const registerUser = async (req, res) => {
    try {
        const { email, name, username, password } = req.body;

        if (!email || !name || !username || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "El correo electrónico no es válido" });
        }

        if (username.length < 5) {
            return res.status(400).json({ message: "El nombre de usuario debe tener al menos 5 caracteres" });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres, incluyendo al menos 1 letra y 1 número" });
        }

        let existingUser = await Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
        }

        existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo electrónico ya está en uso" });
        }

        let newUser = new Users({
            email: email,
            name: name,
            username: username,
            password: bcrypt.hashSync(password, 10)
        });

        let savedUser = await newUser.save();

        res.json({
            user: savedUser,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


/**
 * Loggea un usuario
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Users.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: 'El email no está registrado' });
        }
        const passwordValido = bcrypt.compareSync(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({ error: 'La contraseña no es correcta' });
        }
        const jwToken = jwt.sign({
            usuario: {
                _id: usuario._id,
                name: usuario.name,
                username: usuario.username,
                email: usuario.email
            }
        }, process.env.SEED, { expiresIn: process.env.EXPIRATION });

        res.json({
            usuario: {
                _id: usuario._id,
                name: usuario.name,
                username: usuario.username,
                email: usuario.email
            },
            jwToken
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


/**
 * Edita un usuario y actualiza sus datos
 */
export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email, password } = req.body;

    try {
        let updates = {};

        if (username) {
            updates.username = username;
        }
        if (email) {
            updates.email = email;
        }
        if (password) {
            updates.password = bcrypt.hashSync(password, 10);
        }

        const updatedUser = await Users.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        if (username) {
            await Recipes.updateMany({ 'creator.userId': userId }, { 'creator.username': username });
        }
        if (username) {
            await Favorites.updateMany({ userId: userId }, { username: username });
        }
        if (username) {
            await Comments.updateMany({ userId: userId }, { username: username });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




/**
 * Elimina un usuario y sus datos relacionados
 */
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await Recipes.deleteMany({ 'creator.userId': userId });

    await Comments.deleteMany({ userId });

    await Favorites.deleteMany({ userId });

    const user = await Users.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario y todos sus datos relacionados eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



  