import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './RecipeAdd.scss';

const RecipeAdd = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [recipe, setRecipe] = useState({
        name: '',
        description: '',
        ingredients: [{
            ingredientQuantity: 1,
            ingredientUnits: 'u.',
            ingredientName: ''
        }],
        steps: [{
            stepNumber: 1,
            stepDescription: ''
        }],
        time: { hour: 0, minutes: 0 },
        portions: 1,
        favorites: 0,
        creator: {
            userId: user._id,
            username: user.username
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'hour' || name === 'minutes') {
            setRecipe({
                ...recipe,
                time: {
                    ...recipe.time,
                    [name]: parseInt(value)
                }
            });
        } else {
            setRecipe({ ...recipe, [name]: value });
        }
    };

    const handleAddIngredient = () => {
        const newIngredient = {
            ingredientQuantity: 0,
            ingredientUnits: 'u.',
            ingredientName: ''
        };
        setRecipe({
            ...recipe,
            ingredients: [...recipe.ingredients, newIngredient]
        });
    };

    const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const updatedIngredients = [...recipe.ingredients];
        updatedIngredients[index] = {
            ...updatedIngredients[index],
            [name]: value
        };
        setRecipe({ ...recipe, ingredients: updatedIngredients });
    };

    const handleStepChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSteps = [...recipe.steps];
        updatedSteps[index] = {
            ...updatedSteps[index],
            [name]: value,
        };
        setRecipe({ ...recipe, steps: updatedSteps });
    };

    const handleAddStep = () => {
        const newStepNumber = recipe.steps.length + 1;
        const newStep = {
            stepNumber: newStepNumber,
            stepDescription: ''
        };
        setRecipe({ ...recipe, steps: [...recipe.steps, newStep] });
    };

    const handleDeleteStep = (index) => {
        const updatedSteps = recipe.steps.filter((step, i) => i !== index);
        const renumberedSteps = updatedSteps.map((step, idx) => ({
            ...step,
            stepNumber: idx + 1
        }));
        setRecipe({ ...recipe, steps: renumberedSteps });
    };

    const handleDragStart = (index) => (event) => {
        event.dataTransfer.setData('index', index.toString());
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (targetIndex) => (event) => {
        const sourceIndex = parseInt(event.dataTransfer.getData('index'));
        const updatedSteps = [...recipe.steps];
        const movedStep = updatedSteps.splice(sourceIndex, 1)[0];
        updatedSteps.splice(targetIndex, 0, movedStep);

        updatedSteps.forEach((step, i) => {
            step.stepNumber = i + 1;
        });

        setRecipe({ ...recipe, steps: updatedSteps });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/recipes/add', recipe);
            navigate('/recipes');
        } catch (error) {
            if (error.response) {
                console.error(error.response.data);
            }
        }
    };

    return (
        <section className="recipe-add-container">
            <h2>Agregar Nueva Receta</h2>
            <form onSubmit={handleSubmit}>
                <div className="add-nombre">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={recipe.name}
                        onChange={handleChange}
                        placeholder="Nombre de la receta"
                    />
                </div>
                <div className="add-descripcion">
                    <label>Descripción:</label>
                    <textarea
                        name="description"
                        value={recipe.description}
                        onChange={handleChange}
                        placeholder="Descripción"
                    />
                </div>
                <div className="add-ingredientes">
                    <label className="label-ingredientes">Ingredientes:</label>
                    <div className="contenedor-add-ingredientes">
                        {recipe.ingredients.map((ingredient, index) => (
                            <div className="add-ingrediente" key={index}>
                                <input
                                    type="number"
                                    name="ingredientQuantity"
                                    value={ingredient.ingredientQuantity}
                                    onChange={(e) => handleIngredientChange(index, e)}
                                    placeholder="Cantidad"
                                />
                                <select
                                    name="ingredientUnits"
                                    value={ingredient.ingredientUnits}
                                    onChange={(e) => handleIngredientChange(index, e)}
                                >
                                    {['u.', 'cda.', 'cdta.', 'lt', 'ml', 'cm3', 'kg', 'gr', 'lb', 'oz', 'taza', 'pizca', 'paquete'].map((unit, idx) => (
                                        <option key={idx} value={unit}>{unit}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    name="ingredientName"
                                    value={ingredient.ingredientName}
                                    onChange={(e) => handleIngredientChange(index, e)}
                                    placeholder="Nombre del ingrediente"
                                />
                            </div>
                        ))}
                        <div className="btn-ingrediente">
                        <button type="button" onClick={handleAddIngredient}>Agregar Ingrediente</button>
                        </div>
                    </div>

                </div>
                <div className="add-pasos">
                    <label className="label-pasos">Pasos:</label>
                    {recipe.steps.map((step, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={(event) => handleDragStart(index)(event)}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop(index)}
                        >
                            <label className="step-number">{step.stepNumber}</label>
                            <input
                                type="text"
                                name="stepDescription"
                                value={step.stepDescription}
                                onChange={(e) => handleStepChange(index, e)}
                                placeholder="Descripción del paso"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteStep(index)}
                                disabled={recipe.steps.length === 1}
                            >
                                Eliminar Paso
                            </button>
                        </div>
                    ))}
                    <button className="add-pasos-btn" type="button" onClick={handleAddStep}>Agregar otro paso</button>
                </div>
                <div className="tiempo-porciones">
                    <div className="add-tiempo">
                        <label>Tiempo:</label>
                        <input
                            type="number"
                            name="hour"
                            value={recipe.time.hour}
                            onChange={handleChange}
                            placeholder="Horas"
                        /> <p>hr.</p>
                        <input
                            type="number"
                            name="minutes"
                            value={recipe.time.minutes}
                            onChange={handleChange}
                            placeholder="Minutos"
                        /> <p>min.</p>
                    </div>
                    <div className="add-porciones">
                        <label>Porciones:</label>
                        <input
                            type="number"
                            name="portions"
                            value={recipe.portions}
                            onChange={handleChange}
                            placeholder="Porciones"
                        />
                    </div>
                </div>


                <div className="btn-add">
                    <button type="submit">Agregar Receta</button>
                </div>
            </form>
        </section>
    );
};

export { RecipeAdd };
