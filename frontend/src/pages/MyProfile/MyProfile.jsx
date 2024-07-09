import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './MyProfile.scss';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [myRecipes, setMyRecipes] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      fetchMyRecipes();
    }
  }, [user]);

  const fetchMyRecipes = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/recipes/my-recipes/${user._id}`);
      setMyRecipes(response.data);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <section className="section-cards my-recipes">
        <h1>Mis Recetas <span>@{user.email}</span></h1>
        <div className="buttons-container">
          <button className="btn-config">
            <Link to={`/update/${user._id}`}>Configuración</Link>
          </button>
          <button className="btn-favorites">
            <Link to={`/recipes/my-recipes/favorites`}>Favoritos</Link>
          </button>
        </div>
        {myRecipes.length > 0 ? (
          <ul className="contenedor-cards">
            {myRecipes.map((recipe) => (
              <li key={recipe._id} className="card">
                <h4>{recipe.name}</h4>
                <img src="https://cdn.shopify.com/s/files/1/0561/3553/files/11_0049a823-78df-4319-8030-0f13bb06f468.jpg?v=1659524392" alt="" />
                <ul>
                  <li>
                    <p>{recipe.description}</p>
                  </li>
                  <li>
                    <p className='ingredients'>{recipe.ingredients.length} Ingredientes</p>
                  </li>
                  <li>
                    <p className='portions'>{recipe.portions} Porciones</p>
                  </li>
                  <li>
                    <p className='cook'>{recipe.creator.username}</p>
                  </li>
                </ul>
                <div className="btn-favs-comments">
                  <div className="favs-comments">
                    <p>{recipe.favorites}</p>
                    <p>{recipe.comments}</p>
                  </div>
                  <div className="btn-cocinar">
                    <button>
                      <Link to={`/recipes/recipe-detail/${recipe._id}`}>Cocinar</Link>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No has creado ninguna receta.</p>
        )}
      </section>
    </div>
  );
};

export { MyProfile };
