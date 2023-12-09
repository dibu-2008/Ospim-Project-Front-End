import { useEffect, useState } from "react";
import axios from "axios";
import { InputComponent } from "../components/InputComponent";
import { ButtonComponent } from "../components/ButtonComponent";
import TextField from '@mui/material/TextField';
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useFormRegisterCompany } from "../hooks/useFormRegisterCompany";
import { SelectComponent } from "../components/SelectComponent";
import { AddressTable } from "../components/AddressTable";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const RegisterCompany = () => {

  const [search, setSearch] = useState('');
  const [companiesDto, setCompaniesDto] = useState({});
  const [additionalEmail, setAddionalEmail] = useState([]);
  const [emailAlternativos, setEmailAlternativos] = useState([]);
  const [additionalPhone, setAdditionalPhone] = useState([]);
  const [phoneAlternativos, setPhoneAlternativos] = useState([]);
  const [idPhoneAlternativos, setIdPhoneAlternativos] = useState(2);
  const [idEmailAlternativos, setIdEmailAlternativos] = useState(2);

  const [rows, setRows] = useState([]); 

  const {
    cuit, razonSocial, email_first, email_second,
    password, repeatPassword, prefijo_first, phone_first,
    prefijo_second, phone_second,
    whatsapp, whatsapp_prefijo, ramo,
    OnInputChangeRegisterCompany,
    OnResetFormRegisterCompany
  } = useFormRegisterCompany({
    cuit: '',
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
    ramo: '',
  })

  const OnSubmitRegisterCompany = async (e) => {
    e.preventDefault()

    const usuarioEmpresa = {
      razonsocial: razonSocial,
      cuit: cuit,
      clave: password,
      email: email_first,
      telefono: phone_first,
      telefono_prefijo: prefijo_first,
      whatsapp: whatsapp,
      whatsapp_prefijo: whatsapp_prefijo,
      ramo: ramo,
      telefonosAlternativos: [
        {
          prefijo: prefijo_second,
          nro: phone_second,
          //id: 1
        },
        ...phoneAlternativos.map((phone) => ({
          prefijo: phone.prefijo,
          nro: phone.nro,
          //id: phone.id
        }))
      ],
      emailAlternativos: [
        {
          email: email_second,
          //id: 1
        },
        ...emailAlternativos.map((email) => ({
          email: email.email,
          //id: email.id
        }))
      ],
      domicilios: rows.map((row) => ({
        tipo: row.tipo,
        provincia: row.provincia,
        localidad: row.localidad,
        calle: row.calle,
        piso: row.piso,
        depto: row.depto,
        oficina: row.oficina,
        cp: row.cp,
        planta: row.planta,
      }))
    }

    try {
      await axios.post(`${backendUrl}/usuario/empresa`, usuarioEmpresa);
    }catch(error){
      console.log(error);
    }

    //setCompaniesDto(usuarioEmpresa);

    // Limpiar y ocultar los inputs de email y telefonos alternativos
    setAddionalEmail([]);
    setEmailAlternativos([]);
    setAdditionalPhone([]);
    setRows([]);

    OnResetFormRegisterCompany()
  }

  const OnChangeRamos = (e) => {
    OnInputChangeRegisterCompany({
      target: {
        name: 'ramos',
        value: e.target.value
      }
    })
  }

  const onInputChangeSearchCompany = ({ target }) => {

    const { name, value } = target;

    setSearch(value);

  }

  const handleAddEmail = () => {

    setIdEmailAlternativos(idEmailAlternativos + 1);

    const values = [...additionalEmail];
    const newEmail = {
      email: "",
      id: idEmailAlternativos
    };
    values.push(newEmail);
    setEmailAlternativos([...emailAlternativos, newEmail])
    setAddionalEmail(values);

  }

  const handleAddPhone = () => {

    setIdPhoneAlternativos(idPhoneAlternativos + 1);

    const values = [...additionalPhone];
    const newPhone = {
      prefijo: "",
      nro: "",
      id: idPhoneAlternativos
    };
    values.push(newPhone);
    setPhoneAlternativos([...phoneAlternativos, newPhone])
    setAdditionalPhone(values);
  }

  return (
    <main>
      <div className="container_dashboard_register_company">
        <form
          sx={{
            backgroundColor: '#000',
          }}
          onSubmit={OnSubmitRegisterCompany}
          className="form_register_company">
          <h1>Bienvenidos a OSPIM</h1>
          <h3
            style={{
              marginBottom: '60px',
            }}
          >Formulario de registro</h3>
          <div className="input-group">
            <TextField
              type="text"
              name="cuit"
              value={cuit}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              label="CUIT"
            />
          </div>
          <div className="input-group">
            <TextField
              type="text"
              name="razonSocial"
              value={razonSocial}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              label="Razón Social"
            />
          </div>
          <div className="input-group">
            <TextField
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
          </div>
          <div
            style={{
              position: 'relative',
            }}
            className="input-group">
            <TextField
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
                color="primary" aria-label="add"
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
          {
            additionalEmail.map((input) => (
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
            ))
          }
          <div className="input-group">
            <InputComponent
              type="password"
              name="password"
              value={password}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Contraseña"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="password"
              name="repeatPassword"
              value={repeatPassword}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Repetir Contraseña"
            />
          </div>
          <div className="input-group">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div style={{
                width: '20%',
              }}>
                <TextField
                  type="number"
                  name="prefijo_first"
                  value={prefijo_first}
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
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div style={{
                width: '20%',
              }}>
                <TextField
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
                    color="primary" aria-label="add"
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
          {
            additionalPhone.map((input) => (
              <div className="input-group" key={input.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{
                    width: '20%',
                  }}>

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
            ))
          }
          <div className="input-group">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div style={{
                width: '20%',
              }}>
                <InputComponent
                  type="number"
                  name="whatsapp_prefijo"
                  value={whatsapp_prefijo}
                  onChange={OnInputChangeRegisterCompany}
                  autoComplete="off"
                  variant="filled"
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
            </div>

          </div>
          <div className="input-group">
            <SelectComponent
              name="ramo"
              value={ramo}
              onChange={OnChangeRamos}
              label="Ramo"
              options={[
                { value: "Ramo A", label: "Ramo A" },
                { value: "Ramo B", label: "Ramo B" },
                { value: "Ramo C", label: "Ramo C" },
              ]}
            />
          </div>
          <div
            className="input-group"
            style={{
              position: "relative",
            }}
          ></div>
          {/* <div
            className="flex-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBlock: "30px",
            }}
          >
            <TextField
              type="search"
              name="search"
              value={search}
              onChange={onInputChangeSearchCompany}
              autoComplete="off"
              variant="outlined"
              label="Buscar"
              sx={{
                width: "150px",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            /> 
          </div> */}
          <p
            style={{
              marginTop: "20px",
              marginBottom: "15px",
              color: "#18365D",
              display: "flex",
              alignItems: "center",
            }}
          >
            Domicilios declarados: (Para completar el registro, deberá agregar
            por lo menos el Domicilio Fiscal)
          </p>
          <AddressTable
            companiesDto={companiesDto}
            rows={rows}
            setRows={setRows}
          />
          <ButtonComponent
              styles={{
                width: "auto",
                marginTop: "20px",
                padding: "15px",
              }}
              className="btn_ingresar"
              name="REGISTRAR EMPRESA"
            ></ButtonComponent>
        </form>
      </div>
    </main>
  )
}

