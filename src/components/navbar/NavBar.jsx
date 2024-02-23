import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ButtonOutlinedComponent } from "../ButtonOutlinedComponent";
// importar una imagen de assets
import logo from '../../assets/logo_2.svg';
import './NavBar.css';

const NavBar = () => {

  const { state } = useLocation();
  const navigate = useNavigate(); 

  if (state)
    localStorage.setItem('stateLogin', JSON.stringify(state))

  const localState = localStorage.getItem('stateLogin')
  const localStateParse = JSON.parse(localState)

  const onLogout = () => {
    navigate('/login', { replace: true })
    localStorage.removeItem('stateLogin')
  }

  const login = () => {
    navigate('/login')
  }

  return (
    <div
      style={{
        backgroundColor: '#1a76d2'
      }}
    >
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
        <ButtonOutlinedComponent
          name={'Iniciar Sesión'}
          onClick={login}
        />

        {/* {
          localStateParse?.logged && (
            <div className="user">
              {//<span className="username">{state?.name}</span>}
              <ButtonOutlinedComponent
                name={'Cerrar Sesión'}
                onClick={onLogout}
              />
            </div>
          ) 
        } */}
      </header>

      <Outlet />
    </div>
  )
}

export default NavBar;