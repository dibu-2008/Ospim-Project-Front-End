import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { esES } from "@mui/x-date-pickers/locales";
import {
  Box,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import dayjs from "dayjs";
import esLocale from "dayjs/locale/es";
import "./DDJJAlta.css";
import { GrillaPasoTres } from "./paso_tres/GrillaPasoTres";
import { axiosDDJJ } from "./DDJJAltaApi";
import formatter from "@/common/formatter";

import localStorageService from "@/components/localStorage/localStorageService";
import Swal from "sweetalert2";
import XLSX from "xlsx";
import { TextFields } from "@mui/icons-material";

export const MisAltaDeclaracionesJuradas = ({
  DDJJState,
  setDDJJState,
  /* periodo,
  setPeriodo,
  periodoIso,
  handleChangePeriodo,
  handleAcceptPeriodoDDJJ, */
  rowsAltaDDJJ,
  setRowsAltaDDJJ,
  rowsAltaDDJJAux,
  setRowsAltaDDJJAux,
  peticion,
  idDDJJ,
}) => {

  const [periodo, setPeriodo] = useState(null);
  const [otroPeriodo, setOtroPeriodo] = useState(null);
  const [otroPeriodoIso, setOtroPeriodoIso] = useState(null);
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
  const [ocultarGrillaPaso3, setOcultarGrillaPaso3] = useState(false);
  const ID_EMPRESA = localStorageService.getEmpresaId();

  const handleChangePeriodo = (date) => setPeriodo(date);

  const handleChangeOtroPeriodo = (date) => setOtroPeriodo(date);

  /* const handleAcceptOtroPeriodo = () => {
    if (otroPeriodo && otroPeriodo.$d) {
      const { $d: fecha } = otroPeriodo;
      const fechaFormateada = new Date(fecha);
      fechaFormateada.setDate(1); // Establecer el día del mes a 1

      // Ajustar la zona horaria a UTC
      fechaFormateada.setUTCHours(0, 0, 0, 0);

      const fechaISO = fechaFormateada.toISOString(); // 2026-02-01T00:00:00.000Z
      setOtroPeriodoIso(fechaISO);
    }
  }; */

  useEffect(() => {
    const ObtenerCamaras = async () => {
      const data = await axiosDDJJ.getCamaras();
      //const camarasResponse = await obtenerCamaras(TOKEN);
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

    console.log("AFILIAFO IMPORTADO");
    console.log(afiliadoImportado);
    console.log("CUILES RESPONSE DDBB");
    console.log(cuilesResponse);

    const afiliadoImportadoConInte = afiliadoImportado.map((item) => {

      const cuilResponse = cuilesResponse.find(
        (cuil) => +(cuil.cuil) === item.cuil
      );
      if (cuilResponse) {
        return { ...item, inte: cuilResponse.inte };
      }
      return item;
    });

    console.log("AFILIADO IMPORTADO FINAL CON INTE");
    console.log(afiliadoImportadoConInte);

    // Si alguno de los cuiles el valor de cuilesValidados es igual a false
    if (cuilesResponse.some((item) => item.cuilValido === false)) {

      /*  const cuilFallido = cuilesResponse.filter(
         (item) => item.cuilValido === false
       ); */


      const mensajesFormateados2 = filasDoc.map((item) => {
        return `<p style="margin-top:20px;">
        Linea ${item.indice}: cuil ${item.cuil} con formato inválido.</p>`;
      }).join("");

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
    setOcultarGrillaPaso3(true);
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

        console.log("CSV IMPORTADO...")
        console.log(rows)

        if (rows[0].length === 11) {
          console.log("Columnas completas");
          const arraySinEncabezado = rows.slice(1);

          rows.forEach((item, index) => {

            const fila = {
              indice: index + 1,
              cuil: item[0]
            }

            setFilasDoc([...filasDoc, fila]);

          })

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
        } else {
          console.log("Columnas incompletas");
        }
      }

      reader.readAsArrayBuffer(file);
    }
  };

  const handleElegirOtroChange = (event) => {
    setMostrarPeriodos(event.target.value === "elegirOtro");
  };

  const guardarDeclaracionJurada = async () => {

    console.log("GUARDAR DECLARACION JURADA")
    console.log(rowsAltaDDJJ)

    const DDJJ = {
      periodo: periodo,
      afiliados: rowsAltaDDJJ.map((item) => {
        console.log("DENTRO DE ROWS ALTA DDJJ");
        console.log(item)
        const registro = {
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
        console.log("REGISTRO")
        console.log(registro)
        if (item.id) registro.id = item.id;
        return registro;
      }),
    };

    if (DDJJState.id) {
      DDJJ.id = DDJJState.id;
    }

    console.log("DDJJJJJJJJJJJJJJJJJJ FINALLLL")
    console.log(DDJJ)

    // Borrar la propiedad errores de cada afiliado
    // por que no se envia al backend
    DDJJ.afiliados.forEach((afiliado) => {
      delete afiliado.errores;
    });

    const validacionResponse = await axiosDDJJ.validar(ID_EMPRESA, DDJJ);
    console.log(validacionResponse);

    // array de cuiles del array validacionResponse.errores
    const cuilesConErrores = validacionResponse.errores.map((error) => error.cuil);

    // Agregar la propiedad errores="No"
    DDJJ.afiliados.forEach((afiliado) => {
      if (!cuilesConErrores.includes(afiliado.cuil)) {
        afiliado.errores = "No";
      }
    });

    // Buscar todos estos cuiles en el rowsAltaDDJJ, y marcarlos con errores="Si"
    rowsAltaDDJJ.forEach((afiliado) => {
      if (cuilesConErrores.includes(afiliado.cuil)) {
        afiliado.errores = "Si";
      } else {
        afiliado.errores = "No";
      }
    });

    // Borro la propiedad errores de ddjj
    delete DDJJ.errores;

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
          if (peticion === "PUT") {
            bOK = await axiosDDJJ.actualizar(ID_EMPRESA, DDJJ);
            //setRowsAltaDDJJ([]);
          } else {
            await axiosDDJJ.crear(ID_EMPRESA, DDJJ);
            alert("Declaracion jurada guardada exitosamente");
            //setRowsAltaDDJJ([]);
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
      if (peticion === "PUT") {
        console.log("Dentro de PUT");
        //await actualizarDeclaracionJurada(ID_EMPRESA, altaDDJJFinal, altaDDJJFinal.id);
        await axiosDDJJ.actualizar(ID_EMPRESA, DDJJ);
        //setRowsAltaDDJJ([]);
        // peticion put con fetch
      } else {
        const data = await axiosDDJJ.crear(ID_EMPRESA, DDJJ);
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

  return (
    <div className="mis_alta_declaraciones_juradas_container">
      <div className="periodo_container">
        <h5 className="paso">Paso 1 - Indique período a presentar</h5>
        <Stack spacing={4} direction="row" alignItems="center">
          <h5 className="title_periodo">Período</h5>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={"es"}
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DemoContainer components={["DatePicker"]}>
              {/* <DesktopDatePicker
                label={"Periodo"}
                views={["month", "year"]}
                closeOnSelect={false}
                onChange={handleChangePeriodo}
                value={periodo}
                slotProps={{ actionBar: { actions: ["cancel", "accept"] } }}
                onAccept={handleAcceptPeriodoDDJJ}
              /> */}
              <DatePicker
                label={"Periodo"}
                views={["month", "year"]}
                closeOnSelect={true}
                onChange={handleChangePeriodo}
                value={periodo}
              />
            </DemoContainer>
          </LocalizationProvider>
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
                    adapterLocale={"es"}
                    localeText={
                      esES.components.MuiLocalizationProvider.defaultProps
                        .localeText
                    }
                  >
                    {/* <DesktopDatePicker
                      label={"Otro Periodo"}
                      views={["month", "year"]}
                      closeOnSelect={false}
                      onChange={handleChangeOtroPeriodo}
                      value={otroPeriodo}
                      slotProps={{
                        actionBar: { actions: ["cancel", "accept"] },
                      }}
                      onAccept={handleAcceptOtroPeriodo}
                    /> */}
                    <DatePicker
                      label={"Periodo"}
                      views={["month", "year"]}
                      closeOnSelect={true}
                      onChange={handleChangePeriodo}
                      value={otroPeriodo}
                    />
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
            onClick={() => setOcultarGrillaPaso3(!ocultarGrillaPaso3)}
          >
            Seleccionar
          </Button>
        </div>
      </div>

      {
        ocultarGrillaPaso3 && (
          <div className="formulario_container">
            <h5 className="paso">Paso 3 - Completar el formulario</h5>

            <GrillaPasoTres
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
            />

            <div
              className="botones_container"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained" // Si quito esto se ve mejor ?????
                sx={{ padding: "6px 52px", marginLeft: "10px" }}
                onClick={guardarDeclaracionJurada}
              >
                Guardar
              </Button>
              <Button
                variant="contained"
                sx={{ padding: "6px 52px", marginLeft: "10px" }}
              >
                Presentar
              </Button>
            </div>
          </div>
        )
      }
    </div>
  );
};
