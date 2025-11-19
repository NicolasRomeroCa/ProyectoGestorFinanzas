// src/routes/auth.routes.js
import { Router } from "express"; // para crear rutas
import {login, register, logout, profile, verifyToken, updateProfile} from '../controllers/auth.controller.js' // importo las funciones del controlador de auth
import { authRequired} from '../middlewares/validatetoken.js' // importo el middleware para validar token
import { validateSchema } from '../middlewares/validator.Middlewar.js' // importo el middleware para validar esquemas
import {registerSchema, loginSchema} from '../schemas/auth.schema.js' // importo los esquemas de zod para validar las rutas de auth

// creo funcion el router de express
const router = Router()
router.post('/register', validateSchema(registerSchema), register) // ruta para registrar usuario con validacion de esquema
router.post('/login', validateSchema(loginSchema), login ) // ruta para login de usuario con validacion de esquema
router.post('/logout', logout) // ruta para logout de usuario
router.get('/verify', verifyToken) // ruta para verificar token
router.get('/profile', authRequired, profile) // ruta para obtener perfil de usuario, requiere autenticacion
router.put('/profile', authRequired, updateProfile) // ruta para actualizar perfil de usuario, requiere autenticacion

export default router // exporto el router para usarlo en otros archivos