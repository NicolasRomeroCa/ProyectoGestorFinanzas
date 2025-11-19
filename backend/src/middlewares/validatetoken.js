// middlewares son funciones que se ejcutan antes de llegar a una ruta
// biblioteca para convertir cookies  npm i cookie-parser  
import jwt from "jsonwebtoken" // para verificar tokens
import { TOKEN_SECRET } from '../config.js' // para verificar tokens

// middleware para validar token
export const authRequired = (req, res, next) => {
    const { token } = req.cookies
    if (!token)
        return res.status(401).json({ message: "Autorizacion denegada sesion no inciada" }); // si no hay token devuelve error 401 no autorizado
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "invalid token" }) // si el token no es valido devuelve error 403 token invalido
        req.user = user
        next()
    })
}