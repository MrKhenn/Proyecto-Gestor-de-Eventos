import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRecord: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [organizer, setOrganizer] = useState<string>('');
  const navigate = useNavigate(); // Para redirigir después de crear el registro

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name || !description || !date || !organizer) {
      alert('Por favor completa todos los campos');
      return;
    }
  
    try {
      console.log({ name, description, date, organizer }); // Verifica los valores antes de enviar

      // Obtener el token del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado, por favor inicia sesión.');
        return;
      }

      // Agregar el token al encabezado Authorization
      const response = await axios.post(
        'http://localhost:4000/api/records',
        { name, description, date, organizer },
        {
          headers: {
            Authorization: `Bearer ${token}` // Aquí se incluye el token
          }
        }
      );

      if (response.status === 201) {
        alert('Registro creado exitosamente!');
        navigate('/records');
      }
    } catch (error) {
      console.error('Error al crear el registro', error);
      alert('Hubo un error al crear el registro');
    }
  };

  return (
    <div className='CrearEvento'>
      <h2>Crear Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="date">Fecha</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="organizer">Organizador</label>
          <input
            type="text"
            id="organizer"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default CreateRecord;
