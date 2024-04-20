import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ButtonOutlinedComponent } from '../ButtonOutlinedComponent';
// importar una imagen de assets
import logo from '../../assets/logo_2.svg';
import './NavBar.css';

const NavBar = ({ estilos, estilosLogo, mostrarBtn }) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (state) localStorage.setItem('stateLogin', JSON.stringify(state));

  const login = () => {
    navigate('/login');
  };

  return (
    <div style={estilos}>
      <header>
        <Link to="/login">
          <div>
            <img style={estilosLogo} src={logo} alt="imglogo" />
            {mostrarBtn && (
              <div className="entidades">
                <h4>UOMA</h4>
                <h4>OSPIM</h4>
                <h4>AMTIMA</h4>
              </div>
            )}
          </div>
        </Link>

        {mostrarBtn ? (
          <ButtonOutlinedComponent name={'Iniciar Sesión'} onClick={login} />
        ) : (
          <div className="entidadesL">
            <h4>UOMA</h4>
            <h4>OSPIM</h4>
            <h4>AMTIMA</h4>
          </div>
        )}
      </header>

      <Outlet />
    </div>
  );
};

export default NavBar;
