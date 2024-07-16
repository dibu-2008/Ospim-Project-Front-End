import { axiosDDJJ } from '../ddjj/alta/DDJJAltaApi';
import { DDJJMapper } from './DDJJMapper';

//rowsValidaciones, setRowsValidaciones;
//const [rowsValidaciones, setRowsValidaciones] = useState([]); //Usado para "Pintar" errores en la grilla.-

const addValidaciones = (errores) => {
  const newRowsValidaciones = { ...useGridValidaciones.getRowsValidaciones };
  //console.log('newRowsValidaciones: ', newRowsValidaciones);
  errores.map((item) => {
    newRowsValidaciones.errores.push(item);
  });
  //console.log('newRowsValidaciones: ', rowsValidaciones);
  useGridValidaciones.setRowsValidaciones(newRowsValidaciones);
};
const deleteValidacionesCuil = (cuil) => {
  console.log('deleteValidacionesCuil - cuil', cuil);
  const newRowsValidaciones = { ...useGridValidaciones.getRowsValidaciones };
  console.log(
    'deleteValidacionesCuil - newRowsValidaciones1:',
    newRowsValidaciones,
  );
  newRowsValidaciones.errores = newRowsValidaciones.errores.filter((item) => {
    if (item.cuil !== cuil) {
      return item;
    }
  });
  console.log(
    'deleteValidacionesCuil - newRowsValidaciones2:',
    newRowsValidaciones,
  );
  useGridValidaciones.setRowsValidaciones(newRowsValidaciones);
};

const validarDDJJ = async (cabecera, rows) => {
  //Armar vector "RowsValidaciones" con los errores de CUIL y de Atributos del CUIL
  console.log('validarDDJJ - rows:', rows);
  console.log('validarDDJJ - typeof rows: ', typeof rows);
  const DDJJ = DDJJMapper.rowsToDDJJValDto(cabecera, rows);
  const newRowsValidaciones = await axiosDDJJ.validar(cabecera.empresaId, DDJJ); //errores de "Atributos del CUIL"
  const CuilesValidaciones = await validarDDJJCuiles(DDJJ); //errores de "CUIL"
  console.log('validarDDJJ - newRowsValidaciones: ', newRowsValidaciones);
  //Unifico Errores
  CuilesValidaciones.forEach((element) => {
    if (!element.cuilValido) {
      if (newRowsValidaciones && newRowsValidaciones.errores)
        newRowsValidaciones.errores.push({
          cuil: element.cuil.toString(),
          codigo: 'cuil',
          descripcion: 'CUIL INVALIDO',
          indice: null,
        });
    }
  });

  //Actualizo estado para "Pintar" la grilla donde hay error
  useGridValidaciones.setRowsValidaciones(newRowsValidaciones);

  //Agrego Atributo "gErrores" para "Filtrado de Grilla"
  console.log('validarDDJJ - rows: ', rows);
  const newRows = rows.slice();
  console.log('validarDDJJ - newRows: ', newRows);
  console.log('validarDDJJ - typeof newRows: ', typeof newRows);
  newRows.map((regCuil) => {
    //console.log('validarDDJJGrillaErroresRefresh - updateRows - gridData.forEach - row:',row);
    newRowsValidaciones.errores.forEach((regVal) => {
      if (regVal.cuil == regCuil.cuil) {
        //pongo en true el row
        regCuil.gErrores = true;
      }
    });
  });

  //retorno "rows" para cargar Grilla
  return newRows;
};

const validarDDJJCuiles = async (DDJJ) => {
  const cuiles = [];
  DDJJ.afiliados.map(function (item) {
    cuiles.push(item.cuil);
  });

  const cuilesString = cuiles.map((item) => item?.toString());
  const cuilesResponse = await axiosDDJJ.validarCuiles(
    DDJJ.empresaId,
    cuilesString,
  );

  return cuilesResponse;
};

export const useGridValidaciones = {
  getRowsValidaciones: null,
  setRowsValidaciones: null,
  add: addValidaciones,
  remove: deleteValidacionesCuil,
  validarDDJJ: validarDDJJ,
};
