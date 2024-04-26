import { useState } from 'react';
import logo from '../../assets/logo.svg';
import afipIcon from '../../assets/afip.svg';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StyleIcon from '@mui/icons-material/Style';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import NetworkLockedIcon from '@mui/icons-material/NetworkLocked';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PreviewIcon from '@mui/icons-material/Preview';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import {
  Link,
  useNavigate,
  useLocation,
  Outlet,
  NavLink,
} from 'react-router-dom';
import './DashboardPage.css';

// Drawer
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ReceiptIcon from '@mui/icons-material/Receipt';
import localStorageService from '@/components/localStorage/localStorageService';

const drawerWidth = 270;

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
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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

// Drawer final ************************

const DashboardPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const isRolEmpleador = localStorageService.isRolEmpleador();
  console.log('ROL USUARIO Empleador??: ', isRolEmpleador); // IMPRIME EMPLEADOR

  const onLogout = () => {
    navigate('/login', { replace: true });
    localStorage.removeItem('stateLogin');
  };

  // Drawer inicio
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Drawer final ************************

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader sx={{ marginTop: 2, marginBottom: 2 }}>
            <img
              src={logo}
              alt="imagen del logo"
              style={{ marginRight: 140 }}
            />
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
              marginTop: 50,
            }}
          >
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
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
                  }}
                >
                  <NavLink to="./inicio" className="icon-container">
                    <HomeIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Inicio</span>}
                  </NavLink>
                  {!isRolEmpleador && (
                    <NavLink to="./publicaciones" className="icon-container">
                      <PreviewIcon className="icon-link" />{' '}
                      {open && <span className="icon-link">Publicaciones</span>}
                    </NavLink>
                  )}
                  {!isRolEmpleador && (
                    <NavLink to="./feriados" className="icon-container">
                      <DateRangeIcon className="icon-link" />{' '}
                      {open && <span className="icon-link">Feriados</span>}
                    </NavLink>
                  )}
                  {isRolEmpleador && (
                    <NavLink to="./ddjj" className="icon-container">
                      <LibraryBooksIcon className="icon-link" />{' '}
                      {open && <span className="icon-link">DDJJ</span>}
                    </NavLink>
                  )}
                  {!isRolEmpleador && (
                    <NavLink
                      to="./ddjjconsultaempleado"
                      className="icon-container"
                    >
                      <LibraryBooksIcon className="icon-link" />{' '}
                      {open && <span className="icon-link">DDJJ Consulta</span>}
                    </NavLink>
                  )}
                  {isRolEmpleador && (
                    <NavLink to="./boletas" className="icon-container">
                      <StyleIcon className="icon-link" />{' '}
                      {open && <span className="icon-link">Boletas</span>}
                    </NavLink>
                  )}
                  {isRolEmpleador && (
                    <NavLink to="./pagos" className="icon-container">
                      <AccountBalanceWalletIcon className="icon-link" />{' '}
                      {open && <span className="icon-link">Pagos</span>}
                    </NavLink>
                  )}
                  {isRolEmpleador && (
                    <NavLink to="./misdatos" className="icon-container">
                      <PersonIcon className="icon-link" />{' '}
                      {open && <span className="icon-link">Datos Empresa</span>}
                    </NavLink>
                  )}
                  {isRolEmpleador && (
                    <NavLink
                      to="./generarotrospagos"
                      className="icon-container"
                    >
                      <ReceiptIcon className="icon-link" />{' '}
                      {open && <span className="icon-link">Boleta Blanca</span>}
                    </NavLink>
                  )}
                  {!isRolEmpleador && (
                    <NavLink
                      to="./cuitsrestringidos"
                      className="icon-container"
                    >
                      <NetworkLockedIcon className="icon-link" />{' '}
                      {open && (
                        <span className="icon-link">Cuits Restringidos</span>
                      )}
                    </NavLink>
                  )}
                  {isRolEmpleador && (
                    <NavLink to="./roles" className="icon-container">
                      <CoPresentIcon className="icon-link" />{' '}
                      {open && <span className="icon-link">Roles</span>}
                    </NavLink>
                  )}
                  {isRolEmpleador && (
                    <NavLink
                      to="./altausuariointerno"
                      className="icon-container"
                    >
                      <PersonAddIcon className="icon-link" />{' '}
                      {open && (
                        <span className="icon-link">Usuario Interno</span>
                      )}
                    </NavLink>
                  )}
                  {!isRolEmpleador && (
                    <NavLink to="./interesesafip" className="icon-container">
                      <img
                        src={afipIcon}
                        alt="afip"
                        className="icon-link"
                        style={{ width: 24, height: 24 }}
                      />{' '}
                      {open && (
                        <span className="icon-link">Intereses Afip</span>
                      )}
                    </NavLink>
                  )}
                  {!isRolEmpleador && (
                    <NavLink to="./ajustes" className="icon-container">
                      <img
                        src={afipIcon}
                        alt="afip"
                        className="icon-link"
                        style={{ width: 24, height: 24 }}
                      />{' '}
                      {open && (
                        <span className="icon-link">Ajustes</span>
                      )}
                    </NavLink>
                  )}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List
            style={{
              marginTop: 40,
              marginLeft: 5,
            }}
          >
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
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
                  }}
                >
                  <NavLink className="icon-container" onClick={onLogout}>
                    <DisabledByDefaultIcon className="icon-link" />{' '}
                    {open && <span className="icon-link">Salir</span>}
                  </NavLink>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default DashboardPage;
