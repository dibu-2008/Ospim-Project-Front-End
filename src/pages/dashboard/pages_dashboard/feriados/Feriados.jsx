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
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
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

  const { setFilasFeriados, filasFeriados, setModoModeloFila, volverPrimerPagina } = props;

  const handleNuevoRegistro = () => {
    const maxId = Math.max(...filasFeriados.map((row) => row.id), 0);
    const newId = maxId + 1;
    const id = newId;

    volverPrimerPagina();

    setFilasFeriados((oldRows) => [
      { id, fecha: "", isNew: true },
      ...oldRows,
    ]);
    setModoModeloFila((oldModel) => ({
      [id]: { mode: ModosFila.Edit, fieldToFocus: "name" },
      ...oldModel,
    }));

  };


  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<IconoAgregar />} onClick={handleNuevoRegistro}>
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
}

export const Feriados = () => {

  const [localizacion, setLocalizacion] = useState('esES');
  const [filasFeriados, setFilasFeriados] = useState([]);
  const [rowModesModel, setModoModeloFila] = useState({});
  const [paginationModel, setPaginationModel] = useState({
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
      setFilasFeriados(feriadosResponse.map((item) => ({ id: item.id, ...item })));

    };

    ObtenerFeriados();

  }, []);

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setModoModeloFila({ ...rowModesModel, [id]: { mode: ModosFila.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setModoModeloFila({ ...rowModesModel, [id]: { mode: ModosFila.View } });
  };

  const handleDeleteClick = (id) => async () => {

    const showSwalConfirm = async () => {
      try {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1A76D2',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Si, bórralo!'
        }).then(async (result) => {
          if (result.isConfirmed) {

            setFilasFeriados((prevRows) => prevRows.filter((row) => row.id !== id));

            await eliminarFeriado(id, TOKEN);
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarFeriado:', error);
      }
    };

    showSwalConfirm();
  };

  const handleCancelClick = (id) => () => {
    setModoModeloFila({
      ...rowModesModel,
      [id]: { mode: ModosFila.View, ignoreModifications: true },
    });

    const editedRow = filasFeriados.find((row) => row.id === id);
    if (editedRow.isNew) {
      setFilasFeriados(filasFeriados.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {

    const updatedRow = { ...newRow, isNew: false };

    const fecha = new Date(newRow.fecha);

    fecha.setUTCHours(0, 0, 0, 0);

    const fechaFormateada = fecha.toISOString();

    if (newRow.isNew) {

      const nuevoFeriado = {
        fecha: fechaFormateada,
        descripcion: newRow.descripcion,
      };

      await crearFeriado(nuevoFeriado, TOKEN);

    } else {

      const updatedFeriado = {
        fecha: fechaFormateada,
        descripcion: newRow.descripcion,
      };

      await actualizarFeriado(newRow.id, updatedFeriado, TOKEN);
    }

    setFilasFeriados(filasFeriados.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setModoModeloFila(newRowModesModel);
  };

  const columns = [
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      type: "date",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
      valueFormatter: (params) => {

        const date = new Date(params.value);

        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
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
      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.row.id]?.mode === ModosFila.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<IconoGuardar />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(params.row.id)}
            />,
            <GridActionsCellItem
              icon={<IconoCancelar />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(params.row.id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<IconoEditar />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params.row.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<IconoEliminar />}
            label="Delete"
            color="inherit"
            onClick={handleDeleteClick(params.row.id)}
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
            rows={filasFeriados}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{ toolbar: crearNuevoFeriado }}
            slotProps={{
              toolbar: { setFilasFeriados, filasFeriados, setModoModeloFila, volverPrimerPagina },
            }}
            sx={{
              '& .css-1iyq7zh-MuiDataGrid-columnHeaders': {
                backgroundColor: '#1A76D2 !important',
              }
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
          />
        </ProveedorTemas>
      </Box>
    </div>
  );
}
