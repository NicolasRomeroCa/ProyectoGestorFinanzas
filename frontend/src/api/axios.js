// src/api/axios.js
import axios from "axios"; // Asegúrate de importar axios

const instance = axios.create({
    baseURL: 'http://localhost:3000/api', // Cambia esto por la URL de tu API
    withCredentials: true
})
export default instance; // Exporta la instancia de axios