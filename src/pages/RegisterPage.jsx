import { useNavigate } from "react-router-dom"
import { useFormLoginCompany } from "../hooks/useFormLoginCompany"

const RegisterPage = () => {

  // Recorda que le cambiaste todas las propiedades al custonHook de useFormLoginCompany

  const navigate = useNavigate();

  const { name, email, password, OnInputChange, OnResetForm } = useFormLoginCompany({
    name: '',
    email: '',
    password: ''
  })

  const onRegister = (e) => {
    e.preventDefault()

    navigate('/dashboard', {
      replace: true,
      state: {
        logged: true,
        name,
        email
      }
    })

    OnResetForm()
  }

  return (
    <div className="wrapper">
      <form onSubmit={onRegister}>
        <h1>Registrarse</h1>
        <div className="input-group">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={OnInputChange}
            required
            autoComplete="off" />
          <label htmlFor="name">Nombre: </label>
        </div>
        {/********************************************************/}
        <div className="input-group">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={OnInputChange}
            required
            autoComplete="off" />
          <label htmlFor="email">Email: </label>
        </div>
        {/********************************************************/}
        <div className="input-group">
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={OnInputChange}
            required
            autoComplete="off" />
          <label htmlFor="password">Password: </label>
        </div>

        <button>Iniciar Sesión</button>
      </form>
    </div>
  )
}

export default RegisterPage