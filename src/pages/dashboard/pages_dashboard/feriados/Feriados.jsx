import { useState, useEffect, useMemo } from "react";
import { Box, Button } from "@mui/material";
import {
  Add as IconoAgregar,
  Edit as IconoEditar,
  DeleteOutlined as IconoEliminar,
  Save as IconoGuardar,
  Close as IconoCancelar,
} from "@mui/icons-material";

import {
  GridRowModes as ModosFila,
  DataGrid as GrillaDatos,
  GridToolbarContainer as GrillaContenedorBarraHerramientas,
  GridActionsCellItem as CeldaAcciones,
  GridRowEditStopReasons as GrillaFilaParaEditar
} from "@mui/x-data-grid";
import {
  actualizarFeriado,
  crearFeriado,
  eliminarFeriado,
  obtenerFeriados
} from "./FeriadosApi";
import {
  createTheme as CrearTema,
  ThemeProvider as ProveedorTemas,
  useTheme as usarTema
} from '@mui/material/styles';
import * as localizaciones from '@mui/material/locale';
import Swal from 'sweetalert2'
import "./Feriados.css";

const crearNuevoFeriado = (props) => {

  const { filasFeriado, setFilasFeriado, setModeloFila, volverPrimerPagina } = props;

  const nuevoRegistro = () => {
    const maxId = Math.max(...filasFeriado.map((row) => row.id), 0);
    const newId = maxId + 1;
    const id = newId;

    volverPrimerPagina();

    setFilasFeriado((filasAnteriores) => [
      { id, fecha: "", esNueva: true },
      ...filasAnteriores,
    ]);
    setModeloFila((filasAnteriores) => ({
      [id]: { mode: ModosFila.Edit, fieldToFocus: "name" },
      ...filasAnteriores,
    }));

  };


  return (
    <GrillaContenedorBarraHerramientas>
      <Button color="primary" startIcon={<IconoAgregar />} onClick={nuevoRegistro}>
        Nuevo Registro
      </Button>
    </GrillaContenedorBarraHerramientas>
  );
}

export const Feriados = () => {

  const [localizacion, setLocalizacion] = useState('esES');
  const [filasFeriado, setFilasFeriado] = useState([]);
  const [modeloFila, setModeloFila] = useState({});
  const [paginacion, setPaginacion] = useState({
    pageSize: 5,
    page: 0,
  });

  const TOKEN = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.usuario.token;

  const tema = usarTema();

  const temaConlocalizacion = useMemo(
    () => CrearTema(tema, localizaciones[localizacion]),
    [localizacion, tema],
  );

  useEffect(() => {
    const ObtenerFeriados = async () => {

      const feriadosResponse = await obtenerFeriados(TOKEN);
      setFilasFeriado(feriadosResponse.map((item) => ({ id: item.id, ...item })));

    };

    ObtenerFeriados();

  }, []);

  const volverPrimerPagina = () => {
    setPaginacion((paginacionAnterior) => ({
      ...paginacionAnterior,
      page: 0,
    }));
  };

  const editarFila = (id) => () => {
    setModeloFila({ ...modeloFila, [id]: { mode: ModosFila.Edit } });
  };

  const guardarFila = (id) => () => {
    setModeloFila({ ...modeloFila, [id]: { mode: ModosFila.View } });
  };

  const eliminarFila = (id) => async () => {

    const confirmarEliminarRegistro = async () => {

      try {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1A76D2',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Si, bórralo!'
        }).then(async (respuesta) => {
          if (respuesta.isConfirmed) {

            setFilasFeriado((filasAnteriores) => filasAnteriores.filter((row) => row.id !== id));

            await eliminarFeriado(id, TOKEN);
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarFeriado:', error);
      }
    };

    confirmarEliminarRegistro();
  };

  const cancelarEdicionFila = (id) => () => {
    setModeloFila({
      ...modeloFila,
      [id]: { mode: ModosFila.View, ignoreModifications: true },
    });

    const filaEditada = filasFeriado.find((row) => row.id === id);
    if (filaEditada.esNueva) {
      setFilasFeriado(filasFeriado.filter((row) => row.id !== id));
    }
  };

  const procesarActualizarFila = async (nuevaFila) => {

    const filaActualizada = { ...nuevaFila, esNueva: false };

    const fecha = new Date(nuevaFila.fecha);

    fecha.setUTCHours(0, 0, 0, 0);

    const fechaFormateada = fecha.toISOString();

    if (nuevaFila.esNueva) {

      const feriadoNuevo = {
        fecha: fechaFormateada,
        descripcion: nuevaFila.descripcion,
      };

      await crearFeriado(feriadoNuevo, TOKEN);

    } else {

      const feriadoEditado = {
        fecha: fechaFormateada,
        descripcion: nuevaFila.descripcion,
      };

      await actualizarFeriado(nuevaFila.id, feriadoEditado, TOKEN);
    }

    setFilasFeriado(filasFeriado.map((row) => (row.id === nuevaFila.id ? filaActualizada : row)));

    return filaActualizada;
  };

  const columnas = [
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      type: "date",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {

        const fecha = new Date(value);

        const dia = fecha.getUTCDate().toString().padStart(2, "0");
        const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, "0");
        const anio = fecha.getUTCFullYear();

        return `${dia}-${mes}-${anio}`;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      flex: 1,
      cellClassName: "actions",
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
      getActions: ({ row }) => {

        const { id } = row;
        const ModoEdicion = modeloFila[id]?.mode === ModosFila.Edit;

        if (ModoEdicion) {
          return [
            <CeldaAcciones
              icon={<IconoGuardar />}
              label="Guardar"
              sx={{ color: "primary.main" }}
              onClick={guardarFila(id)}
            />,
            <CeldaAcciones
              icon={<IconoCancelar />}
              label="Cancelar"
              className="textPrimary"
              onClick={cancelarEdicionFila(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <CeldaAcciones
            icon={<IconoEditar />}
            label="Editar"
            className="textPrimary"
            onClick={editarFila(id)}
          />,
          <CeldaAcciones
            icon={<IconoEliminar />}
            label="Eliminar"
            className="textPrimary"
            onClick={eliminarFila(id)}
          />,
        ];
      },

    },
  ];

  return (
    <div className="feriados_container">
      <h1>Administración de feriados</h1>
      <Box
        sx={{
          height: "400px",
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <ProveedorTemas theme={temaConlocalizacion}>
          <GrillaDatos
            rows={filasFeriado}
            columns={columnas}
            rowModesModel={modeloFila}
            processRowUpdate={procesarActualizarFila}
            slots={{ toolbar: crearNuevoFeriado }}
            slotProps={{
              toolbar: { 
                filasFeriado, 
                setFilasFeriado, 
                setModeloFila, 
                volverPrimerPagina 
              },
            }}
            sx={{
              '& .css-1iyq7zh-MuiDataGrid-columnHeaders': {
                backgroundColor: '#1A76D2 !important',
              }
            }}
            paginationModel={paginacion}
            onPaginationModelChange={setPaginacion}
            pageSizeOptions={[5, 10, 25]}
          />
        </ProveedorTemas>
      </Box>
    </div>
  );
}
