// src/pages/finanzasPages.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useFinanzas } from "../context/finanzasContext";
import { useAuth } from "../context/authContext";
import { useHistorial } from "../context/historialContext";

// Componente FinanzasPages

function FinanzasPages() {
  const { register, handleSubmit, reset } = useForm();
  const { balance, createFinanza, deleteFinanza, updateFinanza } = useFinanzas();
  const { historial, fetchHistorial } = useHistorial();
  const { user } = useAuth();
  // MODAL BUSCAR
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  // MODAL EDITAR
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFinanza, setEditingFinanza] = useState({
    _id: null,
    descripcion: "",
    valor: "",
    tipo: "",
  });
  // MODAL ELIMINAR
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [finanzaToDelete, setFinanzaToDelete] = useState(null);
  // CREAR FINANZA
  const onSubmit = handleSubmit(async (data) => {
    await createFinanza(data);
    await fetchHistorial();
    reset();
  });
  // ABRIR HISTORIAL
  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    fetchHistorial();
  };
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setFechaInicio("");
    setFechaFin("");
  };
  // ABRIR MODAL EDITAR
  const openEditModal = (item) => {
    setEditingFinanza({
      _id: item.id || item._id,
      descripcion: item.descripcion,
      valor: item.monto,
      tipo: item.accion,
    });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  // GUARDAR CAMBIOS EDITAR
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateFinanza(editingFinanza._id, {
      descripcion: editingFinanza.descripcion,
      valor: editingFinanza.valor,
      tipo: editingFinanza.tipo,
    });
    await fetchHistorial();
    closeEditModal();
  };
  // ABRIR MODAL ELIMINAR
  const openDeleteModal = (item) => {
    setFinanzaToDelete(item.id || item._id);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setFinanzaToDelete(null);
    setIsDeleteModalOpen(false);
  };
  const confirmDelete = async () => {
    if (finanzaToDelete) {
      await deleteFinanza(finanzaToDelete);
      await fetchHistorial();
      closeDeleteModal();
    }
  };
  // FILTRAR SOLO FINANZAS
  const finanzasFiltradas = (historial || [])
    .filter((item) => item.tipo === "Finanza")
    .filter((item) => {
      if (fechaInicio && new Date(item.fecha) < new Date(fechaInicio)) return false;
      if (fechaFin && new Date(item.fecha) > new Date(fechaFin)) return false;
      return true;
    });
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-black text-center mb-6">
          Registro finanzas
        </h1>
        {/* TARJETAS */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 w-full">
          <div className="bg-green-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center flex-1 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Ingresos</h2>
            <p className="text-2xl font-bold">${balance?.ingresos ?? 0}</p>
          </div>
          <div className="bg-red-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center flex-1 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Gastos</h2>
            <p className="text-2xl font-bold">${balance?.gastos ?? 0}</p>
          </div>
          <div className="bg-yellow-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center flex-1 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Balance</h2>
            <p className="text-2xl font-bold">${balance?.balance ?? 0}</p>
          </div>
        </div>
        {/* FORMULARIO */}
        <div className="w-full max-w-2xl mx-auto">
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 w-full space-y-6"
          >
            <h2 className="text-2xl font-bold text-center mb-4 text-black">
              Agregar movimiento
            </h2>
            <div className="flex flex-col text-left">
              <label className="text-base font-medium text-gray-700 mb-2">
                Valor
              </label>
              <input
                placeholder="Ingresa valor"
                type="number"
                {...register("valor", { required: true })}
                className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg"
              />
            </div>
            <div className="flex flex-col text-left">
              <label className="text-base font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                placeholder="Ingresa descripción"
                type="text"
                {...register("descripcion", { required: true })}
                className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg"
              />
            </div>
            <div className="flex flex-col text-left">
              <label className="text-base font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                {...register("tipo")}
                className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg"
              >
                <option value="Ingreso">Ingreso</option>
                <option value="Gasto">Gasto</option>
              </select>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full mt-6">
              Registrar
            </button>
            <button
              type="button"
              onClick={openSearchModal}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full mt-4"
            >
              Buscar
            </button>
          </form>
        </div>
        {/* MODAL HISTORIAL */}
        {isSearchModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
              <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold text-black">Historial de tus finanzas</h2>
                <button
                  onClick={closeSearchModal}
                  className="text-black text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-800 text-white">
                      <th className="border px-4 py-2 text-center">Fecha</th>
                      <th className="border px-4 py-2 text-center">
                        Descripción
                      </th>
                      <th className="border px-4 py-2 text-center">Monto</th>
                      <th className="border px-4 py-2 text-center">Tipo</th>
                      <th className="border px-4 py-2 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finanzasFiltradas.map((item) => (
                      <tr key={item.id} className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-center text-black">
                          {new Date(item.fecha).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-black">
                          {item.descripcion}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-black">
                          ${item.monto}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <span
                            className={
                              item.accion === "Ingreso"
                                ? "text-green-700"
                                : "text-red-700"
                            }
                          >
                            {item.accion}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-black">
                          <div className="flex justify-center space-x-2">
                            {/* ELIMINAR */}
                            <button
                              onClick={() => openDeleteModal(item)}
                              className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md"
                            >
                              🗑️
                            </button>
                            {/* EDITAR */}
                            <button
                              onClick={() => openEditModal(item)}
                              className="bg-green-800 hover:bg-green-900 transition text-white px-4 py-2 rounded-md"
                            >
                              ✏️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={closeSearchModal}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
        {/* MODAL EDITAR */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-center text-black">
                Editar movimiento
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-700">Descripción:</label>
                  <input
                    type="text"
                    value={editingFinanza.descripcion}
                    onChange={(e) =>
                      setEditingFinanza({
                        ...editingFinanza,
                        descripcion: e.target.value,
                      })
                    }
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-gray-700">Valor:</label>
                  <input
                    type="number"
                    value={editingFinanza.valor}
                    onChange={(e) =>
                      setEditingFinanza({
                        ...editingFinanza,
                        valor: e.target.value,
                      })
                    }
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-gray-700">Tipo:</label>
                  <select
                    value={editingFinanza.tipo}
                    onChange={(e) =>
                      setEditingFinanza({
                        ...editingFinanza,
                        tipo: e.target.value,
                      })
                    }
                    className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md"
                  >
                    <option value="Ingreso">Ingreso</option>
                    <option value="Gasto">Gasto</option>
                  </select>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md mt-2"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
        {/* MODAL ELIMINAR */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-white/80 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center text-black">
                Confirmar eliminación
              </h2>
              <p className="text-gray-700 text-center mb-6">
                ¿Seguro que deseas eliminar esta finanza? No se puede deshacer.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={confirmDelete}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        <footer className="mt-12 text-center text-sm text-gray-500 py-6 border-t border-gray-200">
          © {new Date().getFullYear()} FinanzasApp
        </footer>
      </div>
    </div>
  );
}
export default FinanzasPages;
