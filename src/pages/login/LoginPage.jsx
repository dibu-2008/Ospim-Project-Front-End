import { consultarUsuarioLogueado, logon, logonDFA, usuarioLogueadoHabilitadoDFA } from "./LoginApi.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormLoginInternalUser } from "../../hooks/useFormLoginInternalUser.js";
import { InputComponent } from "../../components/InputComponent.jsx";
import { ButtonComponent } from "../../components/ButtonComponent.jsx";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import imgError from "../../assets/error.svg";
import imgSuccess from "../../assets/success.svg";
import imgLogo from "../../assets/logo.svg";
import { errorBackendResponse } from "../../errors/errorBackendResponse.js";
import "./LoginPage.css";

const VITE_WELCOME_PORTAL = import.meta.env.VITE_WELCOME_PORTAL;

export const LoginPage = () => {

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
  const [verificationCode, setVerificationCode] = useState("310279");
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

  const onVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const onInputChangeUser = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertUser(false);
  };

  const onInputChangePassword = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertPassword(false);
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

      // Obtengo los tokens
      //console.log(token, tokenRefresco);

      // Consultar si el usuario tiene habilitado el DFA
      const usuarioHabilitadoDFA = await usuarioLogueadoHabilitadoDFA(token);

      if (usuarioHabilitadoDFA) {
        console.log("Usuario habilitado para DFA");
        setShowInternalUserForm(false);
        setShowVerificationForm(true);

      } else {

        setToken(token);
        setRefreshToken(tokenRefresco);
        OnResetFormLoginInternalUser();

        showSwalSuccess(VITE_WELCOME_PORTAL);

        navigate("/dashboard/inicio", {
          replace: true,
          state: {
            logged: true,
            token,
            tokenRefresco,
          },
        });

      }
    } catch (error) {
      errorBackendResponse(error, showSwalError);
      OnResetFormLoginInternalUser();
    }
  };

  const redirectToRegister = () => {
    navigate("/registercompany", {
      replace: true,
    });
  };

  const onVerificationCodeSubmit = async (e) => {
    e.preventDefault();

    const logonDfa = await logonDFA(token, verificationCode);

    if (logonDfa) {

      showSwalSuccess(VITE_WELCOME_PORTAL);

      const { token, tokenRefresco } = logonDfa;

      const usuarioLogueado = await consultarUsuarioLogueado(token);

      console.log(usuarioLogueado);

      /* const usuario = {
        usuario: {
          nombre: usuarioLogueado.nombre,
          rol: [
            {
              descripcion: usuarioLogueado.rol.descripcion,
            }
          ]
        },
        empresa: {
          id: usuarioLogueado.empresa.id,
          razonSocial: usuarioLogueado.empresa.razonSocial,
          cuit: usuarioLogueado.empresa.cuit,
          ramoId: usuarioLogueado.empresa.ramoId,
        }
      }

      console.log(usuario); */

      /* navigate("/dashboard/inicio", {
        replace: true,
        state: {
          logged: true,
          token,
          tokenRefresco,
        },
      }); */
    }
  };



  return (
    <div className="wrapper_container">

      {showInternalUserForm && (
        <div className="wrapper">
          <div className="contenedor_form">
            <form onSubmit={onLoginInternalUser}>
              <h1>Iniciar Sesión</h1>
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
                  marginTop: showAlertUser && showAlertPassword ? "50px" : "120px",
                }}
                name={"SIGUIENTE"}
              />
              <div className="container_btn_pass_firts">
                <a>Recupero de Contraseña</a>
                <a onClick={redirectToRegister}>Ingreso por primera vez</a>
              </div>
            </form>
          </div>
        </div>
      )}
      {showVerificationForm && (
        <div className="wrapper">
        <div className="contenedor_form_code">
          <h1>Ingrese el codigó</h1>
          <form onSubmit={onVerificationCodeSubmit}>
            <div className="input_group_code">
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
        </div>
      )}
    </div>
  );
};
