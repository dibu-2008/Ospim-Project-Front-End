export const getToken = () => {
  let auxStateLogin = localStorage.getItem("stateLogin");
  let TOKEN = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem("stateLogin"));
    if (auxStateLogin.hasOwnProperty("usuarioLogueado")) {
      TOKEN = auxStateLogin.usuarioLogueado.usuario.token;
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

export const getRol = () => {
  let auxStateLogin = localStorage.getItem("stateLogin");
  let ROL = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem("stateLogin"));
    if (auxStateLogin.hasOwnProperty("usuarioLogueado")) {
      ROL = auxStateLogin.usuarioLogueado.usuario.rol[0].descripcion;
      return ROL;
    }
  }

  return {};
};


const localStorageService = {
  getToken: function () {
    return getToken();
  },
  getEmpresaId: function () {
    return getEmpresaId();
  },
  getRol: function () {
    return getRol();
  },
};

export default localStorageService;
