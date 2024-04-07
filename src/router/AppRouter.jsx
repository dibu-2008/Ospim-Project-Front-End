import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router";
import PrivateRoute from "./PrivateRoute";
import { DeclaracionesJuradas } from "../pages/dashboard/pages_dashboard/ddjj/DDJJ";
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
import { DetalleBoleta } from "@/pages/dashboard/pages_dashboard/boletas/DetalleBoleta";
import { Roles } from "@/pages/dashboard/pages_dashboard/roles/Roles";
import { GenerarBoletas } from "@/pages/dashboard/pages_dashboard/generar_boletas/GenerarBoletas";
import { GenerarOtrosPagos } from "@/pages/dashboard/pages_dashboard/otros_pagos/GenerarOtrosPagos";
import { DetalleOtrosPagos } from "@/pages/dashboard/pages_dashboard/otros_pagos/DetalleOtrosPagos";
import { DDJJConsultaEmpleado } from "@/pages/dashboard/pages_dashboard/ddjj/ddjj_consulta_empleado/DDJJConsultaEmpleado";
import { InteresesAfip } from "@/pages/dashboard/pages_dashboard/intereses_afip/InteresesAfip";

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
            <Route path="ddjjconsultaempleado" element={<DDJJConsultaEmpleado />} />
            <Route path="boletas" element={<Boletas />} />
            <Route path="pagos" element={<PagosPage />} />
            <Route path="misdatos" element={<DatosEmpresa />} />
            {/* <Route path="categorias" element={<Categorias />} /> */}
            <Route path="altausuariointerno" element={<AltaUsuarioInterno />} />
            <Route path="cuitsrestringidos" element={<CuitsRestringidos />} />
            <Route path="roles" element={<Roles />} />
            <Route path="generarboletas/:id" element={<GenerarBoletas />} />
            <Route path="detalleboleta/:numero_boleta" element={<DetalleBoleta />} />
            <Route path="generarotrospagos" element={<GenerarOtrosPagos />} />
            <Route path="detalleotrospagos" errorElement={<DetalleOtrosPagos />}/>
            <Route path="interesesafip" element={<InteresesAfip />} />
          </Route>
          <Route path="registercompany" element={<RegistroEmpresa />} />
          <Route index element={<Navigate to="/login" />} />
        {/* </Route> */}
      </Routes>
    </>
  );
};

export default AppRouter;
