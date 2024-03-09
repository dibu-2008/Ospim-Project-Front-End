const formatCurrency = new Intl.NumberFormat("es-CL", {
  minimumFractionDigits: 2,
  useGrouping: true,
});
/* //Sacamos el $
    currency: "CLP",
    style: "currency",
*/

const formatter = {
  currency: formatCurrency,
};

export default formatter;
