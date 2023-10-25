import { Route, Routes } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  HomePage, 
  LoginPage,
  RegisterPage, 
  DashboardPage} from "../pages";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<NavBar/>}>
              <Route index element={<HomePage/>}/>
              <Route path="login" element={<LoginPage/>}/>
              <Route path="register" element={<RegisterPage/>}/>
              <Route path="dashboard" element={
                <PrivateRoute>
                  {/* DashboardPage es el children */}
                  <DashboardPage/>
                </PrivateRoute>
              }/>
            </Route>
        </Routes>
    </>
  )
}

export default AppRouter