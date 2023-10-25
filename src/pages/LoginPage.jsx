import { useNavigate } from "react-router-dom"
import { useFormLoginCompany } from "../hooks/useFormLoginCompany.js"
import { useState } from "react"
import { useFormLoginInternalUser } from "../hooks/useFormLoginInternalUser.js";

const LoginPage = () => {

  // Navigate sirve para navegar entre las rutas
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

  const onLogin = (e) => {
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

  const onInternalUserClick = () => {
    setShowInternalUserForm(!showInternalUserForm)
  }

  return (
    <div className="wrapper">
      {
        showInternalUserForm ? (
          <form onSubmit={onLogin}>
            <h1>Usuario Interno</h1>
            <h2>Iniciar sesión</h2>
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
            <button>INGRESAR</button>
          </form>
        ) : (
          <form onSubmit={onLogin}>
            <h1>Usuario Empresas</h1>
            <h2>Iniciar sesión</h2>
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

            <button>INGRESAR</button>
          </form>
        )

      }

      <button>Recupero de Contraseña</button>
      <button>Ingreso por primera vez</button>
      .......................................
      <br />
      <button
        onClick={onInternalUserClick}
      >Usuario Interno</button>
    </div>
  )
}

export default LoginPage