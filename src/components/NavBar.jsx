import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ButtonOutlinedComponent } from "./ButtonOutlinedComponent";


const NavBar = () => {

  // Me imprime los datos que le paso por el state
  // logged: true
  // name: "Luis"
  // email: "luis@gmail"
  const { state } = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    navigate('/login', { replace: true })
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
          state?.logged ? (
            <div className="user">
              <span className="username">{state?.name}</span>
              <ButtonOutlinedComponent
                styles={{
                  backgrounColor:'red !important'
                }}
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