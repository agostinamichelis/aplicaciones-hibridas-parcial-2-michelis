import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.module.scss';

const Search = ({ setRecipes }) => {
  const [search, setSearch] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/recipes/search`, { params: { name: search } });
        setRecipes(response.data);
      } catch (error) {
        console.error('Error searching recipes:', error);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, setRecipes]);

  return (

    <div>
      <h2>¿Qué querés cocinar hoy en <span>Baratie</span> ?</h2>
      <form>
        <input
          type="text"
          placeholder="Busca recetas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
    </div>
  
  );
};

export default Search;
