export const getToken = () => {
  let auxStateLogin = localStorage.getItem("stateLogin");
  let TOKEN = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem("stateLogin"));
    if (auxStateLogin.hasOwnProperty("usuarioLogueado")) {
      TOKEN = auxStateLogin.usuarioLogueado.usuario.token;
      console.log("getHttpHeader - OK!! - TOKEN: ");
      console.log(TOKEN);
      return TOKEN;
    }
  }
  return {};
};

export const getEmpresaId = () => {
  let auxStateLogin = localStorage.getItem("stateLogin");
  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem("stateLogin"));
    if (auxStateLogin.hasOwnProperty("usuarioLogueado")) {
      auxStateLogin = auxStateLogin.usuarioLogueado;
      if (auxStateLogin.hasOwnProperty("empresa")) {
        auxStateLogin = auxStateLogin.empresa;
        if (auxStateLogin.hasOwnProperty("id")) {
          return auxStateLogin.id;
        }
      }
    }
  }
};

export const localStorageService = {
  getToken: function () {
    return getToken();
  },
  getEmpresaId: function () {
    return getEmpresaId();
  },
};
