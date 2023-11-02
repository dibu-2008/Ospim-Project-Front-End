import { useNavigate } from "react-router-dom"
import { useFormLoginCompany } from "../hooks/useFormLoginCompany.js"
import { useState } from "react"
import { useFormLoginInternalUser } from "../hooks/useFormLoginInternalUser.js";

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

  const onLoginInternalUser = (e)=>{
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
                  <input
                    type="text"
                    name="user"
                    id="user"
                    value={user}
                    onChange={OnInputChangeLoginInternalUser}
                    required
                    autoComplete="off"
                    placeholder="Usuario" />

                </div>
                {/********************************************************/}
                <div className="input-group">
                  <input
                    type="password"
                    name="passwordLoginInternalUser"
                    id="passwordLoginInternalUser"
                    value={passwordLoginInternalUser}
                    onChange={OnInputChangeLoginInternalUser}
                    required
                    autoComplete="off"
                    placeholder="Contraseña" />
                </div>
                <button
                  style={{ marginTop: '81px' }} 
                  className="btn_ingresar">INGRESAR</button>
              </form>
              <div className="x">
                <div className="input-group btn_form_botton">
                  <div className="container_btn_pass_firt">
                    <a>Recupero de Contraseña</a>
                  </div>
                  <a
                    onClick={onInternalUserClick}
                  >Usuario Empresa</a>
                </div>
              </div>
            </div>
          ) : (
            <div className="contenedor_form">
              <form onSubmit={onLoginCompany}>
                <h1>Usuario Empresas</h1>
                <h3>Iniciar sesión</h3>
                <div className="input-group">
                  <input
                    type="text"
                    name="cuit"
                    id="cuit"
                    value={cuit}
                    onChange={OnInputChangeLoginCompany}
                    required
                    autoComplete="off"
                    placeholder="CUIT" />

                </div>
                {/********************************************************/}
                <div className="input-group">
                  <input
                    type="passwordLoginCompany"
                    name="passwordLoginCompany"
                    id="passwordLoginCompany"
                    value={passwordLoginCompany}
                    onChange={OnInputChangeLoginCompany}
                    required
                    autoComplete="off"
                    placeholder="Contraseña" />
                </div>
                {/********************************************************/}
                <div className="input-group">
                  <input
                    type="text"
                    name="codigoVerificacion"
                    id="codigoVerificacion"
                    value={codigoVerificacion}
                    onChange={OnInputChangeLoginCompany}
                    required
                    autoComplete="off"
                    placeholder="Código de verificación" />
                </div>

                <button className="btn_ingresar">INGRESAR</button>
              </form>
              <div className="x">
                <div className="input-group btn_form_botton">
                  <div className="container_btn_pass_firt">
                    <a>Recupero de Contraseña</a>
                    <a
                      onClick={redirectToRegister}
                    >Ingreso por primera vez</a>
                  </div>
                  <a
                    onClick={onInternalUserClick}
                  >Usuario Interno</a>
                </div>
              </div>

            </div>
          )
        }

      </div>
    </div>

  )
}

export default LoginPage

