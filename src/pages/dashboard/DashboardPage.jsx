import { useEffect, useState } from 'react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import './DashboardPage.css';
import afipIcon from '../../assets/afip.svg';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StyleIcon from '@mui/icons-material/Style';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import NetworkLockedIcon from '@mui/icons-material/NetworkLocked';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PreviewIcon from '@mui/icons-material/Preview';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import CalculateIcon from '@mui/icons-material/Calculate';
import './DashboardPage.css';
import LockPersonIcon from '@mui/icons-material/LockPerson';
// Drawer
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import localStorageService from '@/components/localStorage/localStorageService';
import { getFuncionalidadesByRol } from './DashboardPageApi';
import logo2 from '../../assets/logo_2.svg';
import { styled } from '@mui/material/styles';
import { ClaveComponent } from '@/components/ClaveComponent';

const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '0 24px',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DashboardPage = () => {
  const navigate = useNavigate();
  const [rolFuncionalidades, setRolFuncionalidades] = useState({});
  const rol = localStorageService.getRol();
  const [showModal, setShowModal] = useState(false);
  const nombre =localStorageService.getNombre();

  useEffect(() => {
    const fetchData = async () => {
      const { funcionalidades } = await getFuncionalidadesByRol(rol);
      //console.log('DashboardPage - funcionalidades:', funcionalidades);
      const roles = {};
      funcionalidades.forEach((funcionalidad) => {
        roles[funcionalidad.descripcion] = funcionalidad.activo;
      });
      setRolFuncionalidades(roles);
      console.log('DashboardPage - roles: ', roles);
    };
    fetchData();
  }, []);

  const onLogout = () => {
    navigate('/login', { replace: true });
    localStorage.removeItem('stateLogin');
  };

  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={() => {
          setOpen(true);
        }}
        onMouseLeave={() => {
          setOpen(false);
        }}
      >
        <DrawerHeader sx={{ marginTop: 2, marginBottom: 2 }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            {open ? (
              <ChevronLeftIcon className="icon-toggle" />
            ) : (
              <ChevronRightIcon className="icon-toggle" />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          style={{
            marginTop: -7,
            marginBottom: -10,
          }}
        >
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '-18px',
                }}
              >
                <NavLink to="./inicio" className="icon-container">
                  <HomeIcon className="icon-link" />{' '}
                  {open && <span className="icon-link">Inicio</span>}
                </NavLink>
                {rolFuncionalidades.DATOS_PERFIL && (
                  <NavLink to="./misdatos" className="icon-container">
                    <PersonIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Datos de Perfil</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.PUBLICACIONES && (
                  <NavLink to="./publicaciones" className="icon-container">
                    <PreviewIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Publicaciones</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.FERIADOS && (
                  <NavLink to="./feriados" className="icon-container">
                    <DateRangeIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Feriados</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.NUEVA_DDJJ && (
                  <NavLink to="./ddjj/alta" className="icon-container">
                    <LibraryBooksIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Nueva DDJJ</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.MIS_DDJJ && (
                  <NavLink to="./ddjj/consulta" className="icon-container">
                    <MenuBookIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Mis DDJJ</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.DDJJ_CONSULTA && (
                  <NavLink
                    to="./ddjjconsultaempleado"
                    className="icon-container"
                  >
                    <LibraryBooksIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">DDJJ Consulta</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.MIS_BOLETAS && (
                  <NavLink to="./boletas" className="icon-container">
                    <StyleIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Mis Boletas</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.BOLETAS_CONSULTA && (
                  <NavLink
                    to="./boletas/empleado/consulta"
                    className="icon-container"
                  >
                    <StyleIcon className="icon-link" />{' '}
                    {open && (
                      <span className="icon-link">Boletas Consulta</span>
                    )}
                  </NavLink>
                )}

                {rolFuncionalidades.BOLETA_ACTAS && (
                  <NavLink to="./generarotrospagos" className="icon-container">
                    <ReceiptIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Boleta Actas</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.GESTION_ROLES && (
                  <NavLink to="./gestion-roles" className="icon-container">
                    <DateRangeIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Gestion Roles</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.CUITS_RESTRINGIDOS && (
                  <NavLink to="./cuitsrestringidos" className="icon-container">
                    <NetworkLockedIcon className="icon-link" />{' '}
                    {open && (
                      <span className="icon-link">Cuits Restringidos</span>
                    )}
                  </NavLink>
                )}
                {rolFuncionalidades.ROLES && (
                  <NavLink to="./roles" className="icon-container">
                    <CoPresentIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Roles</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.USUARIO_INTERNO && (
                  <NavLink to="./altausuariointerno" className="icon-container">
                    <PersonAddIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Usuario Interno</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.AJUSTES && (
                  <NavLink to="./ajustes" className="icon-container">
                    <SettingsApplicationsIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Ajustes</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.INTERESES && (
                  <NavLink
                    to="./interesesafip"
                    className="icon-container icon-container-afip"
                  >
                    <img
                      src={afipIcon}
                      alt="afip"
                      className="icon-link icono-afip"
                    />{' '}
                    {open && <span className="icon-link">Intereses</span>}
                  </NavLink>
                )}
                {rolFuncionalidades.APORTES && (
                  <NavLink to="./aportes" className="icon-container">
                    <CalculateIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Aportes</span>}
                  </NavLink>
                )}
                {/*rolFuncionalidades.DEUDA && (
                  <NavLink to="./gestiondeuda" className="icon-container">
                    <CalculateIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Gestión Deuda</span>}
                  </NavLink>
                )*/}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List
          style={{
            marginTop: -7,
          }}
        >
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '-18px',
                }}
              >
                <NavLink
                  className="icon-container"
                  onClick={() => setShowModal(!showModal)}
                >
                  <LockPersonIcon className="icon-link" />{' '}
                  {open && <span className="icon-link">Cambiar Clave</span>}
                </NavLink>
                <NavLink className="icon-container" onClick={onLogout}>
                  <DisabledByDefaultIcon className="icon-link" />{' '}
                  {open && <span className="icon-link">Salir</span>}
                </NavLink>
                <NavLink  className="icon-container">
                    <PersonIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">{nombre}</span>}
                  </NavLink>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
        <ClaveComponent showModal={showModal} setShowModal={setShowModal} />
      </Drawer>
      <Box component="main">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#1a76d2',
            height: 110,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            paddingLeft: 80,
            paddingRight: 80,
          }}
        >
          <img
            style={{
              marginLeft: 120,
              width: 75,
            }}
            src={logo2}
            alt="imglogo"
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 80,
            }}
          >
            <h4
              style={{
                marginLeft: 30,
                color: '#fff',
                fontSize: '2rem',
              }}
            >
              UOMA
            </h4>
            <h4
              style={{
                marginLeft: 30,
                color: '#fff',
                fontSize: '2rem',
              }}
            >
              OSPIM
            </h4>
            <h4
              style={{
                marginLeft: 30,
                color: '#fff',
                fontSize: '2rem',
              }}
            >
              AMTIMA
            </h4>
          </div>
        </div>
      </Box>
      <Outlet />
    </Box>
  );
};

export default DashboardPage;
