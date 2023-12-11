import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"
import { useFormLoginCompany } from "../hooks/useFormLoginCompany.js"
import { useState } from "react"
import { useFormLoginInternalUser } from "../hooks/useFormLoginInternalUser.js";
import imgError from '../assets/error.svg';
import imgSuccess from '../assets/success.svg';
import imgLogo from '../assets/logo.svg';

// Material UI
import { InputComponent } from "../components/InputComponent.jsx";
import { ButtonComponent } from "../components/ButtonComponent.jsx";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;
const ERROR_BODY = import.meta.env.VITE_ERROR_BODY;
const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;

const LoginPage = () => {

  const navigate = useNavigate();

  const { user, passwordLoginInternalUser, OnInputChangeLoginInternalUser, OnResetFormLoginInternalUser } = useFormLoginInternalUser({
    user: '',
    passwordLoginInternalUser: ''
  })

  const [showInternalUserForm, setShowInternalUserForm] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [showAlertUser, setShowAlertUser] = useState(false);
  const [showAlertPassword, setShowAlertPassword] = useState(false);

  // SweetAlert2
  const showSwalError = (message) => {
    withReactContent(Swal).fire({
      html: `
            <div style="color:red; font-size: 26px; display: flex; flex-direction:column;">
             <img style="height:50px; width: 50px; margin: 10px auto;" src=${imgError}>
            ${message}
            </div>
        `,
      timer: 2000,
      showConfirmButton: false,
    })
  }

  const showSwalCodeVerification = (message) => {
    withReactContent(Swal).fire({
      html: `
            <div style="color:green; font-size: 26px; display: flex; flex-direction:column;">
            <img style="height:50px; width: 50px; margin: 10px auto;" src=${imgSuccess}>
            ${message}
            </div>
        `,
      timer: 2000,
      showConfirmButton: false,
    })
  }

  const showSwalSuccess = (message) => {
    withReactContent(Swal).fire({
      html: `
            <div 
            style="
              background-color:#1A76D2; 
              color:#fff; 
              font-size: 26px; 
              display: flex; 
              flex-direction:column;
              height:300px;
              align-items: center;
              justify-content: center;"
              >
              <img style="height:100px; width: 100px; margin: 10px auto;" src=${imgLogo}>
              <h2>Bienvenido al portal molineros</h2>
            </div>
        `,
      timer: 2000,
      background: '#1A76D2',
      showConfirmButton: false,
    })
  }

  const onLoginInternalUser2 = async (e) => {

    e.preventDefault()

    try {

      if (user === '' || passwordLoginInternalUser === '') {

        if (user === '') {
          setShowAlertUser(true);
        }

        if (passwordLoginInternalUser === '') {
          setShowAlertPassword(true);
        }
      } else {

        const userInicioSesion = {
          nombre: user,
          clave: passwordLoginInternalUser,
        }

        const response = await axios.post(`${BACKEND_URL}/login`, userInicioSesion);

        const { token, tokenRefresco } = response.data;

        if (token && tokenRefresco) {
          setShowInternalUserForm(false);
          setShowVerificationForm(true);

          showSwalCodeVerification('Código de verificación enviado correctamente');

          /* setTimeout(() => {
            alert('123456')
          }, 1000); */
        }

        setToken(token);
        setRefreshToken(tokenRefresco);
        OnResetFormLoginInternalUser();
      }

    } catch (error) {

      try {

        if (error.response && error.response.data) {

          const { codigo, descripcion, ticket, tipo } = error.response.data;

          if (tipo === ERROR_BUSINESS) {

            showSwalError(descripcion);

          } else {

            showSwalError(`${ERROR_MESSAGE} ${ticket}`);
            console.error(error.response.data);
          }
        } else {
          showSwalError(`${ERROR_MESSAGE}`);
          console.error(`${ERROR_BODY} : ${error}`);
        }

      } catch (error) {
        showSwalError(`${ERROR_MESSAGE}`);
        console.error(`${ERROR_BODY} : ${error}`);
      }

      OnResetFormLoginInternalUser();
    }
  }



  const redirectToRegister = () => {
    navigate('/registercompany', {
      replace: true
    })
  }

  const onVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  }

  const onVerificationCodeSubmit = (e) => {
    e.preventDefault();

    
    if (+(verificationCode) === 123456) {
      
      showSwalSuccess('Código de verificación correcto');

      navigate('/dashboard/inicio', {
        replace: true,
        state: {
          logged: true,
          token,
          refreshToken,
        },
      });
    } else {
      alert('Código de verificación incorrecto');
    }
  }

  const onInputChangeUser = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertUser(false);
  }

  const onInputChangePassword = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertPassword(false);
  }

  return (

    <div className="wrapper_container">

      <div className="wrapper">
        {showInternalUserForm && (
          <div className="contenedor_form">
            <form onSubmit={onLoginInternalUser2}>
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
                  /* variant="filled" */
                  label="Usuario"
                />
                {
                  showAlertUser && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="error">Campo requerido</Alert>
                    </Stack>
                  )
                }
              </div>
              <div className="input-group">
                <InputComponent
                  type="password"
                  name="passwordLoginInternalUser"
                  id="passwordLoginInternalUser"
                  value={passwordLoginInternalUser}
                  onChange={onInputChangePassword}
                  autoComplete="off"
                  /* variant="filled" */
                  label="Contraseña"
                />
                {
                  showAlertPassword && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="error">Campo requerido</Alert>
                    </Stack>
                  )
                }
              </div>
              <ButtonComponent
                styles={{
                  marginTop: '120px',
                }}
                name={'SIGUIENTE'}
              />
              <div className="container_btn_pass_firts">
                <a>Recupero de Contraseña</a>
                <a
                  onClick={redirectToRegister}
                >Ingreso por primera vez</a>
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
                  marginTop: '150px'
                }}
              >
                <InputComponent
                  type="number"
                  name="verificationCode"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={onVerificationCodeChange}
                  autoComplete="off"
                  // variant="filled"
                  label="Contraseña"
                />
              </div>
              <ButtonComponent
                styles={{
                  marginTop: '157px',
                }}
                name={'INGRESAR'}
              />
            </form>

          </div>
        )}
        {/*  {
          showErrorModal && (
            <div className="error_modal">
              <h1>{credentialsError.message}</h1>
            </div>
          )
        } */}
      </div>
    </div>

  )
}

export default LoginPage