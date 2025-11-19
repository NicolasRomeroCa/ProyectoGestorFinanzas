// src/controllers/meta.controller.js
import Meta from "../models/meta.model.js";

// Obtener todas las metas del usuario autenticado
export const getMetas = async (req, res) => {
  try {
    const metas = await Meta.find({
      user: req.user.id, // Trae solo las metas del usuario autenticado
    }).populate("user", "username email"); // Opcional: poblar solo campos específicos del usuario

    res.json(metas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las metas", error: error.message });
  }
};

// Crear nueva meta
export const createMeta = async (req, res) => {
  try {
    const { titulo, descripcion,valorObjetivo, fecha} = req.body;
    const newMeta = new Meta({
      titulo,
      descripcion,
      valorObjetivo,
      fecha,
      user: req.user.id, // guardo e usuario que esta utenticado
    });

    const savedMeta = await newMeta.save();
    res.json(savedMeta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar registro", error });
  }
};

// Obtener una meta por su ID
export const getMeta = async (req, res) => {
  try {
    const meta = await Meta.findById(req.params.id).populate("user", "username email");

    if (!meta) {
      return res.status(404).json({ message: "Meta no encontrada" });
    }

    if (meta.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para ver esta meta" });
    }

    res.json(meta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la meta", error: error.message });
  }
};

// Actualizar una meta por su ID
export const updateMeta = async (req, res) => {
  try {
    const { titulo, descripcion, valorObjetivo } = req.body;

    const meta = await Meta.findById(req.params.id);

    if (!meta) {
      return res.status(404).json({ message: "Meta no encontrada" });
    }

    if (meta.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para actualizar esta meta" });
    }

    // Actualiza solo los campos proporcionados
    const updatedMeta = await Meta.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion, valorObjetivo },
      { new: true } // Devuelve el documento actualizado
    ).populate("user", "username email");

    res.json(updatedMeta);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la meta", error: error.message });
  }
};

// Eliminar una meta por su ID
export const deleteMeta = async (req, res) => {
  try {
    const meta = await Meta.findById(req.params.id);

    if (!meta) {
      return res.status(404).json({ message: "Meta no encontrada" });
    }

    if (meta.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta meta" });
    }

    await Meta.findByIdAndDelete(req.params.id);

    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la meta", error: error.message });
  }
};

// Opcional: Controlador para actualizar el ahorro actual de una meta
export const actualizarAhorroMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const { valorAhorro } = req.body; // El nuevo valor de ahorro a agregar o establecer

    const meta = await Meta.findById(id);

    if (!meta) {
      return res.status(404).json({ message: "Meta no encontrada" });
    }

    if (meta.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para actualizar esta meta" });
    }

    // Opción 1: Sumar el valorAhorro al valorAhorroActual
    // const nuevoAhorro = meta.valorAhorroActual + valorAhorro;

    // Opción 2: Establecer directamente el valorAhorro como el nuevo valor
    const nuevoAhorro = valorAhorro;

    // Asegurarse de que no exceda el valor objetivo
    if (nuevoAhorro > meta.valorObjetivo) {
      return res.status(400).json({ message: "El ahorro no puede exceder el valor objetivo de la meta." });
    }

    const metaActualizada = await Meta.findByIdAndUpdate(
      id,
      { valorAhorroActual: nuevoAhorro },
      { new: true } // Devuelve el documento actualizado
    ).populate("user", "username email");

    res.json(metaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el ahorro de la meta", error: error.message });
  }
};