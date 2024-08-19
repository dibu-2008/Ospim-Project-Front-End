export const getToken = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let TOKEN = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      TOKEN = auxStateLogin.usuarioLogueado.usuario.token;
      return TOKEN;
    }
  }
  return {};
};

export const getTokenRefresh = () => {
  try {
    let auxStateLogin = localStorage.getItem('stateLogin');
    let tokenRefresh = null;

    if (auxStateLogin != null) {
      auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
      if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
        tokenRefresh = auxStateLogin.usuarioLogueado.usuario.tokenRefresco;
        return tokenRefresh;
      }
    }
  } catch (error) {
    console.log('localStorageService - getTokenRefresh - error:', error);
  }
  return null;
};

export const setLoguinRefresh = (token, tokenRefresh) => {
  try {
    let auxStateLogin = localStorage.getItem('stateLogin');
    if (auxStateLogin != null) {
      auxStateLogin = JSON.parse(auxStateLogin);
      auxStateLogin.usuarioLogueado.usuario.token = token;
      auxStateLogin.usuarioLogueado.usuario.tokenRefresco = tokenRefresh;

      localStorage.setItem('stateLogin', JSON.stringify(auxStateLogin));
    }
  } catch (error) {}
};

export const getEmpresaId = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      auxStateLogin = auxStateLogin.usuarioLogueado;
      if (auxStateLogin?.hasOwnProperty('empresa')) {
        auxStateLogin = auxStateLogin.empresa;
        if (auxStateLogin?.hasOwnProperty('id')) {
          return auxStateLogin.id;
        }
      }
    }
  }
};

export const getRol = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let ROL = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      ROL = auxStateLogin.usuarioLogueado.usuario.rol[0].descripcion;
      return ROL;
    }
  }

  return {};
};

export const getUsuario = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let USUARIO = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      USUARIO = auxStateLogin.usuarioLogueado.usuario.nombre;
      return USUARIO;
    }
  }

  return null;
};
export const getApellido = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let USUARIO = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      USUARIO = auxStateLogin.usuarioLogueado.persona.apellido;
      return USUARIO;
    }
  }

  return null;
};
export const getNombre = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let USUARIO = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      USUARIO = auxStateLogin.usuarioLogueado.persona.nombre;
      return USUARIO;
    }
  }

  return null;
};
export const getMail = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let USUARIO = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      USUARIO = auxStateLogin.usuarioLogueado.persona.email;
      return USUARIO;
    }
  }

  return null;
};

export const isRolEmpleador = () => {
  let ROL = getRol();
  if (ROL == 'EMPLEADOR') return true;
  return false;
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
  getUsuario: function () {
    return getUsuario();
  },
  getApellido: function () {
    return getApellido();
  },
  getNombre: function () {
    return getNombre();
  },
  getMail: function () {
    return getMail();
  },
  isRolEmpleador: function () {
    return isRolEmpleador();
  },
  getTokenRefresh: function () {
    return getTokenRefresh();
  },
  setLoguinRefresh: function (token, tokenRefresh) {
    setLoguinRefresh(token, tokenRefresh);
  },
  getNombre: function () {
    return getNombre();
  },
};

export default localStorageService;
