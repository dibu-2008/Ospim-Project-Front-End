module.exports = (req, res, next) => {
  console.log("Middleware - SIGECO - INIT - getAPI: " + getAPI(req, res));

  console.log("Middleware - SIGECO - req.url: " + req.method + "->" + req.url);
  //console.log("Middleware - SIGECO - req.body:" + req.body);

  function getAPI(req, res) {
    if (req.method === "GET" && req.url.startsWith("/DDJJ/imprimir/")) {
      return "DDJJ-IMPRIMIR";
    }

    if (req.method === "POST" && req.url.startsWith("/DDJJ/validar")) {
      return "DDJJ-VALIDAR-NIVEL2";
    }

    let regEx = /([DDJJConsulta]|[DDJJ])/i;
    if (
      req.method === "GET" &&
      regEx.test(req.url) &&
      !req.url.startsWith("/empresa/periodo/tiene-rectificativa") &&
      req.query.empresaId &&
      req.query.periodo
    ) {
      return "DDJJ-PERIODO-VALIDAR";
    }

    if (
      req.method === "POST" &&
      req.url.startsWith("/DDJJ?") &&
      req.query.empresaId
    ) {
      return "DDJJ-ALTA-V2";
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

    if (req.method === "DELETE" && req.url.startsWith("/aportes/?")) {
      return "APORTES-BAJA";
    }

    if (req.method === "PUT" && req.url.startsWith("/aportes/?")) {
      return "APORTES-MODI";
    }

    if (
      (req.method === "PUT" || req.method === "POST") &&
      req.url.startsWith("/aportesDetalle/?")
    ) {
      return "APORTE-DETALLE-ALTA";
    }

    if (req.method === "GET" && req.url.startsWith("/empresa/ddjj/boletas") )
    {
      return "BOLETA-DETALLE"
    }
    if (req.method === "POST" && req.url.startsWith("empresa/ddjj/boleta/calcular-interes") )
    {
      return "CALCULAR-INTERES"
    } 
    if (req.method === "POST" && req.url.startsWith("/empresa/ddjj/calcular-interes") )
    {
      return "CALCULAR-INTERESES"
    } 
    if (req.method === "GET" && req.url.startsWith("/empresa/ddjj/boleta/codigo"))
    {
      return "BOLETA-DDJJ-CODIGO"
    }
    if (req.method === "GET" && req.url.startsWith("/empresa/ddjj/boleta-pago/concepto/imprimir-detalle")){
      return "DETALLE-BOLETA-IMPRIMIR"
    }
    if (req.method ==="GET" && req.url.startsWith("/empresa/ddjj/boleta-pago/concepto/imprimir-boleta")){
      return "BOLETA-IMPRIMIR"
    }
    if (req.method === "GET" && req.url.startsWith("/empresa/periodo/tiene-rectificativa")){
      return "TIENE-RECTIFICATIVA"
    }
      
    return "----";
  }

  switch (getAPI(req, res)) {
    case "DDJJ-MISDDJJ-CONSULTA":
      ddjjGenerarTotales();
      break;
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
    case "DDJJ-ALTA-V2":
      DDJJSetParamsV2();
      break;
    case "DDJJ-IMPRIMIR":
      DDJJImprimir();
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
    case "APORTES-BAJA":
      AportesBaja();
      break;
    case "APORTES-MODI":
      AportesModi();
      break;
    case "APORTE-DETALLE-ALTA":
      AporteDetalleAlta();
      break;
    case "DDJJ-VALIDAR-NIVEL2":
      ddjjValidarN2(req, res);
      break;
    case "BOLETA-DETALLE":
      getBoletaDetalle();
      break;
    case "CALCULAR-INTERES":
      calcularInteres();
      break;
    case "CALCULAR-INTERESES":
      calcularInteresBoletas();
      break;
    case "BOLETA-DDJJ-CODIGO":
      getBoletaByDDJJIDandCodigo();
      break;
    case "DETALLE-BOLETA-IMPRIMIR":
      getBoletaDetalleImpresa();
      break;
    case "BOLETA-IMPRIMIR":
      getBoletaImpresa();
      break;
    case "TIENE-RECTIFICATIVA":
      tieneRectificativa();
      break;
    case "----":
      // code block
      next();
      break;
    default:
    // code block
  }

  function DDJJImprimir() {
    const file = `${__dirname}/ddjj_2.pdf`;
    res.download(file); // Set disposition and send it.
  }

  /* function ddjjValidarN2(req, res) {

    console.log("XXXXXXX : ", req.body);

    // []

  function ddjjValidarN2() {
    res.status(200).jsonp({
      errores: [
        {
          codigo: "APORTE",
          cuil: 20265656565,
          descripcion: "Deve completar los aportes de los Empleados.",
        },
        {
          codigo: "REMU",
          cuil: 20265656565,
          descripcion: "Deve completar las remuneraciones de los Empleados.",
        },
        {
          codigo: "CAMARA",
          cuil: 20294465996,
          descripcion: "Deve completar las Camaras de los Empleados.",
        },
        {
          codigo: "FECHAING",
          cuil: 20294465996,
          descripcion: "Deve completar las Fechas de Ingreso de los Empleados.",
        },
      ],
    });
  } */

  function ddjjValidarN2(req, res) {
    // Validar que todos los campos estén llenos excepto "inte"
    const afiliados = req.body.afiliados;
    console.log(afiliados)
    const errores = [];

    afiliados.forEach((afiliado, index)=> {
      Object.entries(afiliado).forEach(([key, value]) => {
        if (key !== 'inte' && (value === null || value === undefined)) {
          errores.push({
            //codigo: `CAMPO_${key.toUpperCase()}_VACIO`,
            codigo: key,
            cuil: afiliado.cuil,
            descripcion: `El campo '${key}' está vacío.`,
            indice: index
          });
        }
      });
    });

    if (errores.length > 0) {
      res.status(400).jsonp(
        {
          codigo: "ERROR_VALIDACION_NIVEL",
          ticket: "TK-156269",
          descripcion: "Errores en la validación de la DDJJ.",
          tipo: "ERROR_APP_BUSINESS",
          errores : {
            errores : errores 
          }
        }
      );
    } else {
      res.status(200).jsonp({
        mensaje: "Todos los campos están llenos excepto 'inte'.",
        afiliados
      });
    }
  }

  function DDJJImprimir() {
    const file = `${__dirname}/ddjj_2.pdf`;
    res.download(file); // Set disposition and send it.
  }

  function AporteDetalleAlta() {
    let aporte = req.query.aporte;
    req.body.aporte = aporte;
    next();
  }

  function AportesBaja() {
    let codigo = req.query.codigo;
    let aportesDB = req.app.db.__wrapped__.aportes;
    let aporte = aportesDB.find((elem) => elem.codigo == codigo);
    if (aporte) {
      let aportesDBNew = aportesDB.filter((elem) => elem.codigo != codigo);
      req.app.db.__wrapped__.aportes = aportesDBNew;
      req.app.db.write();
      res.status(200).send(null);
    } else {
      res.status(404).jsonp({
        tipo: "ERROR_APP_BUSINESS",
        ticket: "TK-156269",
        codigo: "CODIGO_INVALIDO",
        descripcion: "Codigo inexistente.",
      });
    }
  }

  function AportesModi() {
    let codigo = req.query.codigo;
    let aportesDB = req.app.db.__wrapped__.aportes;
    let aportesIndex = aportesDB.findIndex((elem) => elem.codigo == codigo);
    console.log("aportesIndex: " + aportesIndex);
    if (aportesIndex > -1) {
      if (req.body.descripcion)
        aportesDB[aportesIndex].descripcion = req.body.descripcion;
      if (req.body.cuenta) aportesDB[aportesIndex].cuenta = req.body.cuenta;
      req.app.db.write();
      res.status(200).send(null);
    } else {
      res.status(404).jsonp({
        tipo: "ERROR_APP_BUSINESS",
        ticket: "TK-156269",
        codigo: "CODIGO_INVALIDO",
        descripcion: "Codigo inexistente.",
      });
    }
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
    var ddjj = req.app.db.__wrapped__.DDJJ;

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

  function DDJJSetParamsV2() {
    let empresaId = req.query.empresaId;
    if (empresaId != ":empresaId") {
      req.body.empresaId = empresaId;
      req.body.estado = "PE";
      req.body.secuencia = null;

      let vecAfiliados = req.body.afiliados;
      let vecAfiliadosNew = vecAfiliados.map(function callback(
        element,
        index,
        array
      ) {
        // Return value for new_array
        element.aportes = DDJJSetParamsAporteV2(
          element.remunerativo,
          element.UOMASocio,
          element.ANTIMASocio
        );

        return element;
      });
      req.body.afiliados = vecAfiliadosNew;

      next();
    } else {
      res.status(401).jsonp({
        tipo: "ERROR_APP_BUSINESS",
        ticket: "TK-156270",
        codigo: "CODIGO_INVALIDO",
        descripcion: "Debe indicar la empresa de la DDJJ .",
      });
    }
  }

  function DDJJSetParamsAporteV2(remuneracion, bUOMASocio, bANTIMASocio) {
    let aportes = [];
    let imp = remuneracion * 0.02;
    let impArt46 = 2570 * 0.02;
    aportes[0] = { aporte: "ART46", importe: impArt46 };
    if (bUOMASocio) {
      aportes[1] = { aporte: "UOMACS", importe: imp };
      aportes[2] = { aporte: "UOMAAS", importe: imp };
      if (bANTIMASocio) {
        aportes[3] = { aporte: "ANTIMACS", importe: 7500 };
      }
    }
    return aportes;
  }

  function DDJJSetParams() {
    console.log("DDJJAlta - Hola");
    let empresaId = req.query.empresaId;
    if (empresaId != ":empresaId") {
      console.log("empresaId: " + empresaId);
      req.body.empresaId = empresaId;
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


  function getBoletaDetalle(){
    const declaracion_jurada_id       = req.query.ddjj_id
    const boletasDetalle              = req.app.db.__wrapped__.boletas;
    const tieneBoletasParaDeclaracion = boletasDetalle.declaracion_jurada_id == declaracion_jurada_id
    const error404 = {descripcion: "No se encontraron boletas para la declaracion jurada"}
    
    tieneBoletasParaDeclaracion ? res.status(200).jsonp(boletasDetalle) : res.status(404).jsonp(error404)
  }

  function  calcula_diferencia_de_dias(dia_mayor, dia_menor) {
    return (new Date(dia_mayor) - new Date(dia_menor)) / (1000 * 60 * 60 * 24);
  } 

  function calcularInteres(){
    const { codigoBoleta } = req.query
    const { intencion_de_pago } = req.body
    const interes_diario = 0.01  
    const boletaOrig = req.app.db.__wrapped__.boletas.detalle_boletas.find(boleta => boleta.codigo === codigoBoleta)
    const boleta = JSON.parse(JSON.stringify(boletaOrig))
    const diferencia_en_dias  = calcula_diferencia_de_dias(intencion_de_pago, boleta.vencimiento)
    
    if (diferencia_en_dias >= 0){
      const monto_interes = boleta.total_acumulado * interes_diario *  diferencia_en_dias
      boleta.total_final = boleta.total_acumulado + monto_interes
      boleta.interes = parseFloat(monto_interes.toFixed(2))
    }
    
    boleta.intencion_de_pago = intencion_de_pago
    res.status(200).jsonp({...boleta}) 
  }

  function calcularInteresBoletas(){
    //Calcula el interes de todas las boletas de una sola vez
    const { intencion_de_pago } = req.body
    const interes_diario = 0.01
    const boletasOrig = req.app.db.__wrapped__.boletas
    const boletas = JSON.parse(JSON.stringify(boletasOrig))
  
    const boletasActualizadas = boletas.detalle_boletas.map(boleta =>{
      const diferencia_en_dias = calcula_diferencia_de_dias(intencion_de_pago, boleta.vencimiento)
      if (diferencia_en_dias >= 0){
        const monto_interes = boleta.total_acumulado * interes_diario *  diferencia_en_dias
        boleta.total_final = boleta.total_acumulado + monto_interes
        boleta.interes = parseFloat(monto_interes.toFixed(2))
      }
  
      return {...boleta, intencion_de_pago}
    })
    res.status(200).jsonp(boletasActualizadas)
  }

  function getBoletaByDDJJIDandCodigo(){
    const { ddjj_id, codigo } = req.query
    const BOLETAS_BY_DDDJJ = req.app.db.__wrapped__.boletas_guardadas.find(boletasddjj => boletasddjj.declaracion_jurada_id == ddjj_id )
    const BOLETA_BY_CODIGO = BOLETAS_BY_DDDJJ.detalle_boletas.find(boleta => boleta.codigo == codigo)
    res.status(200).jsonp(BOLETA_BY_CODIGO)
  }

  function getBoletaDetalleImpresa(){
    console.log("entre en impresion detalle de boleta")
    const file = `${__dirname}/detalle_boleta.pdf`;
    res.download(file); // Set disposition and send it.
  }

  function getBoletaImpresa(){
    console.log("entre en impresion de boleta")
    const file = `${__dirname}/boletas.pdf`;
    res.download(file); // Set disposition and send it.
  }

  function tieneRectificativa(){
    const {empresaId, periodo} = req.query
    const rectificativa = empresaId == 1 && periodo == '2024-01'
    
    res.status(200).jsonp({rectificativa})
  }
};
