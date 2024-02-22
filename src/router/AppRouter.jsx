import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router";
import PrivateRoute from "./PrivateRoute";
import { DeclaracionesJuradas } from "../pages/dashboard/pages_dashboard/declaraciones_juradas/DeclaracionesJuradas";
import { Inicio } from "../pages/dashboard/pages_dashboard/inicio/Inicio";
import NavBar from "../components/navbar/NavBar";
import { DatosEmpresa } from "../pages/dashboard/pages_dashboard/datos_empresa/DatosEmpresa";
import { Publicaciones } from "../pages/dashboard/pages_dashboard/publicaciones/Publicaciones";
import { RegisterPage } from "../pages/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import { LoginPage } from "../pages/login/LoginPage";
import { Feriados } from "../pages/dashboard/pages_dashboard/feriados/Feriados";
import { AltaUsuarioInterno } from "../pages/dashboard/pages_dashboard/alta_usuario_interno/AltaUsuarioInterno";
import { RegistroEmpresa } from "../pages/registro_empresa/RegistroEmpresa";
import { CuitsRestringidos } from "../pages/dashboard/pages_dashboard/cuits-restringidos/CuitsRestringidos";
import { Boletas } from "../pages/dashboard/pages_dashboard/boletas/Boletas";
import { Roles } from "@/pages/dashboard/pages_dashboard/roles/Roles";

const PagosPage = () => <div>Contenido de la página de pagos</div>;

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<NavBar />}> */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        >
          <Route path="inicio" index element={<Inicio />} />
          <Route path="publicaciones" element={<Publicaciones />} />
          <Route path="feriados" element={<Feriados />} />
          <Route path="ddjj" element={<DeclaracionesJuradas />} />
          <Route path="boletas" element={<Boletas />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="misdatos" element={<DatosEmpresa />} />
          {/* <Route path="categorias" element={<Categorias />} /> */}
          <Route path="altausuariointerno" element={<AltaUsuarioInterno />} />
          <Route path="cuitsrestringidos" element={<CuitsRestringidos />} />
          <Route path="roles" element={<Roles />} />
        </Route>
        <Route path="registercompany" element={<RegistroEmpresa />} />
        <Route index element={<Navigate to="/login" />} />
        {/* </Route> */}
      </Routes>
    </>
  );
};

export default AppRouter;
