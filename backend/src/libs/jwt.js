// src/libs/jwt.js
import { TOKEN_SECRET } from '../config.js' // para verificar tokens
import jwt from 'jsonwebtoken'; // para verificar tokens

// funcion para crear token
export function createdAccesToken(payload) {
    return new Promise((resolve, reject) => { // usamos promesas para manejar asincronismo
        jwt.sign(
            payload,// el contenido del token
            TOKEN_SECRET, // la clave secreta para firmar el token
            {
                expiresIn: "1d" // tiempo de expiracion del token
            },
            (err, token) => {
                if (err) reject(err) // si hay error rechaza la promesa
                resolve(token) // si no hay error resuelve la promesa con el token generado
            }
        );
    })
}