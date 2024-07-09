import { Link, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { Home, Recipes, Access, MyProfile, RecipeDetail, RecipeEdit, RecipeAdd, MyFavorites, Config } from './pages';
import ProtectedRoutes from './utils/ProtectedRoutes';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Search from './components/Search/Search';
import Footer from './components/Footer/Footer';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path='/recipes/my-recipes' element={<MyProfile />} />
            <Route path='/recipes/my-recipes/favorites' element={<MyFavorites />} />
            <Route path='/recipes/edit/:recipeId' element={<RecipeEdit />} />
            <Route path='/recipes/add' element={<RecipeAdd />} />
            <Route path='/update/:userId' element={<Config />} />
          </Route>

          <Route path='/recipes' element={<Recipes />} />
          <Route path='/recipes/search' element={<Search />} />
          <Route path='/recipes/recipe-detail/:recipeId' element={<RecipeDetail />} />
          <Route path='/' element={<Home />} />
          <Route path='/access' element={<Access />} />
        </Routes>

        {user && location.pathname !== '/recipes/add' && (
          <div className='floating-btn-container'>
            <button className='btn-agregar-receta'>
              <Link to='/recipes/add'>Agregar Receta</Link>
            </button>
          </div>
        )}
      </main>

      {location.pathname !== '/access' && (
        <Footer />)
      }
    </>
  );
}

export default App;
