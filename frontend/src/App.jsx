// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPages.jsx";
import LoginPage from "./pages/LoginPages.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import HomePages from "./pages/homePages.jsx";
import FinanzasPages from "./pages/finanzasPages.jsx";
import FinanzasFormPages from "./pages/finanzasFormPages.jsx";
import ProfilePages from "./pages/profilePages.jsx";
import Navbar from "./components/Navbar.jsx";
import MetasPages from "./pages/metasPages.jsx";
import HistorialPages from "./pages/HistorialPages.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import { FinanzasProvider } from "./context/finanzasContext.jsx";
import { MetaProvider } from "./context/metaContext.jsx";
import { HistorialProvider } from "./context/historialContext.jsx";

function App() {
  return (
    <AuthProvider>
      <FinanzasProvider>
        <HistorialProvider>
          <MetaProvider>
            <BrowserRouter>
              <Navbar></Navbar>
              <Routes>
                {/* publico */}
                <Route path="/" element={<HomePages />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* privado */}
                <Route element={<ProtectedRoutes />}>
                  <Route path="/finanzas" element={<FinanzasPages />} />
                  <Route path="/add-finanzas" element={<FinanzasFormPages />} />
                  <Route path="/finanzas/:id" element={<h1>actualizar</h1>} />
                  <Route path="/profile" element={<ProfilePages />} />
                  <Route path="/historial" element={<HistorialPages />} />
                  <Route path="/metas" element={<MetasPages />}> </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </MetaProvider>
        </HistorialProvider>
      </FinanzasProvider>
    </AuthProvider>
  );
}

export default App;