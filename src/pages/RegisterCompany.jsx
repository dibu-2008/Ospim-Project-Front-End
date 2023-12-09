import { useEffect, useState } from "react";
import axios from "axios";
import { InputComponent } from "../components/InputComponent";
import { ButtonComponent } from "../components/ButtonComponent";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useFormRegisterCompany } from "../hooks/useFormRegisterCompany";
import { SelectComponent } from "../components/SelectComponent";
import { AddressTable } from "../components/AddressTable";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';


export const RegisterCompany = () => {

  const [search, setSearch] = useState('');
  const [companiesDto, setCompaniesDto] = useState({});
  const [additionalEmail, setAddionalEmail] = useState([]);
  const [emailAlternativos, setEmailAlternativos] = useState([]);
  const [additionalPhone, setAdditionalPhone] = useState([]);
  const [phoneAlternativos, setPhoneAlternativos] = useState([]);

  const {
    cuit, razonSocial, email_first, email_second,
    password, repeatPassword, phone_first, phone_second,
    whatsapp, ramos,
    OnInputChangeRegisterCompany,
    OnResetFormRegisterCompany
  } = useFormRegisterCompany({
    cuit: '',
    razonSocial: '',
    email_first: '',
    email_second: '',
    password: '',
    repeatPassword: '',
    phone_first: '',
    phone_second: '',
    whatsapp: '',
    ramos: '',
  })

  const OnSubmitRegisterCompany = async (e) => {
    e.preventDefault()

    const empresasDto = {
      cuit,
      razonSocial,
      email_first,
      email_second,
      emailAlternativos,
      password,
      repeatPassword,
      phone_first,
      phone_second,
      phoneAlternativos,
      whatsapp,
      ramos,
    }

    setCompaniesDto(empresasDto);

    // Limpiar y ocultar los inputs de email y telefonos alternativos
    setAddionalEmail([]);
    setEmailAlternativos([]);

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
    const values = [...additionalEmail];
    const newEmail = { email: "", id: uuidv4() };
    values.push(newEmail);
    setEmailAlternativos([...emailAlternativos, newEmail])
    setAddionalEmail(values);

  }

  const handleAddPhone = () => {
    const values = [...additionalPhone];
    const newPhone = { phone: "", id: uuidv4() };
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
          <h3>Formulario de registro</h3>
          <div className="input-group">
            <InputComponent
              type="text"
              name="cuit"
              
              value={cuit}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="CUIT"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="text"
              name="razonSocial"
              
              value={razonSocial}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Razón Social"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="email"
              name="email_first"
              value={email_first}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="E-mail principal N° 1"
            />
          </div>
          <div 
            style={{
              position: 'relative',
            }}
            className="input-group">
            <InputComponent
              type="email"
              name="email_second"
              value={email_second}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="E-mail Alternativo N° 2"
            />
            <Box sx={{'& > :not(style)': { m: 1 }}}>
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
                <InputComponent
                  type="text"
                  name={`additionalEmail_${input.id}`}
                  autoComplete="off"
                  variant="filled"
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
            <InputComponent
              type="phone"
              name="phone_first"
              value={phone_first}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Teléfono principal N° 1"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="phone"
              name="phone_second"
              value={phone_second}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Teléfono Alternativo N° 1"
            />
            <Box sx={{'& > :not(style)': { m: 1 }}}>
              <Fab
                size="small"
                color="primary" aria-label="add"
                style={{
                  position: 'absolute',
                  marginTop: '-48px',
                  marginLeft: '255px',
                  zIndex: '1',
                }} 
                onClick={handleAddPhone}
              >
                <AddIcon />
              </Fab>
            </Box>
          </div>
          {
            additionalPhone.map((input) => (
              <div className="input-group" key={input.id}>
                <InputComponent
                  type="text"
                  name={`phoneAdditional_${input.id}`}
                  autoComplete="off"
                  variant="filled"
                  label="Teléfono Adicional"
                  value={input.phone}
                  onChange={(e) => {
                    const values = [...additionalPhone];
                    values.map((item) => {
                      if (item.id === input.id) {
                        item.phone = e.target.value;
                      }
                    });
                    setPhoneAlternativos(values);
                  }}
                />
              </div>
            ))
          }
          <div className="input-group">
            <InputComponent
              type="phone"
              name="whatsapp"
              value={whatsapp}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="WhatsApp"
            />
          </div>
          <div className="input-group">
            <SelectComponent
              name="ramos"
              value={ramos}
              onChange={OnChangeRamos}
              label="Ramos"
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
          <div
            className="flex-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBlock: "30px",
            }}
          >
            <ButtonComponent
              styles={{
                width: "150px",
              }}
              className="btn_ingresar"
              name="AGREGAR"
            ></ButtonComponent>

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
          </div>
          <p
            style={{
              marginTop: "5px",
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
         />
        </form>
      </div>
    </main>
  )
}

