import { useState } from 'react';
import { useFormRegisterCompany } from '../../hooks/useFormRegisterCompany';
import { GrillaEmpresaDomicilio } from '../dashboard/pages_dashboard/datos_empresa/grilla_empresa_domicilio/GrillaEmpresaDomicilio';
import { registrarEmpresa, getRamo } from './RegistroEmpresaApi';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './RegistroEmpresa.css';
import NavBar from '@/components/navbar/NavBar';
import swal from '@/components/swal/swal';
import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Tooltip,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { textAlign } from '@mui/system';
import { styled } from '@mui/material/styles';

const CustomSelect = styled(Select)({
  textAlign: 'left',
  '& .MuiSelect-select': {
    textAlign: 'left',
  },
});

const CustomMenuItem = styled(MenuItem)({
  textAlign: 'left',
});

export const RegistroEmpresa = () => {
  const [additionalEmail, setAddionalEmail] = useState([]);
  const [emailAlternativos, setEmailAlternativos] = useState([]);
  const [additionalPhone, setAdditionalPhone] = useState([]);
  const [phoneAlternativos, setPhoneAlternativos] = useState([]);
  const [idPhoneAlternativos, setIdPhoneAlternativos] = useState(2);
  const [idEmailAlternativos, setIdEmailAlternativos] = useState(2);
  const [rows, setRows] = useState([]);
  const [showPassword, setShowPassword] = useState(true);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(true);

  // Estados de tratamiento de errores
  const [errorCuit, setErrorCuit] = useState(false);
  const [errorRazonSocial, setErrorRazonSocial] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPrefijoFirst, setErrorPrefijoFirst] = useState(false);
  const [errorPhoneFirst, setErrorPhoneFirst] = useState(false);
  const [errorPrefijoSecond, setErrorPrefijoSecond] = useState(false);
  const [errorPhoneSecond, setErrorPhoneSecond] = useState(false);
  const [errorWhatsapp, setErrorWhatsapp] = useState(false);
  const [errorWhatsappPrefijo, setErrorWhatsappPrefijo] = useState(false);

  const {
    cuit,
    razonSocial,
    actividad_molinera,
    email_first,
    email_second,
    password,
    repeatPassword,
    prefijo_first,
    phone_first,
    prefijo_second,
    phone_second,
    whatsapp,
    whatsapp_prefijo,
    OnInputChangeRegisterCompany,
    OnResetFormRegisterCompany,
  } = useFormRegisterCompany({
    cuit: '',
    actividad_molinera: '',
    razonSocial: '',
    email_first: '',
    email_second: '',
    password: '',
    repeatPassword: '',
    prefijo_first: '',
    phone_first: '',
    prefijo_second: '',
    phone_second: '',
    whatsapp: '',
    whatsapp_prefijo: '',
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordRepeat = () =>
    setShowPasswordRepeat((show) => !show);

  const handleMouseDownPasswordRepeat = (event) => {
    event.preventDefault();
  };

  const OnSubmitRegisterCompany = async (e) => {
    console.log('OnSubmitRegisterCompany - INIT');
    e.preventDefault();

    // Validar de que password y repeatPassword sean iguales
    if (password !== repeatPassword) {
      swal.showErrorBackEnd('Las contraseñas no coinciden', {});
      return;
    }

    let usuarioEmpresa = {
      razonSocial: razonSocial,
      cuit: cuit,
      actividad_molinera: actividad_molinera,
      clave: password,
      email: email_first,
      telefono: phone_first,
      telefono_prefijo: prefijo_first,
      whatsapp: whatsapp,
      whatsapp_prefijo: whatsapp_prefijo,
    };

    if (
      phoneAlternativos &&
      phoneAlternativos.length > 0 &&
      (prefijo_second || phone_second)
    ) {
      usuarioEmpresa['telefonosAlternativos'] = [
        {
          prefijo: prefijo_second,
          nro: phone_second,
          //id: 1
        },
        ...phoneAlternativos.map((phone) => ({
          prefijo: phone.prefijo,
          nro: phone.nro,
          //id: phone.id
        })),
      ];
    } else {
      if (
        phoneAlternativos &&
        phoneAlternativos.length > 0 &&
        (prefijo_second || phone_second)
      )
        usuarioEmpresa['telefonosAlternativos'] = [
          {
            prefijo: prefijo_second,
            nro: phone_second,
            //id: 1
          },
        ];
    }

    if (emailAlternativos && emailAlternativos.length > 0 && email_second) {
      usuarioEmpresa[emailAlternativos] = [
        {
          email: email_second,
        },
        ...emailAlternativos.map((email) => ({
          email: email.email,
        })),
      ];
    } else {
      if (emailAlternativos && emailAlternativos.length > 0 && email_second) {
        usuarioEmpresa[emailAlternativos] = [
          {
            email: email_second,
          },
        ];
      }
    }

    if (rows && rows.length > 0) {
      usuarioEmpresa['domicilios'] = rows.map((row) => ({
        tipo: row.tipo,
        provinciaId: row.provincia.id,
        localidadId: row.localidad.id,
        calle: row.calle,
        numeroDomicilio: row.numeroDomicilio,
        piso: row.piso,
        depto: row.depto,
        oficina: row.oficina,
        cp: row.cp,
        planta: row.planta,
      }));
    }

    const rta = await registrarEmpresa(usuarioEmpresa);
    console.log('RESPUESTAAAAAAAA');
    console.log(rta);

    if (rta && rta.id) {
      setAddionalEmail([]);
      setEmailAlternativos([]);
      setAdditionalPhone([]);
      setRows([]);
      OnResetFormRegisterCompany();
    } else {
      if (rta.includes('cuit')) setErrorCuit(true);
      if (rta.includes('razonSocial')) setErrorRazonSocial(true);
      if (rta.includes('email')) setErrorEmail(true);
      if (rta.includes('telefono_prefijo')) setErrorPrefijoFirst(true);
      if (rta.includes('telefono')) setErrorPhoneFirst(true);
      if (rta.includes('telefono_prefijo')) setErrorPrefijoSecond(true);
      if (rta.includes('telefono')) setErrorPhoneSecond(true);
      if (rta.includes('whatsapp_prefijo')) setErrorWhatsappPrefijo(true);
      if (rta.includes('whatsapp')) setErrorWhatsapp(true);
    }
  };

  const handleAddEmail = () => {
    setIdEmailAlternativos(idEmailAlternativos + 1);

    const values = [...additionalEmail];
    const newEmail = {
      email: '',
      id: idEmailAlternativos,
    };
    values.push(newEmail);
    setEmailAlternativos([...emailAlternativos, newEmail]);
    setAddionalEmail(values);
  };

  const handleAddPhone = () => {
    setIdPhoneAlternativos(idPhoneAlternativos + 1);

    const values = [...additionalPhone];
    const newPhone = {
      prefijo: '',
      nro: '',
      id: idPhoneAlternativos,
    };
    values.push(newPhone);
    setPhoneAlternativos([...phoneAlternativos, newPhone]);
    setAdditionalPhone(values);
  };

  return (
    <main>
      <NavBar
        estilos={{
          backgroundColor: '#1a76d2',
        }}
        mostrarBtn={true}
      />
      <div className="registro_empresa_container">
        <form onSubmit={OnSubmitRegisterCompany} className="form">
          <div className="form_register_company">
            <h1>Bienvenidos a OSPIM</h1>
            <h3>Formulario de registro</h3>
            <div className="input-group">
              <TextField
                error={errorCuit}
                type="text"
                name="cuit"
                value={cuit}
                onChange={OnInputChangeRegisterCompany}
                autoComplete="off"
                label="CUIT / CUIL"
              />
              <span style={styContToolAst}>
                <Tooltip
                  followCursor
                  title="Ingrese el CUIT / CUIL sin guiones ni espacios. Ejemplo: 30715478567"
                  sx={{ cursor: 'pointer' }}
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <div style={styAst}>*</div>
              </span>
            </div>
            <div className="input-group">
              <TextField
                error={errorRazonSocial}
                type="text"
                name="razonSocial"
                value={razonSocial}
                onChange={OnInputChangeRegisterCompany}
                autoComplete="off"
                label="Razón Social"
              />
              <span style={styContToolAst}>
                <Tooltip
                  followCursor
                  title="Ingrese la Razón Social de la empresa. Ejemplo: Empresa S.A."
                  sx={{ cursor: 'pointer' }}
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <div style={styAst}>*</div>
              </span>
            </div>
            <div className="input-group">
              <FormControl fullWidth>
                <InputLabel>Pertenece a actividad Molinera</InputLabel>
                <CustomSelect
                  name="actividad_molinera"
                  value={actividad_molinera}
                  label="Pertenece a actividad Molinera"
                  onChange={OnInputChangeRegisterCompany}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  <CustomMenuItem value={true}>Si</CustomMenuItem>
                  <CustomMenuItem value={false}>No</CustomMenuItem>
                </CustomSelect>
              </FormControl>
              <span style={styContToolAst}>
                <Tooltip
                  followCursor
                  title="Seleccione un valor"
                  sx={{ cursor: 'pointer' }}
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <div style={styAst}>*</div>
              </span>
            </div>
            <div className="input-group">
              <TextField
                error={errorEmail}
                type="email"
                id="email_first"
                name="email_first"
                value={email_first}
                onChange={OnInputChangeRegisterCompany}
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label="E-mail principal N° 1"
              />
              <span style={styContToolAst}>
                <Tooltip
                  followCursor
                  title="Ingrese el E-mail principal de la empresa. Ejemplo: ejemplo@empresa.com"
                  sx={{ cursor: 'pointer' }}
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <div style={styAst}>*</div>
              </span>
            </div>
            <div
              style={{
                position: 'relative',
              }}
              className="input-group"
            >
              <TextField
                error={errorEmail}
                type="email"
                id="email_second"
                name="email_second"
                value={email_second}
                onChange={OnInputChangeRegisterCompany}
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label="E-mail Alternativo N° 2"
              />
              <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab
                  size="small"
                  color="primary"
                  aria-label="add"
                  style={{
                    position: 'absolute',
                    marginTop: '-48px',
                    marginLeft: '255px',
                    zIndex: '1',
                  }}
                  onClick={handleAddEmail}
                >
                  <AddIcon />
                </Fab>
              </Box>
            </div>
            {additionalEmail.map((input) => (
              <div className="input-group" key={input.id}>
                <TextField
                  type="email"
                  id={String(input.id)}
                  name={`additionalEmail_${input.id}`}
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
                  label="Correo Electrónico Adicional"
                  value={input.email}
                  onChange={(e) => {
                    const values = [...additionalEmail];
                    values.map((item) => {
                      if (item.id === input.id) {
                        item.email = e.target.value;
                      }
                    });
                    setEmailAlternativos(values);
                  }}
                />
              </div>
            ))}
            <div className="input-group">
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={OnInputChangeRegisterCompany}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <span style={styContToolAst}>
                <Tooltip
                  followCursor
                  title="Ingrese la contraseña de la empresa. Debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial. Ejemplo: Abc12345$"
                  sx={{ cursor: 'pointer' }}
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <div style={styAst}>*</div>
              </span>
            </div>
            <div className="input-group">
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Repetir Contraseña
                </InputLabel>
                <OutlinedInput
                  type={showPasswordRepeat ? 'text' : 'password'}
                  name="repeatPassword"
                  value={repeatPassword}
                  onChange={OnInputChangeRegisterCompany}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordRepeat}
                        onMouseDown={handleMouseDownPasswordRepeat}
                        edge="end"
                      >
                        {showPasswordRepeat ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <span
                style={{
                  position: 'absolute',
                  marginTop: '18px',
                  marginLeft: '515px',
                  fontSize: '20px',
                  color: 'rgb(255, 0, 0)',
                }}
              >
                *
              </span>
            </div>
            <div className="input-group">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: '20%',
                  }}
                >
                  <TextField
                    error={errorPrefijoFirst}
                    type="number"
                    name="prefijo_first"
                    value={prefijo_first}
                    onChange={OnInputChangeRegisterCompany}
                    autoComplete="off"
                    label="Prefijo"
                  />
                </div>
                <span
                  style={{
                    position: 'absolute',
                    marginTop: '18px',
                    marginLeft: '515px',
                    fontSize: '20px',
                    color: 'rgb(255, 0, 0)',
                  }}
                >
                  *
                </span>
                <div
                  style={{
                    width: '80%',
                  }}
                >
                  <TextField
                    error={errorPhoneFirst}
                    type="number"
                    name="phone_first"
                    value={phone_first}
                    onChange={OnInputChangeRegisterCompany}
                    autoComplete="off"
                    label="Teléfono principal N° 1"
                    sx={{
                      width: '100%',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: '20%',
                  }}
                >
                  <TextField
                    error={errorPrefijoSecond}
                    type="number"
                    name="prefijo_second"
                    value={prefijo_second}
                    onChange={OnInputChangeRegisterCompany}
                    autoComplete="off"
                    label="Prefijo"
                  />
                </div>
                <div
                  style={{
                    width: '80%',
                  }}
                >
                  <TextField
                    error={errorPhoneSecond}
                    type="phone"
                    name="phone_second"
                    value={phone_second}
                    onChange={OnInputChangeRegisterCompany}
                    autoComplete="off"
                    label="Teléfono Alternativo N° 1"
                    sx={{
                      width: '100%',
                    }}
                  />
                  <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab
                      size="small"
                      color="primary"
                      aria-label="add"
                      style={{
                        position: 'absolute',
                        marginTop: '-48px',
                        marginLeft: '205px',
                        zIndex: '1',
                      }}
                      onClick={handleAddPhone}
                    >
                      <AddIcon />
                    </Fab>
                  </Box>
                </div>
              </div>
            </div>
            {additionalPhone.map((input) => (
              <div className="input-group" key={input.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '20%',
                    }}
                  >
                    <TextField
                      type="number"
                      name={`prefijoAdditional_${input.id}`}
                      value={input.prefijo}
                      onChange={(e) => {
                        const values = [...additionalPhone];
                        values.map((item) => {
                          if (item.id === input.id) {
                            item.prefijo = e.target.value;
                          }
                        });
                        setPhoneAlternativos(values);
                      }}
                      autoComplete="off"
                      label="Prefijo"
                    />
                  </div>

                  <div
                    style={{
                      width: '80%',
                    }}
                  >
                    <TextField
                      type="number"
                      name={`phoneAdditional_${input.id}`}
                      value={input.nro}
                      onChange={(e) => {
                        const values = [...additionalPhone];
                        values.map((item) => {
                          if (item.id === input.id) {
                            item.nro = e.target.value;
                          }
                        });
                        setPhoneAlternativos(values);
                      }}
                      autoComplete="off"
                      label="Teléfono Alternativo"
                      sx={{
                        width: '100%',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="input-group">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: '20%',
                  }}
                >
                  <TextField
                    error={errorWhatsappPrefijo}
                    type="number"
                    name="whatsapp_prefijo"
                    value={whatsapp_prefijo}
                    onChange={OnInputChangeRegisterCompany}
                    autoComplete="off"
                    label="Prefijo"
                  />
                </div>
                <div
                  style={{
                    width: '80%',
                  }}
                >
                  <TextField
                    error={errorWhatsapp}
                    type="number"
                    name="whatsapp"
                    value={whatsapp}
                    onChange={OnInputChangeRegisterCompany}
                    autoComplete="off"
                    label="Whatsapp"
                    sx={{
                      width: '100%',
                    }}
                  />
                </div>
                <span style={styContToolAst}>
                  <Tooltip
                    followCursor
                    title="Ingrese el CUIT sin guiones ni espacios. Ejemplo: 30715478567"
                    sx={{ cursor: 'pointer' }}
                  >
                    <IconButton>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                  <div style={styAst}>*</div>
                </span>
              </div>
            </div>
            <p
              style={{
                marginTop: '20px',
                marginBottom: '15px',
                color: '#18365D',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Domicilios declarados: (Para completar el registro, deberá agregar
              por lo menos el Domicilio Fiscal)
            </p>
            <GrillaEmpresaDomicilio
              idEmpresa="PC"
              rows={rows}
              setRows={setRows}
            />
            <Grid item xs={12}>
              <div className="box">
                <Button
                  //className="btn_ingresar"
                  variant="contained"
                  type="submit"
                  sx={{
                    width: 'auto',
                    marginTop: '20px',
                    padding: '15px',
                  }}
                >
                  REGISTRARSE
                </Button>
              </div>
            </Grid>
          </div>
        </form>
      </div>
    </main>
  );
};

const styContToolAst = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  position: 'absolute',
  marginLeft: '500px',
  fontSize: '20px',
};

const styAst = {
  marginTop: '10px',
  color: 'rgb(255, 0, 0)',
};
