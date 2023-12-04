module.exports = (req, res, next) => {
  console.log("Entrooo.1..");
  //const users = require("./db/db_1.json");

  //console.log("db", req.app.db);
  //req.app.db.write({});

  if (req.method === "POST" && req.url === "/login") {
    // Handle the login request here
    console.log("Entrooo 2...");
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
    // Pass the request to the next middleware if it doesn't match the login route
    next();
  }
};
