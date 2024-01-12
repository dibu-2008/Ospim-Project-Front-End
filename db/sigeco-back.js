module.exports = (req, res, next) => {
  console.log("Middleware - SIGECO - INIT - getAPI: " + getAPI());
  console.log("Middleware - SIGECO - req.url:" + req.url);
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
    case "----":
      // code block
      next();
      break;
    default:
    // code block
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
      camaraCodigo != "CAENA"
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
};
