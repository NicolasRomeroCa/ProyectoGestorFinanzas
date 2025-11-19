// utilizo los modelos para definirle a mongodb como de ser la informacion que debe guardar en este caso los usuarios 
import mongoose, { Mongoose } from "mongoose"; // importo mongoose para crear esquemas e interactuar con mongo db

// defino el esquema de usuario

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    }, 
},
{
    timestamps: true // crea campos de createdAt y updatedAt automaticamente
}
);

export default mongoose.model('User', userSchema) // exporto el modelo de usuario para usarlo en otros archivos