import { consultarUsuarioLogueado, logon, logonDFA, usuarioLogueadoHabilitadoDFA } from "./LoginApi.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormLoginInternalUser } from "../../hooks/useFormLoginInternalUser.js";
/* ANTES 
import { InputComponent } from "../../components/InputComponent.jsx";
import { ButtonComponent } from "../../components/ButtonComponent.jsx"; 
*/
// Ahora 
import { InputComponent } from "@components/InputComponent.jsx";
import { ButtonComponent } from "@components/ButtonComponent.jsx";
import { showSwalSuccess } from "./LoginShowAlert.js";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import "./LoginPage.css";
import { Button, TextField } from "@mui/material";

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
  const [showAlertUser, setShowAlertUser] = useState(false);
  const [showAlertPassword, setShowAlertPassword] = useState(false);


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

  const usuarioInfoFinal = (usuarioLogueado, token, tokenRefresco)=>{

    if(usuarioLogueado.hasOwnProperty('usuario')){
      usuarioLogueado.usuario.token = token;
      usuarioLogueado.usuario.tokenRefresco = tokenRefresco;
      navigate("/dashboard/inicio", {
        replace: true,
        state: {
          logged: true,
          usuarioLogueado,
        },
      });
    }
  }

  const onLoginInternalUser = async (e) => {
    e.preventDefault();


    if (user === "" || passwordLoginInternalUser === "") {
      if (user === "") setShowAlertUser(true);
      if (passwordLoginInternalUser === "") setShowAlertPassword(true);
      return false;
    }

    const { token, tokenRefresco } = await logon(user, passwordLoginInternalUser);

    const usuarioHabilitadoDFA = await usuarioLogueadoHabilitadoDFA(token);

    if (usuarioHabilitadoDFA) {
      setShowInternalUserForm(false);
      setShowVerificationForm(true);

    } else {

      setToken(token);
      setRefreshToken(tokenRefresco);
      OnResetFormLoginInternalUser();
      showSwalSuccess(VITE_WELCOME_PORTAL);

      const usuarioLogueado = await consultarUsuarioLogueado(token);

      usuarioInfoFinal(usuarioLogueado, token, tokenRefresco);
    }

    OnResetFormLoginInternalUser();

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

      usuarioInfoFinal(usuarioLogueado, token, tokenRefresco);
    }
  };


  return (
    <div className="wrapper_container">
      {showInternalUserForm && (
        <div className="wrapper">
          <div className="contenedor_form">
            <form onSubmit={onLoginInternalUser}>
              <h1>Iniciar Sesión</h1>
              <div className="input-group contenedor_usuario">
                <TextField
                  type="text"
                  name="user"
                  id="user"
                  value={user}
                  onChange={onInputChangeUser}
                  autoComplete="off"
                  label="Usuario"
                  className="input_data"
                />
                {showAlertUser && (
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert severity="error">Campo requerido</Alert>
                  </Stack>
                )}
              </div>
              <div className="input-group">
                <TextField
                  type="password"
                  name="passwordLoginInternalUser"
                  id="passwordLoginInternalUser"
                  value={passwordLoginInternalUser}
                  onChange={onInputChangePassword}
                  autoComplete="off"
                  label="Contraseña"
                  className="input_data"
                />
                {showAlertPassword && (
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert severity="error">Campo requerido</Alert>
                  </Stack>
                )}
              </div>
              <Button
                variant="contained"
                sx={{
                  marginTop: showAlertUser && showAlertPassword ? "50px" : "120px",
                }}
                type="submit"
                className="siguiente"
              >
                SIGUIENTE
              </Button>
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
