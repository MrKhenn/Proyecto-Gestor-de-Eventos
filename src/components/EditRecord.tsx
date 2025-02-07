import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecords, updateRecord, Record } from '../api/records'; // Importa las funciones necesarias

const EditRecord: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [organizer, setOrganizer] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar el registro específico para editar
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
          return;
        }

        // Hacer la solicitud para obtener el registro
        const data = await getRecords(token);
        const recordToEdit = data.find((record) => record._id === id);

        if (recordToEdit) {
          setName(recordToEdit.name);
          setDescription(recordToEdit.description);
          setDate(recordToEdit.date);
          setOrganizer(recordToEdit.organizer);
        } else {
          Swal.fire('Error', 'Registro no encontrado.', 'error');
        }
      } catch (error) {
        console.error('Error al cargar el registro:', error);
        Swal.fire('Error', 'Hubo un error al cargar el registro.', 'error');
      }
    };

    if (id) fetchRecord();
  }, [id]);

  // Manejar la actualización del registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
      return;
    }

    const updatedRecord: Partial<Record> = { name, description, date, organizer };

    try {
      await updateRecord(id!, updatedRecord, token); // Actualizar el registro con el token
      Swal.fire('Actualizado', 'El registro ha sido actualizado.', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      Swal.fire('Error', 'Hubo un error al actualizar el registro.', 'error');
    }
  };

  return (
    <div>
      <h2>Editar Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Descripción:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Fecha:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label>Organizador:</label>
        <input
          type="text"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
        />
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditRecord;
