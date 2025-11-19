// src/context/authContext.jsx
import { useContext } from "react"; // Asegúrate de importar useContext
import { createContext, useState, useEffect } from "react"; // Asegúrate de importar useEffect
import { registerRequest, loginRequest, verifyTokenRequest, updateProfileRequest } from "../api/auth.js"; // Asegúrate de importar verifyTokenRequest
import Cookies from "js-cookie";

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); // Asegura que el hook se use dentro del proveedor
  }
  return context;
};

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  // Estados para el usuario, autenticación, errores y carga
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authErrors, setAuthErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  // funcion para registrar usuarios
  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res);
      setAuthErrors([]);
    } catch (error) {
      console.log(error.response);

      if (error.response?.data) {
        const errData = error.response.data;
        // Si el backend devuelve { error: [...] }
        if (Array.isArray(errData.error)) {
          setAuthErrors(errData.error);
        }
        // Si devuelve directamente un array [...]
        else if (Array.isArray(errData)) {
          setAuthErrors(errData);
        }
        // Si devuelve solo un string o algo diferente
        else if (typeof errData === "string") {
          setAuthErrors([errData]);
        } else {
          setAuthErrors(["Ocurrió un error desconocido"]);
        }
      } else {
        setAuthErrors(["Error de conexión con el servidor"]);
      }

      //setAuthErrors(error.response.data)
    }
  };

  // funcion para iniciar sesión
  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res.data);
      setAuthErrors([]);
      setUser(res.data)
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error.response); // Ver el error completo en la consola
      if (error.response?.data) {
        const errData = error.response.data;
        // Si el backend devuelve { error: [...] }
        if (Array.isArray(errData.error)) {
          setAuthErrors(errData.error);
        }
        // Si devuelve directamente un array [...]
        else if (Array.isArray(errData)) {
          setAuthErrors(errData);
        }
        // NUEVO: Manejo de objeto con mensaje
        else if (typeof errData === "object" && errData.message) {
          // Por ejemplo, si el backend devuelve { message: "Usuario no encontrado" }
          setAuthErrors([errData.message]);
        }
        // Si devuelve solo un string
        else if (typeof errData === "string") {
          setAuthErrors([errData]);
        } else {
          setAuthErrors(["Ocurrió un error desconocido"]); // Mensaje genérico para otros casos
        }
      } else {
        setAuthErrors(["Error de conexión con el servidor"]); // Mensaje para errores sin respuesta del servidor
      }
    }
  };
  // funcion para eleminar los mensajes de error depues de determinado tiempo
  useEffect(() => {
    if (authErrors.length > 0) {
      const timer = setTimeout(() => {
        setAuthErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authErrors]);

  // funcion para comprobar cookie con js-cookie y protejer rutas con protetctedRoutes 
  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false)
        return setUser(null);
      }
      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);
  // funcion para cerrar sesión
  const logout = () => {
    Cookies.remove("token")
    setIsAuthenticated(false)
    setUser(null)

  }
  const updateProfile = async (profileData) => {
    try {
      // Limpiar errores anteriores
      setAuthErrors([]);

      // Hacer la petición PUT al backend
      const response = await updateProfileRequest(profileData);

      // Actualizar el estado del usuario con los nuevos datos
      setUser(response.data);

      // Opcional: Mostrar mensaje de éxito
      console.log("Perfil actualizado correctamente.");

      // Opcional: Regenerar el token si cambió la contraseña (esto es más complejo y opcional)
      // Si decides regenerar el token, aquí es donde lo harías y lo actualizarías en la cookie/localStorage
      // y posiblemente actualizarías el estado de autenticación.

    } catch (error) {
      console.error("Error en updateProfile:", error);

      let errorMessage = "Ocurrió un error inesperado al actualizar el perfil.";

      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        errorMessage = error.response.data.message || `Error ${error.response.status}`;
      } else if (error.request) {
        // La solicitud se hizo pero no hubo respuesta
        errorMessage = "No se pudo conectar con el servidor.";
      } else {
        // Algo pasó al preparar la solicitud
        errorMessage = error.message;
      }

      // Actualizar estado de errores
      setAuthErrors([errorMessage]);
    }
  };
  // Proveer el contexto de autenticación a los componentes hijos
  return (
    <AuthContext.Provider
      value={{
        signup,
        user,
        logout,
        isAuthenticated,
        authErrors,
        signin,
        loading,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
