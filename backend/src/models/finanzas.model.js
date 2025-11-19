// src/models/finanzas.model.js
import mongoose from "mongoose"; // para crear esquemas e interactuar con mongo db
import { _enum } from "zod/v4/core"; // para crear esquemas e interactuar con mongo db

// esquema de finanzas
const finanzasSchema =new mongoose.Schema({

    valor:{
        type: Number,
        required: true
    },

    descripcion:{
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        enum: ['Ingreso', 'Gasto'],
        required: true
    },
    fecha:{
        type: Date,
        default: Date.now
    },
    user: { // campo para referenciar al usuario propietario de la finanza
        type: mongoose.Schema.Types.ObjectId, // referencia al modelo de usuario
        ref: 'User', // nombre del modelo referenciado
        required: true // el campo es obligatorio
    }
},
{
    timestamps: true // crea campos de createdAt y updatedAt automaticamente
})

export default mongoose.model('Finanza', finanzasSchema); // exporta el modelo de finanzas para usarlo en otros archivos
