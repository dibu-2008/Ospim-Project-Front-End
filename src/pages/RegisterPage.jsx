import { useNavigate } from "react-router-dom"
import { useFormLoginCompany } from "../hooks/useFormLoginCompany"

const RegisterPage = () => {

  // Recorda que le cambiaste todas las propiedades al custonHook de useFormLoginCompany ya esta

  // Crear el form como debe de ser para resgistar empresa

  const navigate = useNavigate();

  const { name, email, password, OnInputChangeLoginCompany, OnResetFormLoginCompany } = useFormLoginCompany({
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

    OnResetFormLoginCompany()
  }

  return (
    <div className="wrapper_container">
      <div className="wrapper">
        <div className="contenedor_form">
          <form onSubmit={onRegister}>
            <h1 className="title_register">Registro</h1>
            <div className="input-group">
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={OnInputChangeLoginCompany}
                required
                autoComplete="off" 
                placeholder="Nombre"/>
            </div>
            {/********************************************************/}
            <div className="input-group">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={OnInputChangeLoginCompany}
                required
                autoComplete="off" 
                placeholder="E-mail"/>
              
            </div>
            {/********************************************************/}
            <div className="input-group">
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={OnInputChangeLoginCompany}
                required
                autoComplete="off"
                placeholder="Password"/>
            </div>
            <button 
            style={{ marginTop: '10px' }} 
            className="btn_ingresar">REGISTRARSE</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage