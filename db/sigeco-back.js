module.exports = (req, res, next) => {
  console.log("Middleware - SIGECO - INIT - getAPI: " + getAPI());

  console.log("Middleware - SIGECO - req.url: " + req.method + "->" + req.url);
  //console.log("Middleware - SIGECO - req.body:" + req.body);

  function getAPI() {
    if (
      req.method === "GET" &&
      req.url.startsWith("/DDJJConsulta?") &&
      req.query.empresaId &&
      req.query.periodo
    ) {
      return "DDJJ-PERIODO-VALIDAR";
    }

    if (
      req.method === "GET" &&
      req.url === "/auth/dfa/usuario-loguedo-habilitado"
    ) {
      return "LOGIN-HABILITADO";
    }

    if (req.method === "POST" && req.url === "/auth/login-dfa") {
      return "LOGIN-DFA";
    }
    if (req.method === "POST" && req.url === "/auth/login") {
      return "LOGIN";
    }

    let pattern = /\bcategoria/;
    let result = req.url.search(pattern);
    if ((req.method === "POST" || req.method === "PUT") && result > -1) {
      return "CATEGORIAS";
    }

    if (
      req.method === "GET" &&
      req.url.startsWith("/comun/cui/") &&
      req.url.endsWith("/validar")
    ) {
      return "COMUN-CUI-VALIDAR";
    }
    ///empresa/:empresaId/domicilio/planta/
    if (
      req.method === "GET" &&
      req.url.startsWith("/empresaDomicilio/planta")
    ) {
      ///empresaDomicilio/planta?empresaId=1
      return "EMPRESA-PLANTA-CONSULTA";
    }

    if (req.method === "POST" && req.url.startsWith("/empresaDomicilio")) {
      return "EMPRESA-DOMICILIO-ALTA";
    }

    if (req.method === "POST" && req.url.startsWith("/DDJJConsulta")) {
      return "DDJJ-ALTA";
    }
    if (req.method === "PUT" && req.url.startsWith("/DDJJConsulta")) {
      return "DDJJ-MODI";
    }

    if (
      req.method === "GET" &&
      req.url.startsWith("/rol/funcionalidad/getRel")
    ) {
      return "ROL-FUNC-REL-CONS";
    }

    if (req.method === "PUT" && req.url.startsWith("/rolFuncionalidad/")) {
      return "ROL-FUNC-REL-ALTA";
    }

    if (req.method === "DELETE" && req.url.startsWith("/rolFuncionalidad/")) {
      return "ROL-FUNC-REL-BAJA";
    }

    return "----";
  }

  switch (getAPI()) {
    case "DDJJ-PERIODO-VALIDAR":
      validarPeriodo();
      break;
    case "LOGIN-HABILITADO":
      validarLoguinHabilitado();
      next();
      break;
    case "LOGIN-DFA":
      validarLoguinDFA();
      break;
    case "LOGIN":
      validarLoguin();
      break;
    case "CATEGORIAS":
      categoriasURL();
      break;
    case "COMUN-CUI-VALIDAR":
      validarCUI();
      break;
    case "EMPRESA-PLANTA-CONSULTA":
      empresaPlataConsulta();
      break;
    case "EMPRESA-DOMICILIO-ALTA":
      empresaDomicilioAlta();
      break;
    case "DDJJ-ALTA":
      DDJJSetParams();
      break;
    case "DDJJ-MODI":
      DDJJSetParams();
      break;
    case "ROL-FUNC-REL-CONS":
      RolFuncionalidadRelCons();
      break;
    case "ROL-FUNC-REL-ALTA":
      RolFuncionalidadRelAlta();
      break;
    case "ROL-FUNC-REL-BAJA":
      RolFuncionalidadRelBaja();
      break;
    case "----":
      // code block
      next();
      break;
    default:
    // code block
  }

  function RolFuncionalidadRelBaja() {
    let rolId = req.query.rolId;
    let funcCodigo = req.query.funcionalidad;
    console.log("rolId:" + rolId + " - funcCodigo:" + funcCodigo);

    let reg = { rolId: rolId, funcionalidad: funcCodigo };

    let rolFuncDB = req.app.db.__wrapped__.rolFuncionalidad;
    const lstFiltrado = rolFuncDB.filter((element) => {
      return !(
        element.rolId == reg.rolId && element.funcionalidad == reg.funcionalidad
      );
    });
    console.log(lstFiltrado);
    if (!lstFiltrado || lstFiltrado.length > 0) {
      req.app.db.__wrapped__.rolFuncionalidad = lstFiltrado;
      req.app.db.write();
    } else {
      console.log("NO SE PUEDE BOORAR lo que NO EXSISTE !...");
    }
    res.status(200).send(null);
  }

  function RolFuncionalidadRelAlta() {
    let rolId = req.query.rolId;
    let funcCodigo = req.query.funcionalidad;
    console.log("rolId:" + rolId + " - funcCodigo:" + funcCodigo);

    let reg = { rolId: rolId, funcionalidad: funcCodigo };

    let rolFuncDB = req.app.db.__wrapped__.rolFuncionalidad;
    const lstFiltrado = rolFuncDB.filter((element) => {
      return (
        element.rolId == reg.rolId && element.funcionalidad == reg.funcionalidad
      );
    });
    console.log(lstFiltrado);
    if (!lstFiltrado || lstFiltrado.length == 0) {
      rolFuncDB.push(reg);
      req.app.db.write();
    } else {
      console.log("YA EXSITE !...");
    }
    res.status(201).send(null);
  }

  function RolFuncionalidadRelCons() {
    let rolId = req.query.rolId;

    console.log("rolId: " + rolId);
    if (rolId && rolId != ":id") {
      let rolFuncDB = req.app.db.__wrapped__.rolFuncionalidad;
      //let rolFuncDB = req.app.db.get("rolFuncionalidad");
      const lstFiltrado = rolFuncDB.filter((element) => {
        return element.rolId == rolId;
      });
      if (lstFiltrado && lstFiltrado.length && lstFiltrado.length > 0) {
        res.status(200).send(lstFiltrado);
      } else {
        res.status(204).send(null);
      }
    } else {
      res.status(404).send(null);
    }
  }

  function empresaDomicilioAlta() {
    let empresaId = req.query.empresaId;
    console.log("empresaId: " + empresaId);
    if (empresaId) {
      req.body.empresaId = empresaId;
    }
    next();
  }

  function empresaPlataConsulta() {
    let empresaId = req.query.empresaId;
    if (empresaId) {
      var domicilioDB = req.app.db.__wrapped__.empresaDomicilio;
      const lstFiltrado = domicilioDB.filter((element) => {
        return element.empresaId == empresaId;
      });

      lstPlanta = lstFiltrado.map((reg) => {
        let newReg;
        newReg = { id: reg.id, planta: reg.planta };
        return newReg;
      });

      res.status(200).send(lstPlanta);
    } else {
      next();
    }
  }

  function validarCUI() {
    const rand = Math.random() < 0.5;
    const response = {
      resultado: rand,
    };
    res.json(response);
  }

  function categoriasURL() {
    const { camaraCodigo, descripcion } = req.body;
    console.log(
      "Middleware - SIGECO - categoriasURL() - INIT - camaraCodigo:" +
        camaraCodigo
    );
    if (
      camaraCodigo != "CAENA" &&
      camaraCodigo != "FAIM" &&
      camaraCodigo != "CEPA"
    ) {
      res.status(412).jsonp({
        tipo: "ERROR_APP_BUSINESS",
        ticket: "TK-156269",
        codigo: "CODIGO_INVALIDO",
        descripcion: "Valor de camaraCodigo (" + camaraCodigo + ") invalido.",
      });
    } else {
      next();
    }
  }

  function validarLoguin() {
    // Handle the login request here
    console.log("Middleware - SIGECO - validarLoguin() - INIT");

    const { usuario, clave } = req.body;
    if (usuario != "admin" || (clave != "Prueba123" && clave != "Prueba3333")) {
      res.status(401).jsonp({
        tipo: "ERROR_APP_BUSINESS",
        ticket: "TK-156269",
        codigo: "CODIGO_INVALIDO",
        descripcion: "Credenciales invalidas.",
      });

      console.log(res.statusCode);
    } else {
      const response = {
        token: "ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
        tokenRefresco:
          "2ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
      };
      res.json(response);
    }
  }

  function validarLoguinHabilitado() {
    const response = {
      valor: true,
    };
    res.json(response);
  }

  function validarLoguinDFA() {
    console.log("Middleware - SIGECO - validarLoguinDFA() - INIT");

    const { codigo } = req.body;
    if (codigo != "310279") {
      res.status(401).jsonp({
        tipo: "ERROR_APP_BUSINESS",
        ticket: "TK-156269",
        codigo: "CODIGO_INVALIDO",
        descripcion: "Codigo de verificación invalido.",
      });

      console.log(
        "Middleware - SIGECO - validarLoguinDFA() - res.statusCode: " +
          res.statusCode
      );
    } else {
      const response = {
        token: "ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
        tokenRefresco:
          "2ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
      };
      res.json(response);
      /* En la sección donde manejas la ruta "/auth/login-dfa" con el método POST, estás llamando a res.json(response) y luego a next(). En este caso, res.json() envía la respuesta al cliente, pero luego también estás pasando la solicitud al siguiente middleware con next(). Esto puede resultar en un conflicto, ya que la respuesta ya se ha enviado al cliente. */
      //next();
    }
  }

  function validarPeriodo() {
    var ddjj = req.app.db.__wrapped__.DDJJConsulta;

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
      res.status(200).send({ resultado: true });
    } else {
      res.status(200).send({ resultado: false });
    }
  }

  function DDJJSetParams() {
    console.log("DDJJAlta - Hola");
    var empresaId = req.query.empresaId;
    if (empresaId != ":empresaId") {
      console.log("empresaId: " + empresaId);
      if (empresaId) {
        req.body.empresaId = empresaId;
      }
      req.body.estado = "PE";
      req.body.secuencia = null;
      req.body.totalART46 = genRand(100000, 1000000, 2);
      req.body.totalAntimaCS = genRand(100000, 1000000, 2);
      req.body.totalUomaCS = genRand(100000, 1000000, 2);
      req.body.totalUomaAS = genRand(100000, 1000000, 2);
      req.body.totalCuotaUsu = genRand(100000, 1000000, 2);

      next();
    } else {
      res.status(401).jsonp({
        tipo: "ERROR_APP_BUSINESS",
        ticket: "TK-156270",
        codigo: "CODIGO_INVALIDO",
        descripcion: "Debe indicar la empresa de la DDJJ .",
      });

      console.log(res.statusCode);
    }
  }

  function genRand(min, max, decimalPlaces) {
    var rand = Math.random() * (max - min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  }
};
