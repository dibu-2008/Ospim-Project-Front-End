import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  actualizarCategoria, crearCategoria,
  eliminarCategoria, obtenerCamaras, obtenerCategorias
} from "./CategoriasApi";
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';


function EditToolbar(props) {
  const { setRows, rows, setRowModesModel } = props;

  const handleClick = () => {
    const maxId = Math.max(...rows.map((row) => row.id), 0);
    const newId = maxId + 1;
    const id = newId;

    setRows((oldRows) => [
      { id, camaraCodigo: "", descripcion: "", isNew: true },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
}

export const Categorias = () => {

  const [locale, setLocale] = useState('esES');
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [camaras, setCamaras] = useState([]);

  const TOKEN = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.usuario.token;

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  useEffect(() => {
    const ObtenerCategorias = async () => {

      const categoriasResponse = await obtenerCategorias(TOKEN);

      setRows(categoriasResponse.map((item) => ({ id: item.id, ...item })));

    };
    ObtenerCategorias();
  }, []);


  useEffect(() => {
    const ObtenerCamaras = async () => {

      const camarasResponse = await obtenerCamaras(TOKEN);

      setCamaras(camarasResponse.map((item) => ({ id: item.id, ...item })));
    };
    ObtenerCamaras();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {

    setRows(rows.filter((row) => row.id !== id));

    await eliminarCategoria(id, TOKEN);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {

    const updatedRow = { ...newRow, isNew: false };

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    if (newRow.isNew) {

      const nuevaCategoria = {
        camaraCodigo: newRow.camaraCodigo,
        descripcion: newRow.descripcion,
      };

      await crearCategoria(nuevaCategoria, TOKEN);


    } else {

      const categoria = {
        camaraCodigo: newRow.camaraCodigo,
        descripcion: newRow.descripcion,
      };

      await actualizarCategoria(newRow.id, categoria, TOKEN);
    }

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "camaraCodigo",
      headerName: "Camara",
      width: 150,
      editable: true,
      headerAlign: "center",
      align: "center",
      type: "singleSelect",
      valueOptions: camaras.map((camara) => camara.codigo),
      headerClassName: 'header--cell',
    },
    {
      field: "descripcion",
      headerName: "Descripcion",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 200,
      headerAlign: "center",
      align: "center",
      headerClassName: 'header--cell',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div
      style={{
        marginTop: 50,
        height: 400,
        width: "100%",
      }}>
      <h1>Administracion de Categorias</h1>
      <Box
        sx={{
          margin: "0 auto",
          height: "400px",
          width: "38%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <ThemeProvider theme={themeWithLocale}>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, rows, setRowModesModel },
            }}
            sx={{
              // ...
              /* '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                width: '8px',
                visibility: 'visible',
              },
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                backgroundColor: '#ccc',
              }, */
            }}
            initialState={{
              ...rows.initialState,
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
};
