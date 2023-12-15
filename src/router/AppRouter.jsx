import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router";

import {
  LoginPage,
  RegisterPage,
  DashboardPage
} from "../pages";
import PrivateRoute from "./PrivateRoute";
import { RegisterCompany } from "../pages/RegisterCompany";
import { Feriados } from "../pages/pages_dashboard/Feriados";
import { DeclaracionesJuradas } from "../pages/pages_dashboard/DeclaracionesJuradas";
import { Inicio } from "../pages/pages_dashboard/inicio/Inicio";
import { Categorias } from "../pages/pages_dashboard/Categorias";
import NavBar from "../components/navbar/NavBar";
import { Datos } from "../pages/pages_dashboard/datos_empresa/Datos";

const BoletasPage = () => <div>Contenido de la página de boletas</div>;
const PagosPage = () => <div>Contenido de la página de pagos</div>;

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }>
            <Route path="inicio" index element={<Inicio />} />
            <Route path="feriados" element={<Feriados />} />
            <Route path="ddjj" element={<DeclaracionesJuradas />} />
            <Route path="boletas" element={<BoletasPage />} />
            <Route path="pagos" element={<PagosPage />} />
            <Route path="misdatos" element={<Datos />} />
            <Route path="categorias" element={<Categorias />} />

          </Route>
          <Route path="registercompany" element={<RegisterCompany />} />
          <Route index element={<Navigate to="/login" />} />
        </Route>
      </Routes>
    </>
  )
}

export default AppRouter