// src/routes/meta.routes.js
import { Router } from "express";
import { authRequired } from '../middlewares/validatetoken.js';
// Importa las funciones del controlador
import { getMeta, getMetas, createMeta, updateMeta, deleteMeta, actualizarAhorroMeta } from '../controllers/meta.controller.js';

const router = Router();

router.get('/metas', authRequired, getMetas); // Obtener todas las metas del usuario
router.get('/metas/:id', authRequired, getMeta); // Obtener una meta específica
router.post('/metas', authRequired, createMeta); // Crear nueva meta
router.put('/metas/:id', authRequired, updateMeta); // Actualizar una meta existente
router.delete('/metas/:id', authRequired, deleteMeta); // Eliminar una meta
// Opcional: Ruta para actualizar el ahorro
router.put('/metas/:id/ahorro', authRequired, actualizarAhorroMeta);

export default router;