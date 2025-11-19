// src/context/historialContext.jsx
import { createContext, useContext, useState } from 'react';
import { useAuth } from './authContext';
import { getHistorialGeneralRequest } from '../api/historial';

const HistorialContext = createContext();

export const useHistorial = () => {
  const context = useContext(HistorialContext);
  if (!context) {
    throw new Error('useHistorial must be used within a HistorialProvider');
  }
  return context;
};

export const HistorialProvider = ({ children }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  const fetchHistorial = async (fechaInicio = null, fechaFin = null) => {
    if (!isAuthenticated) {
      // usuario no autenticado → limpia historial y detiene
      setHistorial([]);
      setError("Usuario no autenticado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Llamado a API
      const res = await getHistorialGeneralRequest(fechaInicio, fechaFin);

      // Validación extra (importante)
      if (!res || !Array.isArray(res.data)) {
        throw new Error("Respuesta inválida del servidor");
      }

      setHistorial(res.data);
    } catch (err) {
      console.error('Error al obtener el historial:', err);
      setError(err.message || 'Error desconocido al cargar el historial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HistorialContext.Provider value={{
      historial,
      loading,
      error,
      fetchHistorial
    }}>
      {children}
    </HistorialContext.Provider>
  );
};
