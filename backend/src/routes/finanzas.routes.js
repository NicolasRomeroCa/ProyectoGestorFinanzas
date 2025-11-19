// src/routes/finanzas.routes.js
import { Router } from "express"; // para crear rutas
import {authRequired} from '../middlewares/validatetoken.js' // importo el middleware para validar token
// importo las funciones del controlador de finanzas
import {getFinanza ,getFinanzas, createFinanzas, updateFinanzas, deleteFinanzas, getBalance} from '../controllers/finanzas.controller.js' 


// creo funcion el router de express
const router = Router()
router.get('/finanzas', authRequired,getFinanzas) // ruta para obtener todas las finanzas del usuario autenticado
router.get('/finanzas/:id', authRequired, getFinanza) // ruta para obtener una finanza por su id
router.post('/finanzas', authRequired, createFinanzas) // ruta para crear nueva finanza
router.delete('/finanzas/:id', authRequired, deleteFinanzas ) // ruta para eliminar una finanza por su id
router.put('/finanzas/:id', authRequired, updateFinanzas ) // ruta para actualizar una finanza por su id
router.get('/finanzasBalance', authRequired, getBalance) // ruta para obtener balance total del usuario

export default router // exporto el router para usarlo en otros archivos