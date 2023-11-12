import { useState } from "react";
import { InputComponent } from "../components/InputComponent";
import { ButtonComponent } from "../components/ButtonComponent";

const DashboardPage = () => {
  const onInputChangeRegisterCompany = () => {
    console.log("sfsdfd");
  };

  return (
    <main>
      <div className="container_dashboard_register_company">
        <form className="form_register_company">
          <h1>Bienvenidos a OSPIM</h1>
          <h3>Formulario de registro</h3>
          <div className="input-group">
            <InputComponent
              type="text"
              name="cuit" // provisorio
              id="ciut" // provisorio
              value="" // provisorio
              onChange={onInputChangeRegisterCompany} // provisorio
              autoComplete="off" // provisorio
              variant="filled"
              label="CIUT"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="text"
              name="razonSocial"
              id="razonSocial"
              value=""
              onChange={onInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Razón Social"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="email"
              name="email"
              value=""
              onChange={onInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="E-mail"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="password"
              name="password"
              value=""
              onChange={onInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Contraseña"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="password"
              name="password"
              value=""
              onChange={onInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Repetir Contraseña"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="phone"
              name="phone"
              value=""
              onChange={onInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="Teléfono principal"
            />
          </div>
          <div className="input-group">
            <InputComponent
              type="phone"
              name="phone"
              value=""
              onChange={onInputChangeRegisterCompany}
              autoComplete="off"
              variant="filled"
              label="WhatsApp"
            />
          </div>
          <div
            className="input-group"
            style={{
              position: "relative",
            }}
          ></div>
          <p
            style={{
              marginTop: "5px",
              width: "500px",
              color: "#18365D",
            }}
          >
            Domicilios declarados: (Para completar el registro, deberá agregar
            por lo menos el Domicilio Fiscal)
          </p>
          <ButtonComponent
            styles={{
              marginTop: "30px",
              width: "500px",
              marginBottom: "30px",
            }}
            className="btn_ingresar"
            name="AGREGAR"
          ></ButtonComponent>
        </form>
      </div>
    </main>
  );
};

export default DashboardPage;
