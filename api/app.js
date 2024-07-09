import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from 'cors';
import { userRoutes, recipesRoutes, commentsRoutes, favoritesRoutes } from "./routes/index.js";


/*
* Conexión a laDB
*/
mongoose.connect("mongodb://127.0.0.1:27017/baratie", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Conectado a MongoDB...')
    })
    .catch(err => console.log('No se pudo conectar con MongoDB..', err));



const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/recipes", recipesRoutes);
app.use('/comments', commentsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/users', userRoutes);
app.use((req, res, next) => {
    res.status(404).send("La ruta ingresada es incorrecta. Intentelo nuevamente.");
});



const port = process.env.PORT || 3000;
app.listen(port);