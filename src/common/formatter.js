const formatCurrency = new Intl.NumberFormat("es-CL", {
  minimumFractionDigits: 2,
  useGrouping: true,
});
/* //Sacamos el $
    currency: "CLP",
    style: "currency",
*/

const formatDate = (value) => {
  const date = new Date(value);

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

const formatter = {
  currency: formatCurrency,
  date: formatDate,
};

export default formatter;
