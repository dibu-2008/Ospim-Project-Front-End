import { axiosDDJJ } from './DDJJApi';
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
  //1) Armar vector "RowsValidaciones" con los errores de CUIL y de Atributos del CUIL
  //y actualiza el useState.-

  //console.log('validarDDJJ - rows:', rows);
  //console.log('validarDDJJ - typeof rows: ', typeof rows);
  const newRowsValidaciones = await getValidacionesBackend(cabecera, rows);
  //console.log('validarDDJJ - newRowsValidaciones: ', newRowsValidaciones);

  //Actualizo estado para "Pintar" la grilla donde hay error
  useGridValidaciones.setRowsValidaciones(newRowsValidaciones);
  return newRowsValidaciones;
};

const actualizarFiltroErrores = (rows, newRowsValidaciones) => {
  //Agrego Atributo "gErrores" para "Filtrado de Grilla"

  console.log('actualizarFiltroErrores - rows: ', rows);
  console.log(
    'actualizarFiltroErrores - newRowsValidaciones: ',
    newRowsValidaciones,
  );
  const newRows = rows.slice();
  //console.log('actualizarFiltroErrores - newRows: ', newRows);
  //console.log('actualizarFiltroErrores - typeof newRows: ', typeof newRows);
  newRows.map((regCuil) => {
    //console.log('validarDDJJGrillaErroresRefresh - updateRows - gridData.forEach - row:',row);
    regCuil.gErrores = false;
    newRowsValidaciones.errores.forEach((regVal) => {
      if (regVal.cuil == regCuil.cuil) {
        //pongo en true el row
        regCuil.gErrores = true;
      }
    });
  });
  //console.log('actualizarFiltroErrores - newRows: ', newRows);
  return newRows;
};

const getValidacionesBackend = async (cabecera, rows) => {
  const DDJJ = DDJJMapper.rowsToDDJJValDto(cabecera, rows);
  const newRowsValidaciones = await axiosDDJJ.validar(cabecera.empresaId, DDJJ); //errores de "Atributos del CUIL"
  const CuilesValidaciones = await validarDDJJCuiles(DDJJ); //errores de "CUIL"
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
  return newRowsValidaciones;
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

const tieneErrores = () => {
  if (
    useGridValidaciones.getRowsValidaciones &&
    useGridValidaciones.getRowsValidaciones.errores.length > 0
  ) {
    return true;
  }
  return false;
};
export const useGridValidaciones = {
  getRowsValidaciones: null,
  setRowsValidaciones: null,
  add: addValidaciones,
  remove: deleteValidacionesCuil,
  validarDDJJ: validarDDJJ,
  actualizarFiltroErrores: actualizarFiltroErrores,
  tieneErrores: tieneErrores,
};
