// middleware para validar esquemas con zod
import { ZodError } from "zod"; // para manejar errores de validacion de zod
export const validateSchema = (schema) =>(req, res, next) => { // middleware que recibe un esquema de zod
    try {
        schema.parse(req.body) // valida el cuerpo de la solicitud con el esquema de zod
        next() // si la validacion es exitosa, pasa al siguiente middleware o controlador
    } catch (error) {
        console.log(error); // loguea el error en la consola
        if(error instanceof ZodError){
            return res.status(400).json({ // si hay un error de validacion, devuelve un error 400 con los mensajes de error
                error: error.issues.map((error) => error.message) // extrae los mensajes de error de zod
            });  
        }
        return res.status(500).json({ error: "Error inesperado en validación" }); // si hay otro tipo de error, devuelve un error 500
    }
}