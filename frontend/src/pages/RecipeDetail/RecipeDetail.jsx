import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Comments from '../Comments/Comments';
import './RecipeDetail.scss';

const RecipeDetail = (props) => {
    const { recipeId } = useParams();
    const { user } = useContext(AuthContext);
    const [recipe, setRecipe] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (recipeId) {
            fetchRecipeDetail();
        }
    }, [recipeId]);

    useEffect(() => {
        if (user) {
            checkIfFavorite();
        }
    }, [recipeId, user]);

    const fetchRecipeDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/recipes/recipe-detail/${recipeId}`);
            setRecipe(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recipe details:', error);
            setError('Error al cargar los detalles de la receta.');
        }
    };

    const checkIfFavorite = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/favorites/user-favorites/${user._id}`);
            const favorites = response.data;
            setIsFavorite(favorites.some(favorite => favorite.recipeId._id === recipeId));
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const handleFavorite = async () => {
        try {
            if (isFavorite) {
                await axios.post('http://localhost:3000/favorites/remove', { userId: user._id, recipeId });
            } else {
                const response = await axios.post('http://localhost:3000/favorites/add', {
                    userId: user._id,
                    recipeId,
                    username: user.username,
                    recipeName: recipe.name,
                });
                if (response.data.message === 'Ya está en favoritos.') {
                    console.log('Ya está en favoritos.');
                }
            }
            checkIfFavorite();
        } catch (error) {
            console.error('Error updating favorite:', error);
        }
    };

    const deleteRecipe = async () => {
        try {
            await axios.delete(`http://localhost:3000/recipes/delete/${recipeId}`);
            window.location.href = document.referrer;
        } catch (error) {
            console.error('Error deleting recipe:', error);
            setError('Error al eliminar la receta.');
        }
    };

    if (loading) return <p>Cargando receta...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="card-detalle-contenedor">
            {recipe ? (
                <div className="card-detalle">
                    <h1>{recipe.name}</h1>
                    <div className="header-card-flex">
                        <div className="card-titulares">
                            <img className="card-img"
                                src="https://cdn.shopify.com/s/files/1/0561/3553/files/11_0049a823-78df-4319-8030-0f13bb06f468.jpg?v=1659524392" alt="" />
                            <p>{recipe.description}</p>
                        </div>

                        <div className="card-info-container">

                            <ul className="card-icons">
                                <li>
                                    <p className="favorites">{recipe.favorites}</p>
                                </li>
                                <li>
                                    <p className="comments">{recipe.comments}</p>
                                </li>
                                <li>
                                    <p className="cook">{recipe.creator.username}</p>
                                </li>
                                <li>
                                    <p className="date">{recipe.date}</p>
                                </li>
                            </ul>
                            <div className="card-ingredientes">
                                <h2>Ingredientes:</h2>
                                <ul>
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <li key={index}>
                                            <span>{ingredient.ingredientQuantity}</span> {ingredient.ingredientUnits} {ingredient.ingredientName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="card-porciones-tiempo">
                                <div className="card-porciones-tiempo-1">
                                    <h2>Porciones:  </h2>
                                    <p>{recipe.portions}</p>
                                </div>
                                <div className="card-porciones-tiempo-2">
                                    <h2>Preparación: </h2>
                                    <p>{recipe.time.hour} hr. {recipe.time.minutes} min.</p>
                                </div>
                            </div>
                            <div className="card-botones">
                                {user && user._id === recipe.creator.userId && (
                                    <div className="card-botones-editar-eliminar">
                                        <button>
                                            <Link to={`/recipes/edit/${recipeId}`}>Editar</Link>
                                        </button>
                                        <button onClick={deleteRecipe}>Eliminar</button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>




                    <div className="card-pasos-flex">
                        <h2>Pasos:</h2>
                        <ol>
                            {recipe.steps.map((step, index) => (
                                <li key={index}>
                                    <span>{step.stepNumber}</span> {step.stepDescription}
                                </li>
                            ))}
                        </ol>
                    </div>

                    
                    {user && (
                            <div className="card-botones-favoritos">
                            <button 
                                onClick={handleFavorite} 
                                className={isFavorite ? 'eliminar-favoritos' : 'agregar-favoritos'}
                            >
                                {isFavorite ? 'Eliminar de Favoritos' : 'Agregar a Favoritos'}
                            </button>
                        </div>
                        )}



                    <Comments recipeId={recipeId} />
                </div>
            ) : (
                <p>No se encontraron detalles de la receta.</p>
            )
            }
        </section >
    );
};

export { RecipeDetail };
