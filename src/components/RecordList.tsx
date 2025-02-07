import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getRecords, updateRecord, deleteRecord, Record } from '../api/records'; // Asegúrate que estas funciones estén adecuadas para enviar el token.
import '../styles/RecordList.css';

const RecordList: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);

  // Cargar registros desde la API
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token desde el localStorage
      if (!token) {
        Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
        return;
      }
      const data = await getRecords(token); // Pasar el token a la función
      setRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      console.error('Error al cargar los registros', error);
      Swal.fire('Error', 'Hubo un error al cargar los registros.', 'error');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Manejar cambios en la barra de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = records.filter((record) =>
      record.name.toLowerCase().includes(term) ||
      record.description.toLowerCase().includes(term) ||
      record.organizer.toLowerCase().includes(term)
    );
    setFilteredRecords(filtered);
  };

  // Función para manejar la eliminación
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRecord(id, token); // Pasar el token a la función
          Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
          fetchRecords();
        } catch (error) {
          console.error('Error al eliminar el registro', error);
          Swal.fire('Error', 'Hubo un error al eliminar el registro.', 'error');
        }
      }
    });
  };

  // Función para manejar la edición
  const handleEdit = async (record: Record) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Acceso denegado', 'Por favor inicia sesión.', 'error');
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Editar Registro',
      html:
        `<input id="swal-input-name" class="swal2-input" placeholder="Nombre" value="${record.name}">` +
        `<textarea id="swal-input-description" class="swal2-textarea" placeholder="Descripción">${record.description}</textarea>` +
        `<input id="swal-input-date" class="swal2-input" type="date" value="${record.date}">` +
        `<input id="swal-input-organizer" class="swal2-input" placeholder="Organizador" value="${record.organizer}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
        const description = (document.getElementById('swal-input-description') as HTMLTextAreaElement).value;
        const date = (document.getElementById('swal-input-date') as HTMLInputElement).value;
        const organizer = (document.getElementById('swal-input-organizer') as HTMLInputElement).value;

        if (!name || !description || !date || !organizer) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
        }

        return { name, description, date, organizer };
      },
    });

    if (formValues) {
      try {
        await updateRecord(record._id, formValues, token); // Pasar el token a la función
        Swal.fire('Actualizado', 'El registro ha sido actualizado.', 'success');
        fetchRecords();
      } catch (error) {
        console.error('Error al actualizar el registro', error);
        Swal.fire('Error', 'Hubo un error al actualizar el registro.', 'error');
      }
    }
  };

  return (
    <div className='EventList'>
      <h2>Registros De Eventos</h2>
      <input
        type="text"
        placeholder="Buscar registros..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ padding: '8px', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }}
      />
      <ul>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <li key={record._id}>
              <strong>{record.name}</strong>: {record.description} <br />
              <strong>Fecha:</strong> {record.date} <br />
              <strong>Organizador:</strong> {record.organizer} <br />
              <button onClick={() => handleEdit(record)}>Editar</button>{' '}
              <button onClick={() => handleDelete(record._id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <p>No se encontraron registros.</p>
        )}
      </ul>
    </div>
  );
};

export default RecordList;
