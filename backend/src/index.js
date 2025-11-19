// src/index.js
import app from './app.js' // importo el servidor
import {connectDB} from "./db.js" // importo la funcion para conectar a la base de datos

// conecto a la base de datos y luego inicio el servidor

connectDB(); // conecto a la base de datos
app.listen(3000); // inicio el servidor en el puerto 3000
console.log('Conexion exitosa por el puerto 3000'); // mensaje de exito