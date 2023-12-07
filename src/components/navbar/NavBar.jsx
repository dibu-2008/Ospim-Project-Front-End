import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ButtonOutlinedComponent } from "../ButtonOutlinedComponent";
// importar una imagen de assets
import logo from '../../assets/logo.svg';
import './NavBar.css';

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
        <Link to="/login">
          <div>
            <img src={logo} alt="" />
            <div className="entidades">
              <h4>UOMA</h4>
              <h4>OSPIM</h4>
              <h4>AMTIMA</h4> 
            </div>
          </div>
        </Link>

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