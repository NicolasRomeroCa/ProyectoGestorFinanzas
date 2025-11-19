// src/app.js
import express from 'express' // framework para crear el servidor
import morgan from 'morgan' // para ver las peticiones en la consola
import authRoutes from './routes/auth.routes.js' // importo las rutas de auth
import finanzasRoutes from './routes/finanzas.routes.js' // importo las rutas de finanzas
import metasRoutes from './routes/meta.routes.js'; // importo las rutas de metas
import historialRoutes from './routes/historial.routes.js';
import cookieParser from 'cookie-parser' // para manejar cookies
import cors from 'cors' // para manejar cors

const app = express()  // servidor 

// middlewares
app.use(cors({
    origin:'http://localhost:5173', // origen permitido
    credentials: true // permite enviar cookies
}))

app.use(morgan('dev')); // para ver las peticiones en la consola
app.use(express.json()) // para parsear el body de las peticiones como json
app.use(cookieParser()) // para manejar cookies

// routes
app.use('/api', authRoutes); // rutas de auth
app.use('/api', finanzasRoutes); // rutas de finanzas
app.use('/api', metasRoutes); // rutas de metas
app.use('/api', historialRoutes); // rutas de historial

// exporto el servidor para usarlo en otros archivos
export default app;  