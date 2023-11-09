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

  const [showInternalUserForm, setShowInternalUserForm] = useState(false);

  const onLoginCompany = (e) => {
    e.preventDefault()

    navigate('/dashboard', {
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

  const onLoginInternalUser = (e) => {
    e.preventDefault()

    navigate('/dashboard', {
      replace: true,
      state: {
        logged: true,
        user,
        passwordLoginInternalUser
      }
    })
  }

  const onInternalUserClick = () => {
    setShowInternalUserForm(!showInternalUserForm)
  }

  const redirectToRegister = () => {
    navigate('/registercompany', {
      replace: true
    })
  }

  return (

    <div className="wrapper_container">

      <div className="wrapper">
        {
          showInternalUserForm ? (
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
                    variant="filled"
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
                    variant="filled"
                    label="Contraseña"
                  />
                </div>
                <ButtonComponent
                  styles={{
                    marginTop: '157px',
                  }}
                  name={'INGRESAR'}
                />
                <div className="container_btn_pass_firts">
                  <a>Recupero de Contraseña</a>
                  <a
                    onClick={onInternalUserClick}
                  >Usuario Empresa</a>
                </div>
              </form>
            </div>
          ) : (
            <div className="contenedor_form">
              <form onSubmit={onLoginCompany}>
                <h1>Usuario Empresas</h1>
                <h3>Iniciar sesión</h3>
                <div className="input-group">
                  <InputComponent
                    type="text"
                    name="cuit"
                    id="cuit"
                    value={cuit}
                    onChange={OnInputChangeLoginCompany}
                    required
                    autoComplete="off"
                    variant="filled"
                    label="CUIT" />

                </div>
                <div className="input-group">
                  <InputComponent
                    type="passwordLoginCompany"
                    name="passwordLoginCompany"
                    id="passwordLoginCompany"
                    value={passwordLoginCompany}
                    onChange={OnInputChangeLoginCompany}
                    required
                    autoComplete="off"
                    variant="filled"
                    label="Contraseña" />
                </div>
                <div className="input-group">
                  <InputComponent
                    type="text"
                    name="codigoVerificacion"
                    id="codigoVerificacion"
                    value={codigoVerificacion}
                    onChange={OnInputChangeLoginCompany}
                    required
                    autoComplete="off"
                    variant="filled"
                    label="Código de verificación" />
                </div>
                <ButtonComponent
                  styles={{
                    marginTop: '81px',
                  }}
                  name={'INGRESAR'}
                />
                <div className="container_btn_pass_firts_2">
                  <div className="children_one_btn_pass_firts_2">
                    <a>Recupero de Contraseña</a>
                    <a
                      onClick={redirectToRegister}
                    >Ingreso por primera vez</a>
                  </div>

                </div>
                <a
                  className="internal_user"
                  onClick={onInternalUserClick}
                >Usuario Interno</a>
              </form>
            </div>
          )
        }

      </div>
    </div>

  )
}

export default LoginPage

