// src/api/auth.js
import axios from './axios' // Asegúrate de importar la instancia de axios

// funcion para registrar usuarios
export const registerRequest = user =>  axios.post(`/register`, user)

// funcion para iniciar sesión
export const loginRequest  =  user => axios.post(`/login`, user)

// funcion para verificar token
export const verifyTokenRequest = () => axios.get('/verify')

// funcion para actualizar el perfil del usuario
export const updateProfileRequest = (data) => axios.put('/profile', data);
