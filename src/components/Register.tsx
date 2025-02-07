import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Envía la solicitud POST al servidor
      await axios.post('http://localhost:4000/api/register', { username, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error al registrar usuario', error);

      // Maneja el error de Axios específicamente
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'Error al registrar usuario. Intenta con otro nombre de usuario.');
      } else {
        setError('Error desconocido al registrar usuario');
      }
    }
  };

  return (
    <div className='register'>
      <h2>Registrar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Usuario registrado con éxito. Redirigiendo...</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;

