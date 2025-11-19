// src/schemas/auth.schema.js
import { z } from 'zod' // para crear schemas de validacion con zod

// esquema para registrar usuario
export const registerSchema = z.object({
    username: z.string({
        required_error: 'El nombre de usuario es requerido' // mensaje de error si no se proporciona
    }),
    email: z.string({
        required_error: 'EL email es requerido' // mensaje de error si no se proporciona
    }).email({ required_error: 'Email invalido' }), // valida que sea un email valido
    password: z.string({
        required_error: 'Contraseña es requerida' // mensaje de error si no se proporciona
    }).min(6, {
        message: 'Contraseña debe ser mayor a 6 caracteres' // minimo 6 caracteres de contraseña
    })
})
// esquema para login de usuario
export const loginSchema = z.object({
    username: z.string({
        required_error: 'Nombre de usuario es requerido' // mensaje de error si no se proporciona
    })
    .min(3, { message: 'Nombre de usuario es requerido' }), // minimo 3 caracteres

    password: z.string({
        required_error: 'Contraseña es requerida' // mensaje de error si no se proporciona
    }).min(6, {
        message: 'Contraseña Incorrecta' // minimo 6 caracteres de contraseña
    })
})
