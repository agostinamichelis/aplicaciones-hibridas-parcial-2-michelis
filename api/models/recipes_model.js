import mongoose from "mongoose";

const ingredientsSchema = new mongoose.Schema({
    ingredientQuantity: {
        type: Number,
        required: true
    },
    ingredientUnits: {
        type: String,
        enum: ['u.', 'cda.', 'cdta.', 'lt', 'ml', 'cm3', 'kg', 'gr', 'lb', 'oz', 'taza', 'pizca', 'paquete'],
        default: 'u.',
        required: true
    },
    ingredientName: {
        type: String,
        required: true
    }
});
const stepsSchema = new mongoose.Schema({
    stepNumber: {
        type: Number,
        required: true
    },
    stepDescription: {
        type: String,
        required: true
    }
});
const creatorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

const recipesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: [ingredientsSchema],
        required: true
    },
    steps: {
        type: [stepsSchema],
        required: true
    },
    time: {
        hour: {
            type: Number,
            required: true
        },
        minutes: {
            type: Number,
            required: true
        }
    },
    portions: {
        type: Number,
        required: true
    },
    favorites: {
        type: Number,
        default: 0,
        required: false
    },
    comments: {
        type: Number,
        default: 0,
        required: false
    },
    creator: {
        type: creatorSchema,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Recipes", recipesSchema);