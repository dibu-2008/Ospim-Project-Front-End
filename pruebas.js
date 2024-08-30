const prueba = (aux) => {
  if (aux) {
    console.log('1 - TRUE - aux:', aux);
  } else {
    console.log('2 - FALSE - aux:', aux);
  }
};

let aux = null;
prueba(aux);

aux = 0;
prueba(aux);

prueba();

aux = false;
prueba(aux);

aux = 1;
prueba(aux);

aux = true;
prueba(aux);

aux = 'plata';
prueba(aux);

aux = '';
prueba(aux);

aux = -1;
prueba(aux);
console.log('FIN');
