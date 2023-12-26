import { logon } from "./LoginApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormLoginInternalUser } from "../hooks/useFormLoginInternalUser.js";
import { InputComponent } from "../components/InputComponent.jsx";
import { ButtonComponent } from "../components/ButtonComponent.jsx";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import imgError from "../assets/error.svg";
import imgSuccess from "../assets/success.svg";
import imgLogo from "../assets/logo.svg";
import { errorBackendResponse } from "../errors/errorBackendResponse.js";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;
const ERROR_BODY = import.meta.env.VITE_ERROR_BODY;
const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;
const SUCCESS_CODE_SEND = import.meta.env.VITE_SUCCESS_CODE_SEND;
const VITE_WELCOME_PORTAL = import.meta.env.VITE_WELCOME_PORTAL;
const VITE_ERROR_CODE_VERIFICATION = import.meta.env
  .VITE_ERROR_CODE_VERIFICATION;

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    user,
    passwordLoginInternalUser,
    OnInputChangeLoginInternalUser,
    OnResetFormLoginInternalUser,
  } = useFormLoginInternalUser({
    user: "",
    passwordLoginInternalUser: "",
  });

  const [showInternalUserForm, setShowInternalUserForm] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [showAlertUser, setShowAlertUser] = useState(false);
  const [showAlertPassword, setShowAlertPassword] = useState(false);

  const showAlert = (tipo, mensaje) => {
    var alertColor;
    var alertIcon;
    if (tipo == "ERROR") {
      alertColor = "red";
      alertIcon = imgError;
    }
    if (tipo == "SUCCESS") {
      alertColor = "green";
      alertIcon = imgSuccess;
    }
    return withReactContent(Swal).fire({
      html: `
            <div style="color:${alertColor}; font-size: 26px; display: flex; flex-direction:column;">
             <img style="height:50px; width: 50px; margin: 10px auto;" src=${alertIcon}>
            ${mensaje}
            </div>
        `,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const showSwalError = (message) => {
    showAlert("ERROR", message);
  };

  const showSwalCodeVerification = (message) => {
    showAlert("SUCCESS", message);
  };

  const showSwalSuccess = (message) => {
    withReactContent(Swal).fire({
      html: `
            <div 
            style="
              color:#fff; 
              font-size: 26px; 
              display: flex; 
              flex-direction:column;
              height:300px;
              align-items: center;
              justify-content: center;"
              >
              <img style="height:100px; width: 100px; margin: 10px auto;" src=${imgLogo}>
              <h2>${message}</h2>
            </div>
        `,
      timer: 2000,
      background: "rgba(26, 118, 210, 0.8)",
      showConfirmButton: false,
    });
  };

  const onLoginInternalUser = async (e) => {
    e.preventDefault();

    try {
      if (user === "" || passwordLoginInternalUser === "") {
        if (user === "") setShowAlertUser(true);
        if (passwordLoginInternalUser === "") setShowAlertPassword(true);
        return false;
      }


      const { token, tokenRefresco } = await logon(
        user,
        passwordLoginInternalUser
      );

      console.log(token, tokenRefresco);

      
      if (token && tokenRefresco) {
        setShowInternalUserForm(false);
        setShowVerificationForm(true);
        showSwalCodeVerification(SUCCESS_CODE_SEND);
      }
      setToken(token);
      setRefreshToken(tokenRefresco); 
      OnResetFormLoginInternalUser();
    } catch (error) {
      errorBackendResponse(
        error,
        showSwalError
      ); 
      OnResetFormLoginInternalUser();
    }
  };

  const redirectToRegister = () => {
    navigate("/registercompany", {
      replace: true,
    });
  };

  const onVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const onVerificationCodeSubmit = (e) => {
    e.preventDefault();

    if (+verificationCode === 123456) {
      showSwalSuccess(VITE_WELCOME_PORTAL);

      navigate("/dashboard/inicio", {
        replace: true,
        state: {
          logged: true,
          token,
          refreshToken,
        },
      });
    } else {
      showSwalError(VITE_ERROR_CODE_VERIFICATION);
    }
  };

  const onInputChangeUser = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertUser(false);
  };

  const onInputChangePassword = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertPassword(false);
  };

  return (
    <div className="wrapper_container">
      <div className="wrapper">
        {showInternalUserForm && (
          <div className="contenedor_form">
            <form onSubmit={onLoginInternalUser}>
              <h1>Usuario Interno</h1>
              <h3>Iniciar sesión</h3>
              <div className="input-group">
                <InputComponent
                  type="text"
                  name="user"
                  id="user"
                  value={user}
                  onChange={onInputChangeUser}
                  autoComplete="off"
                  label="Usuario"
                />
                {showAlertUser && (
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert severity="error">Campo requerido</Alert>
                  </Stack>
                )}
              </div>
              <div className="input-group">
                <InputComponent
                  type="password"
                  name="passwordLoginInternalUser"
                  id="passwordLoginInternalUser"
                  value={passwordLoginInternalUser}
                  onChange={onInputChangePassword}
                  autoComplete="off"
                  label="Contraseña"
                />
                {showAlertPassword && (
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert severity="error">Campo requerido</Alert>
                  </Stack>
                )}
              </div>
              <ButtonComponent
                styles={{
                  marginTop: "120px",
                }}
                name={"SIGUIENTE"}
              />
              <div className="container_btn_pass_firts">
                <a>Recupero de Contraseña</a>
                <a onClick={redirectToRegister}>Ingreso por primera vez</a>
              </div>
            </form>
          </div>
        )}
        {showVerificationForm && (
          <div className="contenedor_form">
            <h1>Ingrese el numero de 6 digitos</h1>
            <form onSubmit={onVerificationCodeSubmit}>
              <div
                className="input-group"
                style={{
                  marginTop: "150px",
                }}
              >
                <InputComponent
                  type="number"
                  name="verificationCode"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={onVerificationCodeChange}
                  autoComplete="off"
                  label="Contraseña"
                />
              </div>
              <ButtonComponent
                styles={{
                  marginTop: "157px",
                }}
                name={"INGRESAR"}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
