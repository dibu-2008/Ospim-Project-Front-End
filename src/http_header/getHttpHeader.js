export const getHttpHeader = () => {
  let auxStateLogin = localStorage.getItem("stateLogin");
  let TOKEN = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem("stateLogin"));
    if (auxStateLogin.hasOwnProperty("usuarioLogueado")) {
      TOKEN = auxStateLogin.usuarioLogueado.usuario.token;
      console.log("getHttpHeader - OK!! - TOKEN: ");
      console.log(TOKEN);
      let oHeader = { headers: { Authorization: TOKEN } };
      return oHeader;
    }
  }
  return {};
};
