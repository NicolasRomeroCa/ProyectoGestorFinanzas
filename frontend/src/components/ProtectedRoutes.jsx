// src/components/ProtectedRoutes.jsx
import { Navigate, Outlet } from "react-router-dom" // Asegúrate de importar Navigate y Outlet
import { useAuth } from "../context/authContext"; // Asegúrate de la ruta correcta

// Componente ProtectedRoutes
function ProtectedRoutes() {
    const { loading, isAuthenticated } = useAuth()
    console.log(loading, isAuthenticated)
    if (loading) return <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
        loading....
    </h1>
    if (!loading && !isAuthenticated) return <Navigate to='/login' replace /> // Redirige a login si no está autenticado
    return (
        <Outlet />
    )
}
export default ProtectedRoutes // Exporta el componente ProtectedRoutes