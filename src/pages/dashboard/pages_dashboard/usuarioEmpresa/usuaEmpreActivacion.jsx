import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo, useContext } from 'react';

import { axiosUsuaEmpreActivacion } from './usuaEmpreActivacionApi';

export const UsuaEmpreActivacion = () => {
  const { token } = useParams();
  const [activacion, setActivacion] = useState('');

  useEffect(() => {
    const activarToken = async () => {
      console.log(
        'xxx - activarToken - axiosUsuaEmpreActivacion.activar -  token: ',
        token,
      );
      const response = await axiosUsuaEmpreActivacion.activar(token);
      console.log('activarToken - response: ', response);

      if (response && response.usuario) {
        console.log('UsuaEmpreActivacion - ENTRO a setear setActivacion ');
        setActivacion(
          `El usuario ${response.usuario} fue activado correctamente`,
        );
      } else {
        console.log('UsuaEmpreActivacion - NO ENTRO ...');
        setActivacion(
          `El token de activacion informado ${token} es incorrecto.`,
        );
      }
    };

    activarToken();
  }, []);

  return (
    <div>
      USUARIO EMPRESA ACTIVACION - INIT - token: {token}
      <br></br>
      <br></br>
      <b>{activacion}</b>
      <br></br>
      <br></br>
      <br></br>
      <a href="http://127.0.0.1:5173/#/">Ir al liguin</a>
    </div>
  );
};
