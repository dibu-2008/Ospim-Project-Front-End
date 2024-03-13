const formatCurrency = new Intl.NumberFormat("es-CL", {
  minimumFractionDigits: 2,
  useGrouping: true,
});
/* //Sacamos el $
    currency: "CLP",
    style: "currency",
*/

const formatDate = (value) => {
  try {
    const date = new Date(value);

    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return "";
  }
};

const formatPeriodo = (value, separador) => {
  try {
    if (!separador) {
      separador = "/";
    }
    const date = new Date(value);

    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${month}${separador}${year}`;
  } catch (error) {
    return "";
  }
};

const formatter = {
  currency: formatCurrency,
  date: formatDate,
  periodo: formatPeriodo,
};

export default formatter;
