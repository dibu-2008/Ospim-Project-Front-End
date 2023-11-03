import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router";
import NavBar from "../components/NavBar";
import {
  LoginPage,
  RegisterPage, 
  DashboardPage} from "../pages";
import PrivateRoute from "./PrivateRoute";
import { RegisterCompany } from "../pages/RegisterCompany";

const AppRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<NavBar/>}>
              <Route path="login" element={<LoginPage/>}/>
              <Route path="register" element={<RegisterPage/>}/>
              <Route path="dashboard" element={
                <PrivateRoute>
                  {/* DashboardPage es el children */}
                  <DashboardPage/>
                </PrivateRoute>
              }/>
              <Route path="registercompany" element={<RegisterCompany/>}/>
              <Route index element={<Navigate to="/login" />} />
            </Route>
        </Routes>
    </>
  )
}

export default AppRouter