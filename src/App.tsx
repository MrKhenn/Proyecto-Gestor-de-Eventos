import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; // Ya no necesitas BrowserRouter
import Inicio from './components/Inicio';
import CreateRecord from './components/CreateRecord';
import EditRecord from './components/EditRecord';
import RecordList from './components/RecordList';
import Login from './components/Login';
import Register from './components/Register';
import { AuthContext } from './api/AuthContext';
import Footer from './components/Footer'; // Asegúrate de importar el componente Footer
import './App.css';

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const authContext = useContext(AuthContext);

  return authContext?.isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const authContext = useContext(AuthContext);

  // Si aún está cargando la autenticación, no renderices nada (o un loader)
  if (authContext?.loading) {
    return <div>Cargando...</div>;  // Puedes personalizar esto con un spinner o algo visual
  }

  return (
    <div>
      <nav>
        <ul>
          <li><a href="/">Inicio</a></li>
          {authContext?.isAuthenticated ? (
            <>
              <li><a href="/create">Crear Nuevo Evento</a></li>
              <li><a href="/records">Eventos</a></li>
              <li>Bienvenido, {authContext.user?.username} <button onClick={authContext.logout}>Cerrar Sesión</button></li>
            </>
          ) : (
            <>
              <li><a href="/login">Iniciar Sesión</a></li>
              <li><a href="/register">Registrar</a></li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/create" element={<PrivateRoute element={<CreateRecord />} />} />
        <Route path="/edit/:id" element={<PrivateRoute element={<EditRecord />} />} />
        <Route path="/records" element={<PrivateRoute element={<RecordList />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;