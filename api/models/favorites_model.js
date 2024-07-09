import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipes',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    recipeName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Favorites', favoriteSchema);
