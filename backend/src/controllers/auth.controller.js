// funciones para poder procesar peticios y gestionar rutes de auth.routes.js
import User from "../models/user.model.js"; // modelo de usuario
import bcrypt from "bcryptjs"; // para encriptar passwords
import { createdAccesToken } from "../libs/jwt.js"; // para crear tokens
import jwt from "jsonwebtoken"; // para verificar tokens
import { TOKEN_SECRET } from "../config.js"; // para verificar tokens

// funcion para registrar
export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // validacion de usuario antes de encriptar
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["El correo ya esta en uso"]);

    const userFoundUsername = await User.findOne({ username });
    if (userFoundUsername) return res.status(400).json(["El nombre de usuario ya esta en uso"]);

    const passwordHashs = await bcrypt.hash(password, 10); // encriptamos la contrasena
    const newUser = new User({
      username,
      email,
      password: passwordHashs,
    });
    //guarda al nuevooo usuario en mongo db
    const userSaved = await newUser.save();

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
// funcion para ingresar
export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    console.log(username, password);
    const userFound = await User.findOne({ username });
    if (!userFound) return res.status(400).json({ message: "Usuario incorrecto" });

    const isMatch = await bcrypt.compare(password, userFound.password); //comparamos contraseña guardada en base de datos
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createdAccesToken({ id: userFound._id });
    console.log("ingreso exitoso");
    console.log("Token generado:", token);
    res.cookie("token", token); // guardo el token creado como una cookie

    //devuelve el usuario que se ha guardado
    // se modifica para que no devuelva passworr

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// funcion para salir o cerrar sesion
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
// funcion para perfil de usuario
export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

// funcion para para verificar token
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(400).json({ message: "No esta autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "No esta autorizado" });

    const userFound = await User.findById(user.id);
    if (!userFound)
      return res.status(401).json({ message: "No esta autorizado" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

// funcion para actualizar perfil de usuario
export const updateProfile = async (req, res) => {
  const userId = req.user.id; // Obtener ID del usuario del token
  const { username, email, password } = req.body;
  try {
    // Buscar al usuario por ID
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Validar si el nuevo username o email ya existen (pero no para el mismo usuario)
    if (username && username !== userFound.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Nombre de usuario ya está en uso" });
      }
    }
    if (email && email !== userFound.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email ya está en uso" });
      }
    }
    // Actualizar campos solo si se proporcionan en req.body
    if (username) userFound.username = username;
    if (email) userFound.email = email;
    // Actualizar contraseña si se proporciona
    if (password) {
        // Asegúrate de encriptarla
        const passwordHashs = await bcrypt.hash(password, 10);
        userFound.password = passwordHashs;
    }
    // Guardar los cambios
    const updatedUser = await userFound.save();
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });

  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};