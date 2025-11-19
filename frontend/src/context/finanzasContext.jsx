// src/context/finanzasContext.jsx
import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import {
  createFinanzaRequest,
  getBalanceRequest,
  updateFinanzaRequest,
  getFinanzasRequest,
  deleteFinanzaRequest
} from "../api/finanzas";
import { useAuth } from './authContext';

// Crear el contexto de finanzas
const finanzasContext = createContext();

// Hook personalizado
export const useFinanzas = () => {
  const context = useContext(finanzasContext);
  if (!context) {
    throw new Error("useFinanzas must be used within a FinanzasProvider");
  }
  return context;
};

// Proveedor
export function FinanzasProvider({ children }) {

  const [balance, setBalance] = useState({
    ingresos: 0,
    gastos: 0,
    balance: 0,
  });

  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(false);

  // NUEVO: listado de finanzas
  const [finanzas, setFinanzas] = useState([]);

  // Obtener FINANZAS desde backend
  const fetchFinanzas = async () => {
    try {
      const res = await getFinanzasRequest();
      setFinanzas(res.data);
    } catch (error) {
      console.log("Error al cargar finanzas", error);
    }
  };

  // Obtener BALANCE desde backend
  const fetchBalance = async () => {
    try {
      setLoading(true);
      const res = await getBalanceRequest();
      setBalance(res.data);
    } catch (error) {
      console.log("error al obtener balance", error);
    } finally {
      setLoading(false);
    }
  };

  // Crear finanza
  const createFinanza = async (finanzaData) => {
    try {
      await createFinanzaRequest(finanzaData);
      await fetchFinanzas();
      await fetchBalance();
    } catch (error) {
      console.log("Error al crear la finanza", error);
    }
  };

  // ACTUALIZAR FINANZA 
  const updateFinanza = async (id, data) => {
    try {
      const res = await updateFinanzaRequest(id, data);

      setFinanzas(finanzas.map(f => f._id === id ? res.data : f));
      recalculateBalance();
      await fetchBalance();
    } catch (error) {
      console.log("Error al actualizar finanza", error);
    }
  };

  // ELIMINAR FINANZA
  const deleteFinanza = async (id) => {
    try {
      await deleteFinanzaRequest(id);

      setFinanzas(finanzas.filter(f => f._id !== id));
      recalculateBalance();
      await fetchBalance();
    } catch (error) {
      console.log("Error al eliminar finanza", error);
    }
  };

  // Recalcular balance localmente
  const recalculateBalance = () => {
    let ingresos = 0;
    let gastos = 0;

    finanzas.forEach(f => {
      if (f.tipo === "Ingreso") ingresos += f.valor;
      if (f.tipo === "Gasto") gastos += f.valor;
    });

    setBalance({
      ingresos,
      gastos,
      balance: ingresos - gastos
    });
  };

  // Cargar balance y finanzas al autenticarse
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBalance();
      fetchFinanzas();
    } else {
      setBalance(null);
      setFinanzas([]);
    }
  }, [isAuthenticated, user]);

  return (
    <finanzasContext.Provider
      value={{
        balance,
        loading,
        deleteFinanza,
        updateFinanza,
        fetchBalance,
        createFinanza,
        finanzas,
        fetchFinanzas
      }}
    >
      {children}
    </finanzasContext.Provider>
  );
}
