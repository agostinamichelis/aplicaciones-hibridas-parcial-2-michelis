import React, { useEffect, useState, useContext } from 'react';
import Search from '../../components/Search/Search.jsx';
import Header from '../../components/Header/Header.jsx';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Recipes.scss';
import { useNavigate, Link } from 'react-router-dom';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const { auth, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <div>
      <Header />
      <Search setRecipes={setRecipes} initialRecipes={recipes} />
      <section className="section-cards">
        <ul className="contenedor-cards">
          {recipes.map((recipe) => (
            <li key={recipe._id} className="card">
              <h4>{recipe.name}</h4>
              <div className="contenedor-img">
                <img src="https://cdn.shopify.com/s/files/1/0561/3553/files/11_0049a823-78df-4319-8030-0f13bb06f468.jpg?v=1659524392" alt="" />
              </div>
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
      </section>
    </div>
  );
};

export { Recipes };
