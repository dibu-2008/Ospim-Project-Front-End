import {
  consultarUsuarioLogueado,
  logon,
  logonDFA,
  usuarioLogueadoHabilitadoDFA,
} from "./LoginApi.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFormLoginInternalUser } from "../../hooks/useFormLoginInternalUser.js";
import { InputComponent } from "@components/InputComponent.jsx";
import { ButtonComponent } from "@components/ButtonComponent.jsx";
import { showSwalSuccess } from "./LoginShowAlert.js";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import "./LoginPage.css";
import { Button, TextField } from "@mui/material";
import { ThreeCircles } from "react-loader-spinner";

const VITE_WELCOME_PORTAL = import.meta.env.VITE_WELCOME_PORTAL;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(true);
  const [showInternalUserForm, setShowInternalUserForm] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showAlertUser, setShowAlertUser] = useState(false);
  const [showAlertPassword, setShowAlertPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("310279");
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [showInputComponent, setShowInputComponent] = useState(false);

  const {
    user,
    passwordLoginInternalUser,
    OnInputChangeLoginInternalUser,
    OnResetFormLoginInternalUser,
  } = useFormLoginInternalUser({
    user: "",
    passwordLoginInternalUser: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
  }, []);

  //Link a Registrar Compania
  const redirectToRegister = () => {
    navigate("/registercompany", {
      replace: true,
    });
  };

  //Eventos para Form de Loguin (usuario-clave)
  const onInputChangeUser = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertUser(false);
  };

  const onInputChangePassword = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertPassword(false);
  };

  //Submit Form de Loguin
  const onLoginInternalUser = async (e) => {
    e.preventDefault();
    if (user === "" || passwordLoginInternalUser === "") {
      if (user === "") setShowAlertUser(true);
      if (passwordLoginInternalUser === "") setShowAlertPassword(true);
      return false;
    }

    const loginDto = await logon(user, passwordLoginInternalUser);

    if (loginDto && loginDto.token) {
      console.log("EXISTE loginDto.token");
      const usuarioConDFA = await usuarioLogueadoHabilitadoDFA(loginDto.token);
      let bUsuarioConDFA = false;
      if (usuarioConDFA && usuarioConDFA.valor) {
        bUsuarioConDFA = true;
      }
      console.log(bUsuarioConDFA);
      if (bUsuarioConDFA) {
        console.log("usuarioHabilitadoDFA: TRUE !!!");
        setShowInternalUserForm(false);
        setShowVerificationForm(true);
      } else {
        console.log("usuarioHabilitadoDFA: FALSE !!!");
        setToken(loginDto.token);
        setRefreshToken(loginDto.tokenRefresco);
        //OnResetFormLoginInternalUser();

        const usuarioLogueado = await consultarUsuarioLogueado(loginDto.token);
        console.log("usuarioLogueado: ");
        console.log(usuarioLogueado);

        getUsuarioLogueadoInfo(
          usuarioLogueado,
          loginDto.token,
          loginDto.tokenRefresco
        );

        showSwalSuccess(VITE_WELCOME_PORTAL);
      }
    } else {
      console.log(loginDto);
      console.log("onLoginInternalUser - INIT-loginDto:NO EXISTE");
    }
    OnResetFormLoginInternalUser();
  };

  //Eventos para Form DFA  (Token)
  const onVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  //Submit Formulario DFA (Token)
  const onVerificationCodeSubmit = async (e) => {
    e.preventDefault();

    const logonDfa = await logonDFA(token, verificationCode);

    if (logonDfa) {
      showSwalSuccess(VITE_WELCOME_PORTAL);

      const { token, refreshToken } = logonDfa;

      const usuarioLogueado = await consultarUsuarioLogueado(token);

      getUsuarioLogueadoInfo(usuarioLogueado, token, refreshToken);
    }
  };

  //Consulta Datos Usuario Logueado
  const getUsuarioLogueadoInfo = (usuarioLogueado, token, refreshToken) => {
    console.log("usuarioInfoFinal - init");
    console.log(usuarioLogueado);
    if (usuarioLogueado.hasOwnProperty("usuario")) {
      usuarioLogueado.usuario.token = token;
      usuarioLogueado.usuario.tokenRefresco = refreshToken;
      console.log(usuarioLogueado);
      navigate("/dashboard/inicio", {
        replace: true,
        state: {
          logged: true,
          usuarioLogueado,
        },
      });
      console.log("HIZO navigate() !! ");
    } else {
      console.log(
        "usuarioInfoFinal - usuarioLogueado.hasOwnProperty() = FALSE"
      );
    }
  };

  useEffect(() => {
    if (showVerificationForm) {
      const timer = setTimeout(() => {
        setShowInputComponent(true);
        setShowLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showVerificationForm]); // useEffect se ejecutará cuando showVerificationForm cambie

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
                  marginTop:
                    showAlertUser && showAlertPassword ? "50px" : "120px",
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
            <h1>Ingrese Token de validaci&oacute;n</h1>

            <form onSubmit={onVerificationCodeSubmit}>
              <div className="input_group_code">
                <ThreeCircles
                  visible={showLoading}
                  height="100"
                  width="100"
                  color="#1A76D2"
                  ariaLabel="three-circles-loading"
                  wrapperStyle={{
                    margin: "0 auto",
                  }}
                  wrapperClass=""
                />
                {showInputComponent && (
                  <TextField
                    type="text"
                    name="verificationCode"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={onVerificationCodeChange}
                    autoComplete="off"
                    label="Código"
                    className="input_data"
                  />
                )}
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