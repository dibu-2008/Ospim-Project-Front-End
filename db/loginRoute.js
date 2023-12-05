module.exports = (req, res, next) => {
  console.log("Entrooo.1..");
  console.log("Entrooo.1..req.method: " + req.method);
  console.log("Entrooo.1..req.url: " + req.url);
  //const users = require("./db/db_1.json");

  //console.log("db", req.app.db);
  //req.app.db.write({});

  if (req.method === "POST" && req.url === "/login") {
    // Handle the login request here
    console.log("Entrooo 2: POST - /login...");
    const { nombre, clave } = req.body;

    // Perform authentication logic and return the desired response
    // You can retrieve the existing login resource from the db.json file if needed

    //var usuarios = req.app.db.get("usuarios");

    //console.log("usuarios: " + users.usuarios);

    //console.log("usuaLogin: " + usuaLogin);

    // Example response
    const response = {
      token: "ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
      tokenRefresco:
        "2ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
    };

    res.json(response);
  } else {
    let pattern = /\bcategoria/;
    let result = req.url.search(pattern);
    console.log("req.url:" + req.url + " - result:" + result);
    if ((req.method === "POST" || req.method === "PUT") && result > -1) {
      console.log("Entrooo 3: POST - /categoria...");
      const { camaraCodigo, descripcion } = req.body;
      console.log("Entrooo 3: camaraCodigo: " + camaraCodigo);
      if (
        camaraCodigo != "CAENA" &&
        camaraCodigo != "FAIM" &&
        camaraCodigo != "CAENA"
      ) {
        res.status(412).jsonp({
          tipo: "ERROR_APP_BUSINESS",
          codigo: "CODIGO_INVALIDO",
          descripcion: "Valor de camaraCodigo (" + camaraCodigo + ") invalido.",
        });

        //console.log(res.statusCode);
      } else {
        next();
      }
    } else {
      next();
    }
  }
  // Pass the request to the next middleware if it doesn't match the login route
};
