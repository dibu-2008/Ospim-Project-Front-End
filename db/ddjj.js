module.exports = (req, res, next) => {
  console.log("Middleware - DDJJ - INIT..");

  function getAPI() {
    if (
      req.method === "GET" &&
      req.url.startsWith("/DDJJConsulta?") &&
      req.query.empresaId &&
      req.query.periodo
    ) {
      return "DDJJ-PERIODO-VALIDAR";
    }
    return "";
  }

  console.log("Middleware - DDJJ - getAPI: " + getAPI());

  switch (getAPI()) {
    case "DDJJ-PERIODO-VALIDAR":
      validarPeriodo();
      break;
    case "":
      // code block
      next();
      break;
    default:
    // code block
  }

  function validarPeriodo() {
    var ddjj = req.app.db.__wrapped__.DDJJConsulta;
    //console.log("Middleware - DDJJ - empresaId: " + empresaId);
    //console.log("Middleware - DDJJ - periodo: " + periodo);
    //periodo = new Date(periodo + "T00:00:00Z");

    var empresaId = req.query.empresaId;
    var periodo = new Date(
      req.query.periodo.substring(0, 4),
      req.query.periodo.substring(4, 6) - 1,
      "01"
    );

    const reg = ddjj.find((element) => {
      const fecha = new Date(
        element.periodo.substring(0, 4),
        element.periodo.substring(5, 7) - 1,
        "01"
      );

      return (
        element.empresaId == empresaId && fecha.getTime() === periodo.getTime()
      );
    });

    if (reg) {
      //console.log("Middleware - DDJJ - reg: " + reg);
      res.status(200).send({ resultado: true });
    } else {
      res.status(200).send({ resultado: false });
    }
  }
};
