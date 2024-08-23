import { useState } from 'react';
import { Button, Box } from '@mui/material';
import XLSX from 'xlsx';
import formatter from '@/common/formatter';
import Swal from 'sweetalert2';
import swal from '@/components/swal/swal';
import { axiosDDJJ } from './DDJJApi';

import localStorageService from '@/components/localStorage/localStorageService';

export const DDJJArchivoImport = ({
  ddjjCabe,
  plantas,
  camaras,
  categoriasPorCamara, //(ex todasLasCategorias)
  handlerGrillaActualizar, //devolver los rows del archivo.-
  habiModif, //habilitacion de controles
}) => {
  console.log('DDJJArchivoImport - habiModif:', habiModif);
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const IMPORTACION_OK = import.meta.env.VITE_IMPORTACION_OK;
  const vecRowTitulos = [
    'Cuil',
    'Apellido',
    'Nombre',
    'Camara',
    'Categoria',
    'Fecha de ingreso',
    'Planta',
    'Remunerativo',
    'No Remunerativo',
    'Adherido al sindicato',
    'Paga Mutual',
  ];

  const [fileNameSelected, setFileNameSelected] = useState(''); // validar si eligieron un archivo
  const [fileVecCuiles, setFileVecCuiles] = useState([]);
  const [btnSubirHabilitado, setBtnSubirHabilitado] = useState(false); // No se para que sirve
  const [actualizacionHabilitada, setActualizacionHabilitada] = useState(false); //habilita Import solo cuando estado 'PE'

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileNameSelected(file ? file.name : '');

    if (file) {
      console.log('VA a leer el file  !!!!');
      const reader = new FileReader();

      reader.onload = (e) => {
        const rows = readFile(e);

        if (!validarTitulos(rows)) {
          swal.showWarning(
            '<div><p>Formato de archivo incorrecto.<br>La primera fila debe incluir titulos de las <b>11 columnas</b>:<br><br> 1-CUIL<br>2-Apellido<br>3-Nombre<br>4-Cámara<br>5-Categoría<br>6-Ingreso<br>7-Planta<br>8-Remunerativo<br>9-No Remunerativo<br>10-Adherido Sindicato<br>11-Paga Mutual</p></div>',
            true,
          );
          fileReset();
          console.log('HACE: event.target.value = null;');
          event.target.value = null;
          console.log('HACE: event.target.value = null; => OK');
          return false;
        }

        const rowsDatos = rows.slice(1);
        console.log('rowsDatos:', rowsDatos);
        const vecRowsGridDto = castFileRowsToGrid(rowsDatos);
        console.log('vecRowsGridDto:', vecRowsGridDto);

        setFileVecCuiles(vecRowsGridDto);
        //  console.log('handleFileChange - arrayTransformado', arrayTransformado);
        setBtnSubirHabilitado(true);
        if (ddjjCabe && ddjjCabe.id) {
          confirm(
            'Recorda que si subis un archivo, se perderan los datos de la ddjj actual',
          );
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      fileReset();
      event.target.value = null;
      console.log('file es NULO !!!!');
    }
  };

  const readFile = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log('rows:', rows);
    let rowUno = [];
    if (rows && rows.length > 0) {
      rowUno = rows[0]; //Guardo Row Titulo
    }

    const rowsClean = rows.filter((reg) => {
      if (reg?.length > 0 && reg[0] != null && Number.isInteger(reg[0])) {
        return true;
      }
    }); //Elimino rows en blanco y donde no hay un numerico en

    if (rowsClean && rowsClean.length > 0) {
      if (rowsClean[0].toString() != rowUno.toString()) {
        //Devuelvo row Titulos
        rowsClean.unshift(rowUno);
      }
    }
    console.log('**rowsClean:', rowsClean);

    return rowsClean;
  };

  const validarTitulos = (vecRows) => {
    if (vecRows[0].length === 11) {
      //console.log('vecRows[0].toString(): ', vecRows[0].toString());
      //console.log('vecRowTitulos.toString(): ', vecRowTitulos.toString());
      try {
        const vecTitTrim = vecRows[0].map((reg) => reg.trim());
        if (vecTitTrim.toString() === vecRowTitulos.toString()) {
          return true;
        }
      } catch (e) {
        try {
          console.log('vecRows[0].toString(): ', vecRows[0].toString());
          console.log('vecRowTitulos.toString(): ', vecRowTitulos.toString());
        } catch (e2) {}
      }
    }
    return false;
  };

  const findCodigo = (vector, codigo) => {
    try {
      if (vector && vector.find) {
        let reg = vector.find((reg) => reg.codigo == codigo);
        if (reg != null && reg != undefined) {
          return reg.codigo;
        }
      } else {
        console.error(
          'DDJJArchivoImport.findCodigo() - no vector, no .find() - vector: ',
          vector,
        );
      }
      return null;
    } catch (error) {
      console.error('DDJJArchivoImport.findCodigo() - error: ', error);
      return null;
    }
  };
  const findCodigoCategoria = (camara, categoria) => {
    try {
      if (categoriasPorCamara && categoriasPorCamara.find) {
        let reg = categoriasPorCamara.find(
          (reg) => reg.camara == camara && reg.categoria == categoria,
        );
        if (reg != null && reg != undefined) {
          return reg.categoria;
        }
      } else {
        console.error(
          'DDJJArchivoImport.findCodigoCategoria() - no vector, no .find() - categoriasPorCamara: ',
          categoriasPorCamara,
        );
      }
      return null;
    } catch (error) {
      console.error('DDJJArchivoImport.findCodigoCategoria() - error: ', error);
      return null;
    }
  };
  const importarAfiliado = async () => {
    //fileVecCuiles: valida los cuiles y  actualiza  nombre y apellido del arcivo con lo que hay en "Afiliados"
    console.log('importarAfiliado - fileNameSelected:', fileNameSelected);
    if (
      !fileNameSelected ||
      fileNameSelected == '' ||
      fileNameSelected == undefined
    ) {
      swal.showWarning('Debe seleccionar un archivo válido.');
      return false;
    }

    if (!fileVecCuiles || fileVecCuiles.length == 0) {
      //no hay registros
      swal.showWarning('El archivo seleccionado se encuentra vacío.');
      return false;
    }

    console.log('importarAfiliado - 1 -  getCuilesValidados() ');
    const cuilesValidados = await getCuilesValidados();
    //1) Si existe cuil y no tiene errores, piso nombre y apellido.-
    //2) Si no existe cuil y tiene error de cuil, seteo gError=true

    console.log('importarAfiliado - 2 -  fileVecCuilesNew');
    const fileVecCuilesNew = fileVecCuiles.map((item, index) => {
      const val = cuilesValidados.find(
        (regValidado) => regValidado.cuil === item.cuil,
      );
      if (val) {
        //{cuil; inte; apellido; nombre; cuilValido;}
        if (!val.cuilValido) {
          item.gErrores = true;
        } else {
          item.nombre = val.nombre || '';
          item.apellido = val.apellido || '';
        }
      }
      return item;
    });

    console.log('importarAfiliado - 3 -  fileVecCuilesNew - some() ');
    // Si alguno de los cuiles tiene ERROR
    if (fileVecCuilesNew.some((item) => item.gErrores === true)) {
      const mensajesFormateados2 = fileVecCuilesNew
        .map((cuil) => {
          if (cuil.gErrores) {
            return `<p style="margin-top:20px;">
            CUIL ${cuil.cuil} con formato inválido.</p>`;
          }
        })
        .join('');

      Swal.fire({
        icon: 'error',
        title: 'Error de validacion',
        html: `Cuiles con errores:<br>${mensajesFormateados2}<br>`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      });

      setFileVecCuiles(fileVecCuilesNew);
      handlerGrillaActualizar(fileVecCuilesNew);
    } else {
      console.log('importarAfiliado - 4 -   ');
      swal.showSuccess(IMPORTACION_OK);
      setFileVecCuiles(fileVecCuilesNew);
      handlerGrillaActualizar(fileVecCuilesNew);
    }
    console.log('importarAfiliado - 5 -  FIN ');
  };
  const getCuilesValidados = async () => {
    const vecCuiles = fileVecCuiles.map((item) => item.cuil);
    const vecCuilesString = vecCuiles.map((item) => item?.toString());
    console.log('getCuilesValidados() - vecCuilesString:', vecCuilesString);
    const validacionResponse = await axiosDDJJ.validarCuiles(
      ID_EMPRESA,
      vecCuilesString,
    );

    return validacionResponse; //{cuil; inte; apellido; nombre; cuilValido;}
  };
  const castFileRowsToGrid = (fileVecDatos) => {
    const rowsGridDto = fileVecDatos
      .map((item, index) => {
        //if (item.length === 11 && item[0] !== undefined) {
        const camaraCodigo = findCodigo(camaras, item[3]);
        const categoriaCodigo = findCodigoCategoria(item[3], item[4]);
        return {
          regId: null,
          gErrores: false,

          id: index,
          cuil: item[0],
          apellido: item[1]?.toUpperCase(),
          nombre: item[2]?.toUpperCase(),
          fechaIngreso: formatter.fechaImport(item[5]),
          empresaDomicilioId: plantas.find(
            (plantas) => plantas.planta === item[6],
          )?.id,
          camara: camaraCodigo || '',
          categoria: categoriaCodigo || '',
          remunerativo: item[7],
          noRemunerativo: item[8],
          uomaSocio: item[9]?.toUpperCase() === 'SI',
          amtimaSocio: item[10]?.toUpperCase() === 'SI',
        };
        //} else {
        //console.log('arrayTransformado - Descarte: index'+index+ ' - item:', item);
        //}
      })
      .filter((item) => item !== undefined);
    return rowsGridDto;
  };

  const fileReset = () => {
    setFileNameSelected('');
    setFileVecCuiles([]);
    //setFilasDoc([]); //No se para que sirve
    setBtnSubirHabilitado(false);
  };
  //console.log('DDJJArchivoImport -INIT');

  return (
    <Box className="subir_archivo_container">
      <Box className="file-select" id="src-file1">
        <input
          type="file"
          name="src-file1"
          aria-label="Archivo"
          onChange={handleFileChange}
          accept=".csv, .xlsx"
          title=""
          //disabled={!habiModif}
        />
        <Box className="file-select-label" id="src-file1-label">
          {fileNameSelected || 'Nombre del archivo'}
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{
          padding: '6px 52px',
          width: '150px',
        }}
        onClick={importarAfiliado}
        disabled={!habiModif}
      >
        Importar
      </Button>
    </Box>
  );
};
