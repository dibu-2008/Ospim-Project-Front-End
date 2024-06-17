import dayjs from 'dayjs';

const formatCurrency = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 2,
  useGrouping: true,
});

const currencyString = (value) => {
  try {
    if ((value = 0)) {
      console.log('formateando cero !!! ');
      console.log('formateando cero !!! ');
    }
    if (value && value !== '' && value !== null) {
      return formatCurrency.format(value);
    }
    console.log('currencyString - return VACIO !! value:', value);
    return '';
  } catch (error) {
    console.log('currencyString - error: ', error);
    return '';
  }
};

const formatDate = (value) => {
  //castea "YYYY-MM-DD" => "DD/MM/YYYY"
  try {
    let strFecha = '';
    if (value) {
      strFecha = new dayjs(value).format('DD/MM/YYYY');
    }
    return strFecha;
  } catch (error) {
    console.log('formatDate - error: ', error);
    return '';
  }
};

const dateObject = (strValue) => {
  //castea "YYYY-MM-DD" => Date object
  try {
    if (strValue && strValue !== '' && strValue !== null)
      return new dayjs(strValue);
    return null;
  } catch (error) {
    console.log('castDateString - error:', error);
    return null;
  }
};

const dateString = (strValue) => {
  //castea "YYYY-MM-DD" => "DD/MM/YYYY"
  try {
    if (strValue) {
      if (dayjs.isDayjs(strValue)) return strValue.format('DD/MM/YYYY');

      return new dayjs(strValue).format('DD/MM/YYYY');
    }
    return null;
  } catch (error) {
    console.log('castDateString - error:', error);
    return null;
  }
};

const periodoString = (strValue) => {
  //castea "YYYY-MM-DD" => "MM/YYYY"
  try {
    if (strValue) {
      return new dayjs(strValue).format('MM/YYYY');
    }
    return '';
  } catch (error) {
    console.log('periodoStr - error:', error);
    return '';
  }
};

const periodoISOString = (strValue) => {
  //castea "YYYY-MM-DD" => "YYYY-MM"
  try {
    if (strValue) {
      return new dayjs(strValue).format('YYYY-MM');
    }
    return '';
  } catch (error) {
    console.log('periodoStr - error:', error);
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

const formatFechaGrilla = (value) => {
  try {
    return new Date(value).toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

const sumaTresHoras = (value) => {
  //const fecha = value;
  const fecha = new Date(value.toISOString().split('T')[0]);
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
  dateObject: dateObject,
  dateString: dateString,
  periodoString: periodoString,
  periodoISOString: periodoISOString,
  currencyString: currencyString,

  date: formatDate,
  periodo: formatPeriodo,
  fechaGrilla: formatFechaGrilla,
  toFechaValida,
};

export default formatter;
