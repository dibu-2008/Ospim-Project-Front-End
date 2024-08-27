const getFuncionalidades = () => {
  return [
    {
      id: 1,
      descripcion: 'PUBLICACIONES',
    },
    {
      id: 2,
      descripcion: 'FERIADOS',
    },
    {
      id: 9,
      descripcion: 'GESTION_ROLES',
    },
    {
      id: 10,
      descripcion: 'CUITS_RESTRINGIDOS',
    },
    {
      id: 11,
      descripcion: 'ROLES',
    },
    {
      id: 12,
      descripcion: 'USUARIO_INTERNO',
    },
    {
      id: 14,
      descripcion: 'AJUSTES',
    },
    {
      id: 3,
      descripcion: 'NUEVA_DDJJ',
    },
    {
      id: 5,
      descripcion: 'MIS_BOLETAS',
    },
    {
      id: 8,
      descripcion: 'BOLETA_ACTAS',
    },
    {
      id: 7,
      descripcion: 'DATOS_PERFIL',
    },
    {
      id: 15,
      descripcion: 'MIS_DDJJ',
    },
  ];
};

const funcionHabilitada = (codigo) => {
  const vecFunc = getFuncionalidades();
  if (vecFunc.length > 0) {
    const aux = vecFunc.find((reg) => {
      return reg.descripcion === codigo;
    });
    console.log('aux:', aux);
    if (aux) {
      return true;
    }
  }
  return false;
};

console.log('funcionHabilitada(): ', funcionHabilitada('NUEVA_sDDJJ'));

console.log('FIN');
