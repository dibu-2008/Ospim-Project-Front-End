import axios from "axios";
import { useNavigate } from "react-router-dom"
import { useFormLoginCompany } from "../hooks/useFormLoginCompany.js"
import { useState } from "react"
import { useFormLoginInternalUser } from "../hooks/useFormLoginInternalUser.js";


// Material UI
import { InputComponent } from "../components/InputComponent.jsx";
import { ButtonComponent } from "../components/ButtonComponent.jsx";


const LoginPage = () => {

  const navigate = useNavigate();

  const { cuit, passwordLoginCompany, codigoVerificacion, OnInputChangeLoginCompany, OnResetFormLoginCompany } = useFormLoginCompany({
    cuit: '',
    passwordLoginCompany: '',
    codigoVerificacion: ''
  })
  const { user, passwordLoginInternalUser, OnInputChangeLoginInternalUser, OnResetFormLoginInternalUser } = useFormLoginInternalUser({
    user: '',
    passwordLoginInternalUser: ''
  })

  const [showInternalUserForm, setShowInternalUserForm] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const onLoginCompany = (e) => {
    e.preventDefault()

    navigate('/dashboard/inicio', {
      replace: true,
      state: {
        logged: true,
        cuit,
        passwordLoginCompany,
        codigoVerificacion
      }
    })

    OnResetFormLoginCompany()
  }

  const onLoginInternalUser = async (e) => {
    e.preventDefault();

    try {
      const url = 'http://localhost:3000/login';
      const response = await axios.get(url);

      if (response.data[0].usuario === user && response.data[0].clave === passwordLoginInternalUser) {

        setShowInternalUserForm(false);
        setShowVerificationForm(true);

        setTimeout(() => {
          alert('123456')
        }, 1000);

        return;
      }

    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

    OnResetFormLoginInternalUser();
  };



  const onLoginInternalUser2 = async (e) => {

    e.preventDefault()

    try {
      const url = 'http://127.0.0.1:8400/sigeco/auth/login';
      const data = {
        usuario: user,
        clave: passwordLoginInternalUser,
      };

      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Manejar la respuesta aquí
      const { token, tokenRefresco } = response.data;
      console.log('Token:', token);
      console.log('Token de refresco:', tokenRefresco);

      // Navegar a '/dashboard' después de una respuesta exitosa
      navigate('/dashboard', {
        replace: true,
        state: {
          logged: true,
          user: data.usuario,  // Puedes utilizar el usuario proporcionado en la solicitud
          // O podrías usar la respuesta del servidor si es necesario: user: response.data.usuario,
          passwordLoginInternalUser: data.clave,
        },
      });

    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }

    OnResetFormLoginInternalUser();
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

    if (+(verificationCode) === 12345) {

      navigate('/dashboard/inicio', {
        replace: true,
        state: {
          logged: true,
          user,
          passwordLoginInternalUser,
        },
      });
    } else {
      alert('Código de verificación incorrecto');
    }

  }

  return (

    <div className="wrapper_container">

      <div className="wrapper">
        { showInternalUserForm && (
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
                    onChange={OnInputChangeLoginInternalUser}
                    autoComplete="off"
                    /* variant="filled" */
                    label="Usuario"
                  />
                </div>
                <div className="input-group">
                  <InputComponent
                    type="password"
                    name="passwordLoginInternalUser"
                    id="passwordLoginInternalUser"
                    value={passwordLoginInternalUser}
                    onChange={OnInputChangeLoginInternalUser}
                    autoComplete="off"
                    /* variant="filled" */
                    label="Contraseña"
                  />
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
        { showVerificationForm && (
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
      </div>
    </div>

  )
}

export default LoginPage

