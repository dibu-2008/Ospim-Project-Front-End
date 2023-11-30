import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router";
import NavBar from "../components/NavBar";
import {
  LoginPage,
  RegisterPage,
  DashboardPage
} from "../pages";
import PrivateRoute from "./PrivateRoute";
import { RegisterCompany } from "../pages/RegisterCompany";
import { Feriados } from "../pages/pages_dashboard/Feriados";

const HomePage = () => <div>Contenido de la página de inicio</div>;
const DDJJPage = () => {
  return (
    <div style={{
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
      marginTop: '2rem'
    }}>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '80%',
          height: '100px',
        }}
      >

        <h2>Presentar</h2>
        <h2>Mis DDJJ</h2>
      </div>


      <div
        style={{
          height: '100px',
          width: '80%',
          border: '1px solid black',
          borderRadius: '10px',
        }}
      >
        <h3>Periodo</h3>
      </div>

    </div>
  )
};
const BoletasPage = () => <div>Contenido de la página de boletas</div>;
const PagosPage = () => <div>Contenido de la página de pagos</div>;
const MisDatosPage = () => <div>Contenido de la página de mis datos</div>;

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
            <Route path="inicio" index element={<HomePage />} />
            <Route path="feriados" element={<Feriados />} />
            <Route path="ddjj" element={<DDJJPage />} />
            <Route path="boletas" element={<BoletasPage />} />
            <Route path="pagos" element={<PagosPage />} />
            <Route path="misdatos" element={<MisDatosPage />} />

          </Route>
          <Route path="registercompany" element={<RegisterCompany />} />
          <Route index element={<Navigate to="/login" />} />
        </Route>
      </Routes>
    </>
  )
}

export default AppRouter