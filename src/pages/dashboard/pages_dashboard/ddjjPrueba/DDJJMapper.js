import formatter from '@/common/formatter';

const getDDJJDtoCabecera = (cabecera) => {
  const DDJJ = {
    empresaId: cabecera.empresaId,
    id: cabecera.id,
    afiliados: [],
  };

  if (cabecera.periodo) {
    DDJJ.periodo = formatter.dateToStringBackend(cabecera.periodo);
  }

  return DDJJ;
};
const castRowToBackendDto = (item) => {
  const registroNew = {
    //errores: item.gErrores,
    cuil: !item.cuil ? null : item.cuil,
    //inte: item.inte,
    apellido: !item.apellido ? null : item.apellido,
    nombre: !item.nombre ? null : item.nombre,
    fechaIngreso: !item.fechaIngreso ? null : item.fechaIngreso,
    empresaDomicilioId: !item.empresaDomicilioId
      ? null
      : item.empresaDomicilioId,
    camara: !item.camara ? null : item.camara,
    categoria: !item.categoria ? null : item.categoria,
    remunerativo: !item.remunerativo
      ? null
      : parseFloat(String(item.remunerativo).replace(',', '.')),
    noRemunerativo: !item.noRemunerativo
      ? null
      : parseFloat(String(item.noRemunerativo).replace(',', '.')),
    uomaSocio: item.uomaSocio === '' ? null : item.uomaSocio,
    amtimaSocio: item.amtimaSocio === '' ? null : item.amtimaSocio,
  };
  if (item.id) registroNew.id = item.id;
  if (item.regId) registroNew.id = item.regId;

  return registroNew;
};

const regToDDJJValDto = (cabecera, row) => {
  const DDJJ = getDDJJDtoCabecera(cabecera);
  const DDJJAfiliadoDto = castRowToBackendDto(row);
  DDJJ.afiliados.push(DDJJAfiliadoDto);
  return DDJJ;
};

const rowsToDDJJValDto = (cabecera, rows) => {
  const DDJJ = getDDJJDtoCabecera(cabecera);
  //console.log('rowsToDDJJValDto - rows:', rows);
  rows.map(function (item) {
    const registroNew = castRowToBackendDto(item);
    DDJJ.afiliados.push(registroNew);
  });

  return DDJJ;
};

export const DDJJMapper = {
  regToDDJJValDto: function (cabecera, row) {
    return regToDDJJValDto(cabecera, row);
  },
  rowsToDDJJValDto: function (cabecera, rows) {
    return rowsToDDJJValDto(cabecera, rows);
  },
};
