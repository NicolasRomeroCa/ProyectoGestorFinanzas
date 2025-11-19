// src/db.js
import mongoose from "mongoose"; // para crear esquemas e interactuar con mongo db

// funcion para conectar a la base de datos

export const connectDB = async () =>{
    try{
         await mongoose.connect('mongodb://localhost:27017/gestor-finanzas') // conexion a la base de datos
         console.log("conexion esitosa") // mensaje de exito
    }catch(error){
        console.log(error) // mensaje de error
    }
};