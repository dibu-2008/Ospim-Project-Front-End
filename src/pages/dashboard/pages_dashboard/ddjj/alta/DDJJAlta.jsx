import { useEffect, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { esES } from "@mui/x-date-pickers/locales";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack, 
  Tooltip, 
  Typography
} from "@mui/material";
import 'dayjs/locale/es'; 
import "./DDJJAlta.css";
import { DDJJAltaEmpleadosGrilla } from "./empleadosGrilla/DDJJAltaEmpleadosGrilla";
import { axiosDDJJ } from "./DDJJAltaApi";
import localStorageService from "@/components/localStorage/localStorageService";
import Swal from "sweetalert2";
import XLSX from "xlsx";
import { GridRowModes } from "@mui/x-data-grid";

const textoIdioma = 
  esES.components.MuiLocalizationProvider.defaultProps['localeText'];

const adaptadorIdioma = "es";

export const MisAltaDeclaracionesJuradas = ({
  DDJJState,
  setDDJJState,
  periodo,
  setPeriodo,
  rowsAltaDDJJ,
  setRowsAltaDDJJ,
  rowsAltaDDJJAux,
  setRowsAltaDDJJAux,
  peticion,
}) => {
  const [camaras, setCamaras] = useState([]);
  const [todasLasCategorias, setTodasLasCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [afiliado, setAfiliado] = useState({});
  const [plantas, setPlantas] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [mostrarPeriodos, setMostrarPeriodos] = useState(false);
  const [validacionResponse, setValidacionResponse] = useState([]);
  const [afiliadoImportado, setAfiliadoImportado] = useState([]);
  const [filasDoc, setFilasDoc] = useState([]);
  const [ocultarEmpleadosGrilla, setOcultarEmpleadosGrilla] = useState(false);
  const [btnSubirHabilitado, setBtnSubirHabilitado] = useState(false);
  const [ddjjCreada, setDDJJCreada] = useState({});
  const [someRowInEditMode, setSomeRowInEditMode] = useState(false);
  const [otroPeriodo, setOtroPeriodo] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const ID_EMPRESA = localStorageService.getEmpresaId();

  const handleChangePeriodo = (date) => setPeriodo(date);

  const handleChangeOtroPeriodo = (date) => setOtroPeriodo(date);

  useEffect(() => {
    // Comprueba si hay alguna fila en modo edición
    const isSomeRowInEditMode = Object.values(rowModesModel).some((row) => row.mode === GridRowModes.Edit);
    // Actualiza el estado con el valor de booleano
    setSomeRowInEditMode(isSomeRowInEditMode);
  }, [rowModesModel]);

  useEffect(() => {
    const ObtenerCamaras = async () => {
      const data = await axiosDDJJ.getCamaras();
      setCamaras(data.map((item, index) => ({ id: index + 1, ...item })));
    };
    ObtenerCamaras();
  }, []);

  useEffect(() => {
    const ObtenerCategorias = async () => {
      const data = await axiosDDJJ.getCategorias();
      setTodasLasCategorias(
        data.map((item, index) => ({ id: index + 1, ...item }))
      );
    };
    ObtenerCategorias();
  }, []);

  useEffect(() => {
    const ObtenerPlantaEmpresas = async () => {
      const data = await axiosDDJJ.getPlantas(ID_EMPRESA);
      setPlantas(data.map((item) => ({ id: item, ...item })));
    };
    ObtenerPlantaEmpresas();
  }, []);

  const importarAfiliado = async () => {

    const cuiles = afiliadoImportado.map((item) => item.cuil);
    const cuilesString = cuiles.map((item) => item.toString());

    const cuilesResponse = await axiosDDJJ.validarCuiles(
      ID_EMPRESA,
      cuilesString
    );

    const afiliadoImportadoConInte = afiliadoImportado.map((item) => {
      const cuilResponse = cuilesResponse.find(
        (cuil) => +cuil.cuil === item.cuil
      );
      if (cuilResponse) {
        return { ...item, inte: cuilResponse.inte };
      }
      return item;
    });

    // Si alguno de los cuiles el valor de cuilesValidados es igual a false
    if (cuilesResponse.some((item) => item.cuilValido === false)) {
      const mensajesFormateados2 = filasDoc
        .map((item) => {
          return `<p style="margin-top:20px;">
        Linea ${item.indice}: cuil ${item.cuil} con formato inválido.</p>`;
        })
        .join("");

      console.log(mensajesFormateados2);

      Swal.fire({
        icon: "error",
        title: "Error de validacion",
        html: `Cuiles con errores:<br>${mensajesFormateados2}<br>`,
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      });

      setRowsAltaDDJJ(afiliadoImportadoConInte);
    } else {
      Swal.fire({
        icon: "success",
        title: "Importación exitosa",
        showConfirmButton: false,
        timer: 1000,
      });

      // Aca es donde debo de controlar el inte dependiendo si el cuil
      // Se encuentra dado de alta o no, antes de llenar la grilla.

      setRowsAltaDDJJ(afiliadoImportadoConInte);
    }
    setRowsAltaDDJJAux(afiliadoImportadoConInte);
    setOcultarEmpleadosGrilla(true);
  };

  const formatearFecha = (fecha) => {
    const partes = fecha?.split("/");
    const anio = partes[2]?.length === 2 ? "20" + partes[2] : partes[2];
    const mes = partes[1].padStart(2, "0");
    const dia = partes[0];
    return `${anio}-${mes}-${dia}`;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setSelectedFileName(file ? file.name : "");

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log("CSV IMPORTADO...");
        console.log(rows);

        if (rows[0].length === 11) {
          console.log("Columnas completas");
          const arraySinEncabezado = rows.slice(1);

          rows.forEach((item, index) => {
            const fila = {
              indice: index + 1,
              cuil: item[0],
            };

            setFilasDoc([...filasDoc, fila]);
          });

          const arrayTransformado = arraySinEncabezado.map((item, index) => {
            return {
              id: index + 1,
              cuil: item[0],
              apellido: item[1],
              nombre: item[2],
              camara: item[3],
              categoria: item[4],
              fechaIngreso: formatearFecha(item[5]),
              empresaDomicilioId: plantas.find(
                (plantas) => plantas.planta === item[6]
              )?.id,
              remunerativo: item[7],
              noRemunerativo: item[8],
              uomaSocio: item[9] === "Si",
              amtimaSocio: item[10] === "Si",
              esImportado: true,
            };
          });

          // Antes de llenar las grillas debo de validar los cuiles

          setAfiliadoImportado(arrayTransformado);
          setBtnSubirHabilitado(true);
          console.log(DDJJState);
          if (DDJJState.id) {
            confirm("Recorda que si subis un archivo, se perderan los datos de la ddjj actual")
          }
        } else {
          console.log("Columnas incompletas");
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleElegirOtroChange = (event) => {
    setMostrarPeriodos(event.target.value === "elegirOtro");
  };

  const guardarDeclaracionJurada = async () => {

    if (DDJJState && DDJJState.id) {
      console.log("Tiene id la ddjj");
      setPeriodo(DDJJState.periodo);
      console.log(periodo);
    }

    console.log(periodo);

    let DDJJ = {
      periodo: periodo,
      afiliados: rowsAltaDDJJ.map((item) => {
        console.log("DENTRO DE ROWS ALTA DDJJ.c.c.");
        console.log(item);

        const registroNew = {
          errores: item.errores,
          cuil: !item.cuil ? null : item.cuil,
          inte: item.inte,
          apellido: !item.apellido ? null : item.apellido,
          nombre: !item.nombre ? null : item.nombre,
          fechaIngreso: !item.fechaIngreso ? null : item.fechaIngreso,
          empresaDomicilioId: !item.empresaDomicilioId
            ? null
            : item.empresaDomicilioId,
          camara: !item.camara ? null : item.camara,
          categoria: !item.categoria ? null : item.categoria,
          remunerativo: !item.remunerativo ? null : item.remunerativo,
          noRemunerativo: !item.noRemunerativo ? null : item.noRemunerativo,
          uomaSocio: item.uomaSocio,
          amtimaSocio: item.amtimaSocio,
        };

        console.log("REGISTRO NEW");
        console.log(registroNew);
        if (item.id) registroNew.id = item.id;
        return registroNew;
      }),
    };

    if (DDJJState.id) {
      DDJJ.id = DDJJState.id;
    }

    console.log("DDJJJJJJJJJJJJJJJJJJ FINALLLL");
    console.log(DDJJ);

    // Borrar la propiedad errores de cada afiliado
    // por que no se envia al backend
    DDJJ.afiliados.forEach((afiliado) => {
      delete afiliado.errores;
    });

    console.log("borro afiliado.errores - DDJJ:");
    console.log(DDJJ);

    const validacionResponse = await axiosDDJJ.validar(ID_EMPRESA, DDJJ);
    console.log("validacionResponse: ");
    console.log(validacionResponse);

    // array de cuiles del array validacionResponse.errores
    let cuilesConErrores = [];
    if (validacionResponse.errores) {
      cuilesConErrores = validacionResponse.errores.map((error) => error.cuil);
    }
    console.log("cuilesConErrores: ");
    console.log(cuilesConErrores);

    // Agregar la propiedad errores="No"
    DDJJ.afiliados.forEach((afiliado) => {
      console.log("afiliado.cuil: ");
      console.log(afiliado.cuil);
      afiliado.errores = false;
      if (cuilesConErrores.includes(afiliado.cuil)) {
        console.log("afiliado.errores:false");
        afiliado.errores = true;
      }
    });

    // Buscar todos estos cuiles en el rowsAltaDDJJ, y marcarlos con errores="Si"
    rowsAltaDDJJ.forEach((afiliado) => {
      if (cuilesConErrores.includes(afiliado.cuil)) {
        afiliado.errores = true;
      } else {
        afiliado.errores = false;
      }
    });

    // Borro la propiedad errores de ddjj
    DDJJ.afiliados.forEach((afiliado) => {
      delete afiliado.errores;
    });

    setValidacionResponse(validacionResponse); // Sirve para pintar en rojo los campos con errores

    if (validacionResponse.errores && validacionResponse.errores.length > 0) {
      const mensajesUnicos = new Set();

      validacionResponse.errores.forEach((error) => {
        if (!mensajesUnicos.has(error.descripcion)) {
          mensajesUnicos.add(error.descripcion);
        }
      });

      const mensajesFormateados = Array.from(mensajesUnicos)
        .map((mensaje, index) => {
          return `<p>${index + 1} - ${mensaje}</p>`;
        })
        .join("");

      Swal.fire({
        icon: "error",
        title: "Valiacion de Declaracion Jurada",
        html: `${mensajesFormateados}<br>
                      <label for="guardarErrores">¿Deseas guardar la declaración jurada y corregir mas tardes los errores?</label>`,
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log("Aceptar...");
          let bOK = false;

          DDJJ.afiliados.forEach((afiliado) => {
            delete afiliado.errores;
          });

          if (peticion === "PUT") {
            bOK = await axiosDDJJ.actualizar(ID_EMPRESA, DDJJ);
          } else {
            const data = await axiosDDJJ.crear(ID_EMPRESA, DDJJ);
            setDDJJCreada(data);
            console.log(data);
          }
        } else {
          console.log("Cancelar...se queda a corregir datos");
          // NO limpiar la grilla.
          // El usuario decidio corregir los errores antes de GRABAR.
          // pero no hay que PERDER los datos.-
        }
      });
    } else {
      console.log("no tiene errores...grabo directamente.");

      DDJJ.afiliados.forEach((afiliado) => {
        delete afiliado.errores;
      });

      if (peticion === "PUT") {
        console.log("Dentro de PUT");

        //await actualizarDeclaracionJurada(ID_EMPRESA, altaDDJJFinal, altaDDJJFinal.id);
        await axiosDDJJ.actualizar(ID_EMPRESA, DDJJ);
        //setRowsAltaDDJJ([]);
        // peticion put con fetch
      } else {
        const data = await axiosDDJJ.crear(ID_EMPRESA, DDJJ);
        setDDJJCreada(data);
        console.log(data);
        if (data) {
          //actualizar estado
          setDDJJState(data);
          //setRowsAltaDDJJ(data.);
        }
        //sacarlo luego de actualizar
        //setRowsAltaDDJJ([]);
      }
    }
  };

  const presentarDeclaracionJurada = async () => {

    if (DDJJState.id) {

      // Esto deberia de ser un post para poder cambiar ambos datos 
  
      const data = await axiosDDJJ.presentar(ID_EMPRESA, DDJJState.id);
      DDJJState.estado = data.estado;
      DDJJState.secuencia = data.secuencia;
      if (data) {
        
        const newDDJJState = {
          ...DDJJState,
          estado: data.estado || null,
          secuencia: data.secuencia,
        };
        console.log("newDDJJState - pre SET: ");
        console.log(newDDJJState);
        setDDJJState(newDDJJState);
      }
    }
  };

  return (
    <div className="mis_alta_declaraciones_juradas_container">
      <div className="periodo_container">
        <h5 className="paso">Paso 1 - Indique período a presentar</h5>
        <Stack spacing={4} direction="row" alignItems="center">
          <Typography variant="h6" className="title_periodo">
            Período
          </Typography>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={adaptadorIdioma}
            localeText={textoIdioma}
          >
            <DemoContainer components={["DatePicker"]}>
              <DesktopDatePicker
                label={"Periodo"}
                views={["month", "year"]}
                closeOnSelect={true}
                onChange={handleChangePeriodo}
                value={periodo} 
              />
            </DemoContainer>
          </LocalizationProvider>
            {
              DDJJState.secuencia === 0 ? (
                <Typography variant="h6">
                  Formulario: Original
                </Typography>
              ) : (

                DDJJState.secuencia ? (
                  <Typography variant="h6">
                    Formulario: Rectif. {DDJJState.secuencia}
                  </Typography>


                ) : (
                  <Typography variant="h6">
                    Formulario: Pendiente
                  </Typography>
                )
              )
            }
        </Stack>
      </div>

      <div className="presentacion_container">
        <h5 className="paso">Paso 2 - Elija un modo de presentación</h5>
        <div className="subir_archivo_container">
          <span className="span">1</span>
          <h5 className="title_subir_archivo">Subir un archivo CSV - XLSL</h5>
          <div className="file-select" id="src-file1">
            <input
              type="file"
              name="src-file1"
              aria-label="Archivo"
              onChange={handleFileChange}
              accept=".csv, .xlsx"
              title=""
            />
            <div className="file-select-label" id="src-file1-label">
              {selectedFileName || "Nombre del archivo"}
            </div>
          </div>
          <Button
            variant="contained"
            sx={{
              padding: "6px 52px",
            }}
            onClick={importarAfiliado}
            disabled={!btnSubirHabilitado}
          >
            Subir
          </Button>
        </div>
        <div className="copiar_periodo_container">
          <span className="span">2</span>
          <h5 className="title_subir_archivo">Copiar un período anterior</h5>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="ultimoPeriodoPresentado"
            name="radio-buttons-group"
            sx={{ marginLeft: "67px" }}
            onChange={handleElegirOtroChange}
          >
            <FormControlLabel
              value="ultimoPeriodoPresentado"
              control={<Radio />}
              label="Ultimo período presentado"
            />
            <FormControlLabel
              value="elegirOtro"
              control={<Radio />}
              label="Elegir otro"
            />
            <div className="elegir_otro_container">
              {mostrarPeriodos && (
                <Stack
                  spacing={4}
                  direction="row"
                  sx={{ marginLeft: "-11px", marginTop: "10px" }}
                >
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={adaptadorIdioma}
                    localeText={textoIdioma}
                  >
                    <DemoContainer components={["DatePicker"]}>
                      <DesktopDatePicker
                        label={"Otro período"}
                        views={["month", "year"]}
                        closeOnSelect={true}
                        onChange={handleChangeOtroPeriodo}
                        value={otroPeriodo}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Stack>
              )}
            </div>
          </RadioGroup>
          <Button
            variant="contained"
            sx={{
              marginLeft: "114px",
              padding: "6px 45px",
            }}
            onClick={() => setOcultarEmpleadosGrilla(!ocultarEmpleadosGrilla)}
          >
            Buscar
          </Button>
        </div>
        <div className="manualmente_container">
          <span className="span">3</span>
          <h5 className="title_manualmente">Cargar manualmente</h5>
          <Button
            variant="contained"
            sx={{
              padding: "6px 23px",
              marginLeft: "468px",
            }}
            onClick={() => setOcultarEmpleadosGrilla(!ocultarEmpleadosGrilla)}
          >
            Seleccionar
          </Button>
        </div>
      </div>

      {(ocultarEmpleadosGrilla || (rowsAltaDDJJ && rowsAltaDDJJ.length > 0)) && (
        <div className="formulario_container">
          <h5 className="paso">Paso 3 - Completar el formulario</h5>

          <DDJJAltaEmpleadosGrilla
            rowsAltaDDJJ={rowsAltaDDJJ}
            setRowsAltaDDJJ={setRowsAltaDDJJ}
            rowsAltaDDJJAux={rowsAltaDDJJAux}
            setRowsAltaDDJJAux={setRowsAltaDDJJAux}
            camaras={camaras}
            categoriasFiltradas={categoriasFiltradas}
            setCategoriasFiltradas={setCategoriasFiltradas}
            afiliado={afiliado}
            setAfiliado={setAfiliado}
            todasLasCategorias={todasLasCategorias}
            plantas={plantas}
            validacionResponse={validacionResponse}
            setSomeRowInEditMode={setSomeRowInEditMode}
            rowModesModel={rowModesModel}
            setRowModesModel={setRowModesModel}
          />

          <div
            className="botones_container"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Tooltip
              title={someRowInEditMode ? "Hay filas en edición, por favor finalice la edición antes de guardar." : ""}
              sx={{ marginLeft: "10px", cursor: "pointer" }}
            >
              <span>
                <Button
                  variant="contained"
                  sx={{ padding: "6px 52px", marginLeft: "10px" }}
                  onClick={guardarDeclaracionJurada}
                  disabled={someRowInEditMode || rowsAltaDDJJ.length === 0}
                >
                  Guardar
                </Button>
              </span>
            </Tooltip>


            {
              DDJJState.estado === "PR" ? (
                <Button
                  variant="contained"
                  sx={{ padding: "6px 52px", marginLeft: "10px" }}
                  onClick={presentarDeclaracionJurada}
                  disabled={true}
                >
                  Presentar
                </Button>
              ) : (

                DDJJState.estado === "PE" ? (
                  <Button
                    variant="contained"
                    sx={{ padding: "6px 52px", marginLeft: "10px" }}
                    onClick={presentarDeclaracionJurada}
                    disabled={false}
                  >
                    Presentar
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ padding: "6px 52px", marginLeft: "10px" }}
                    onClick={presentarDeclaracionJurada}
                    disabled={ddjjCreada.id ? false : true}
                  >
                    Presentar
                  </Button>
                )
              )
            }
          </div>
        </div>
      )}
    </div>
  );
};
