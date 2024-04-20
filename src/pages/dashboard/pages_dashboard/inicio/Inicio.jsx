import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import './Inicio.css';
import { CarouselText } from '../../../../components/carousel/CarouselText';
import {
  ObtenerDatosDeContacto,
  ObtenerPublicacionesVigentes,
} from './InicioApi';
import { useState, useEffect } from 'react';

export const Inicio = () => {
  const [datosContacto, setDatosContacto] = useState([]);
  const [contenido, setContenido] = useState([]);

  useEffect(() => {
    const getDatosContacto = async () => {
      const datosContacto = await ObtenerDatosDeContacto();
      setDatosContacto(datosContacto);
    };
    getDatosContacto();
  }, []);

  useEffect(() => {
    const getPublicacionesVigentes = async () => {
      const consContenidos = await ObtenerPublicacionesVigentes();
      console.log('getPublicacionesVigentes() - consContenidos');
      console.log(consContenidos);
      setContenido(consContenidos);
    };
    getPublicacionesVigentes();
  }, []);

  return (
    <div className="bienvenidos_container">
      <div className="bienvenidos">
        <h1>Bienvenidos</h1>
        <p className="parrafo_portal">
          Desde este portal, podrá generar boletas de pago para las entidades
          UOMA, OSPIM y AMTIMA
        </p>
      </div>
      <div className="contacto">
        <h2>Contacto</h2>
        <div className="contacto_child">
          <p>
            Ante cualquier inconveniente, por favor, no dude en contactarse con
            nosotros a través de los siguientes medios
          </p>

          <div className="medios">
            <div>
              <span>
                <EmailIcon />
              </span>
              {datosContacto ? datosContacto.email : ''}
            </div>
            <div>
              <span>
                <LocalPhoneIcon />
              </span>
              {datosContacto ? datosContacto.telefono : ''}
            </div>
            <div>
              <span>
                <WhatsAppIcon />
              </span>
              {datosContacto ? datosContacto.whasap : ''}
            </div>
          </div>

          <h5>Días y horarios:</h5>
          <p>Lunes a Viernes de 10 a 12 y de 14 a 17hs.</p>
        </div>
      </div>
      <div className="novedades">
        <CarouselText contenido={contenido} />
      </div>
    </div>
  );
};
