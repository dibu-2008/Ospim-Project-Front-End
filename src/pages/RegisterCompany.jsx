import { useEffect, useState } from "react";
import axios from "axios";
import { InputComponent } from "../components/InputComponent";
import { ButtonComponent } from "../components/ButtonComponent";
import { AddressTable } from "../components/AddressTable";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useFormRegisterCompany } from "../hooks/useFormRegisterCompany";
import { SelectComponent } from "../components/SelectComponent";

export const RegisterCompany = () => {

  const [tableCompany, setTableCompany] = useState([]);

  const {
    cuit, razonSocial, email,
    password, repeatPassword, phone,
    whatsapp, ramos,
    OnInputChangeRegisterCompany,
    OnResetFormRegisterCompany
  } = useFormRegisterCompany({
    cuit: '',
    razonSocial: '',
    email: '',
    password: '',
    repeatPassword: '',
    phone: '',
    whatsapp: '',
    ramos: '',
  })


  const getAllCompanies = async () => {
    try {
      const url = 'http://localhost:3000/empresas';
      const response = await axios.get(url);
      setTableCompany(response.data);
    } catch (error) {
      console.error("Error en la obtencion de las empresas: " + error);
    }
  }

  useEffect(() => {
    //getAllCompanies();
  }, [])


  const OnSubmitRegisterCompany = async (e) => {
    e.preventDefault()

    console.log(cuit, razonSocial, email, password, repeatPassword, phone, whatsapp, ramos);

    // Peticion post a http://localhost:8400/empresas
    try {

      const url = 'http://localhost:3000/empresas';
      const response = await axios.post(url, {
        cuit,
        razonSocial,
        email,
        password,
        repeatPassword,
        phone,
        whatsapp,
        ramos,
      });

      if (response.status === 201) {
        alert('Empresa registrada con exito')
      }

    } catch (error) {
      console.error("Error en el registro de la empresa: " + error);
    }

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

  const onInputChangeRegisterCompany_2 = (e) => {
    console.log(e.target.value);
  }

  return (
    <main>
      <div className="container_dashboard_register_company">
        <form
          onSubmit={OnSubmitRegisterCompany}
          className="form_register_company">
          <h1>Bienvenidos a OSPIM</h1>
          <h3>Formulario de registro</h3>
          <div className="input-group">
            <InputComponent
              type="text"
              name="cuit" // provisorio
              id="ciut" // provisorio
              value={cuit} // provisorio
              onChange={OnInputChangeRegisterCompany} // provisorio
              autoComplete="off" // provisorio
              variant="filled"
              label="CUIT"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="text"
              name="razonSocial"
              id="razonSocial"
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
              name="email"
              value={email}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="E-mail"
            />
          </div>
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
              name="phone"
              value={phone}
              onChange={OnInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Teléfono principal"
            />
          </div>
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
              value=""
              onChange={onInputChangeRegisterCompany_2}
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
          <AddressTable
            tableCompany={tableCompany}
          />
        </form>
      </div>
    </main>
  )
}
