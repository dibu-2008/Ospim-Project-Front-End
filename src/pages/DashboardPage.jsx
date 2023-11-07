import { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

const DashboardPage = () => {

  const [ramosVisible, setRamosVisible] = useState(true);

  const toggleRamosVisibility = () => {
    setRamosVisible(!ramosVisible);
  };

  return (
    <main>
      <div className="container_dashboard_register_company">
        <h1
          style={{
            marginBottom: '5px'
          }}
        >Bienvenidos a OSPIM</h1>
        <form className="form_register_company">
          <h2
            style={{
              marginBottom: '10px'
            }}
          >Formulario de registro</h2>
          <div className="input-group">
            <input
              type="text"
              name="cuit"
              placeholder="CUIT"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="razonSocial"
              placeholder="Razon Social"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico principal"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Repetir contraseña"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <input
              type="phone"
              name="phone"
              placeholder="Teléfono principal"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <input
              type="phone"
              name="phone"
              placeholder="WhatsApp"
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <div className="probando">
              <div className="input">
                Seleccione un ramo
              </div>
              <span
                onClick={toggleRamosVisibility}
              >
                <TiArrowSortedDown />
              </span>
            </div>
            <div className="select-content">
              <div className={ramosVisible ? 'ramos' : 'ramos_visible'}>
                <ul>
                  <li>Primer ramo</li>
                  <li>Segundo ramo</li>
                  <li>Tercer ramo</li>
                </ul>
              </div>
            </div>
          </div>
          <p style={{
            marginTop: '5px',
            width: '480px',
            color: '#18365D',
          }}>Domicilios declarados: (Para completar el registro, deberá agregar por lo menos el Domicilio Fiscal)</p>
          <button
            style={{ 
              marginTop: '30px', 
              width: '460px'
            }}
            className="btn_ingresar">AGREGAR</button>
        </form>
      </div>
    </main>
  );
};

export default DashboardPage;
