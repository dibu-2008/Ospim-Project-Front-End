module.exports = (req, res, next) => {
  console.log("Middleware - DDJJ - INIT..");

  console.log("Entrooo.1..req.method: " + req.method);
  console.log("Entrooo.1..req.url: " + req.url);
  console.log("Entrooo.1..req.url: " + req);
  console.log("Entrooo.1..req.url: " + res);
  console.log(req.url.startsWith("/DDJJ-periordo-existe"));

  if (req.method === "GET" && req.url.startsWith("/DDJJ-periordo-existe")) {
    console.log("db", req.app.db.rol);
    console.log("Middleware - DDJJ - res.json(): .." + res.json());
    //const { periodo, valor } = res.json();

    //console.log("Middleware - DDJJ - periodo: " + periodo);
    //console.log("Middleware - DDJJ - valor: " + valor);
  }

  next();
};
