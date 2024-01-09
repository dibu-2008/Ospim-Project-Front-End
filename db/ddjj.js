module.exports = (req, res, next) => {
  console.log("Middleware - DDJJ - INIT..");

  console.log("Middleware - DDJJ - req.method: " + req.method);
  console.log("Middleware - DDJJ - req.url: " + req.url);
  console.log(
    "Middleware - DDJJ - startsWith: " + req.url.startsWith("/DDJJConsulta?")
  );

  if (req.method === "GET" && req.url.startsWith("/DDJJConsulta?")) {
    var ddjj = req.app.db.__wrapped__.DDJJConsulta;
    var empresaId = req.query.empresaId;
    var periodo = new Date(
      req.query.periodo.substring(0, 4),
      req.query.periodo.substring(4, 6) - 1,
      "01"
    );

    console.log("Middleware - DDJJ - empresaId: " + empresaId);
    console.log("Middleware - DDJJ - periodo: " + periodo);
    //periodo = new Date(periodo + "T00:00:00Z");

    if (empresaId && periodo) {
      const reg = ddjj.find((element) => {
        console.log(element.periodo);
        /*
        console.log(
          element.periodo.substring(0, 4) +
            "---" +
            element.periodo.substring(5, 7) +
            "---" +
            "01"
        );*/

        const fecha = new Date(
          element.periodo.substring(0, 4),
          element.periodo.substring(5, 7) - 1,
          "01"
        );
        //console.log("Middleware - DDJJ - ddjj.find() - periodo: " + periodo);
        console.log("Middleware - DDJJ - ddjj.find() - fecha: " + fecha);
        if (fecha.getTime() === periodo.getTime())
          console.log("periodo IGUALES");

        return (
          element.empresaId == empresaId &&
          fecha.getTime() === periodo.getTime()
        );
      });

      if (reg) {
        console.log("Middleware - DDJJ - reg: " + reg);
        res.status(200).send({ existe: true });
      } else {
        res.status(200).send({ existe: false });
      }
    }
  }

  //next();
};
