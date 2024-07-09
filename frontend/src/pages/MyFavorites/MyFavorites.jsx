import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const MyFavorites = () => {
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/favorites/user-favorites/${user._id}`);
            setFavorites(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError('Error al cargar los favoritos.');
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando favoritos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="section-cards my-recipes">
            <div className="my-favorites">
                <h1>Mis Favoritos</h1>
                <ul className="contenedor-cards">
                    {favorites.map((favorite) => (
                        <li key={favorite._id} className="card">
                            <h4>{favorite.recipeName}</h4>
                            <img src="https://cdn.shopify.com/s/files/1/0561/3553/files/11_0049a823-78df-4319-8030-0f13bb06f468.jpg?v=1659524392" alt="" />

                            <ul>
                                <li>
                                    <p>{favorite.recipeId.description}</p>
                                </li>
                                <li>
                                    <p className='ingredients'>{favorite.recipeId.ingredients.length} Ingredientes</p>
                                </li>
                                <li>
                                    <p className='portions'>{favorite.recipeId.portions} Porciones</p>
                                </li>
                                <li>
                                    <p className='cook'>{favorite.recipeId.creator.username}</p>
                                </li>
                            </ul>
                            <div className="btn-favs-comments">
                                <div className="favs-comments">
                                    <p>{favorite.recipeId.favorites}</p>
                                    <p>{favorite.recipeId.comments}</p>
                                </div>
                                <div className="btn-cocinar">
                                    <button><Link to={`/recipes/recipe-detail/${favorite.recipeId._id}`}>Cocinar</Link></button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export { MyFavorites };
