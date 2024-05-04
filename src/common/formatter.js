const formatCurrency = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 2,
  useGrouping: true,
});
/* //Sacamos el $
    currency: "CLP",
    style: "currency",
*/

const formatDate = (value) => {
  try {
    let strFecha = '';
    if (value) {
      const date = new Date(value);

      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = date.getUTCFullYear();
      strFecha = `${day}/${month}/${year}`;
    }
    return strFecha;
  } catch (error) {
    console.log(error);
    return '';
  }
};

const formatPeriodo = (value, separador) => {
  try {
    if (!separador) {
      separador = '/';
    }
    const date = new Date(value);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}${separador}${year}`;
  } catch (error) {
    return '';
  }
};

const formatPeriodo2 = (value) => {
  try {
    const date = new Date(value);

    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const day = date.getUTCDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    return '';
  }
};

const formatFechaGrilla = (value) => {
  try {
    return new Date(value).toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

const sumaTresHoras = (value) => {
  const fecha = value;
  const nuevaFecha = new Date(fecha.getTime() + 3 * 60 * 60 * 1000);
  return nuevaFecha;
};

const esFechaValida = (fechaString) => {
  let fecha = new Date(fechaString);
  return !isNaN(fecha.getTime()) && fechaString === fecha.toISOString();
};

const toFechaValida = (value) => {
  if (value) {
    if (esFechaValida(value)) {
      return sumaTresHoras(new Date(value)).toISOString();
    } else if (value.length === 10) {
      return sumaTresHoras(new Date(value)).toISOString();
    } else {
      return sumaTresHoras(new Date(`${value}-01`)).toISOString();
    }
  }
  return undefined;
};

const formatter = {
  currency: formatCurrency,
  date: formatDate,
  periodo: formatPeriodo,
  periodo2: formatPeriodo2,
  fechaGrilla: formatFechaGrilla,
  toFechaValida,
};

export default formatter;
