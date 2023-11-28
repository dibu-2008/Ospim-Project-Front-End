import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ButtonOutlinedComponent } from "./ButtonOutlinedComponent";


const NavBar = () => {

  const { state } = useLocation();
  const navigate = useNavigate(); 

  if (state)
    localStorage.setItem('state', JSON.stringify(state))

  const localState = localStorage.getItem('state')
  const localStateParse = JSON.parse(localState)

  const onLogout = () => {
    navigate('/login', { replace: true })
    localStorage.removeItem('state')
  }

  return (
    <>
      <header>
        <div>
          <h2><Link to="/login">UOMA</Link></h2>
          <h2><Link to="/login">OSPIM</Link></h2>
          <h2><Link to="/login">AMTIMA</Link></h2>
        </div>

        {
          localStateParse?.logged ? (
            <div className="user">
              {/* <span className="username">{state?.name}</span> */}
              <ButtonOutlinedComponent
                name={'Cerrar Sesión'}
                onClick={onLogout}
              />
            </div>
          ) : (
            <nav>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Registrarse</Link>
            </nav>
          )
        }

      </header>

      <Outlet />
    </>
  )
}

export default NavBar;