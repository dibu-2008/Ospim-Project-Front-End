import './DatosPersona.css';
import { Button, Box, TextField, Tabs, Tab } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import localStorageService from '@components/localStorage/localStorageService';

export const DatosPersona = () => {
  const rol = localStorageService.getRol();
  const usuario = localStorageService.getUsuario();
  const apellido = localStorageService.getApellido();
  const nombre = localStorageService.getNombre();
  const mail = localStorageService.getMail();
  const onSubmitClick = () => {
    return false;
  };

  console.log('DatosPersona - INIT');
  return (
    <div className="datos_container">
      Datos - Persona
      <h1>Mis Datos de Perfil</h1>
      <form
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          alignContent: 'center',
          margin: '50px auto',
        }}
        onSubmit={onSubmitClick}
      >
        Usuario:
        <TextField
          type="text"
          name="usuario"
          disabled={true}
          value={usuario}
          //onChange={OnChangeRazonSocial}
          autoComplete="off"
          //label="Usuario"
          sx={{
            width: '350px',
          }}
        />
        Rol:
        <TextField
          type="text"
          name="rol"
          disabled={true}
          value={rol}
          //onChange={OnChangeRazonSocial}
          autoComplete="off"
          //label="Rol"
          sx={{
            width: '350px',
          }}
        />
        Apellido:
        <TextField
          type="text"
          name="apellido"
          value={apellido}
          /// onChange={OnChangeCuit}
          autoComplete="off"
          //label="Apellido"
        />
        Nombre:
        <TextField
          type="text"
          name="nombre"
          value={nombre}
          //onChange={OnChangeRazonSocial}
          autoComplete="off"
          //label="Nombre"
          sx={{
            width: '350px',
          }}
        />
        Mail:
        <TextField
          type="text"
          name="mail"
          value={mail}
          //onChange={OnChangeRazonSocial}
          autoComplete="off"
          //label="Mail"
          sx={{
            width: '350px',
          }}
        />
        <Button variant="contained" sx={{}} type="submit">
          Guardar
        </Button>
      </form>
    </div>
  );
};
