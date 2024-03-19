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
import { axiosDomicilios } from "./GrillaRegistroDomicilioApi";
import { MenuItem, Select } from "@mui/material";
import {
  createTheme as CrearTema,
  ThemeProvider as ProveedorTemas,
  useTheme as usarTema,
} from "@mui/material/styles";
import * as localizaciones from "@mui/material/locale";
import Swal from "sweetalert2";

function EditToolbar(props) {
  const { setRows, rows, setRowModesModel } = props;

  const handleClick = () => {
    const maxId = rows ? Math.max(...rows.map((row) => row.id), 0) : 1;

    const newId = maxId + 1;

    const id = newId;

    setRows((oldRows) => [
      {
        id,
        tipo: "",
        provinciaId: "",
        localidadId: "",
        calle: "",
        piso: "",
        dpto: "",
        oficina: "",
        cp: "",
        planta: "",
        valor: "",
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        AGREGAR DOMICILIO
      </Button>
    </GridToolbarContainer>
  );
}

export const GrillaRegistroDomilicio = ({ rows, setRows }) => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [tipoDomicilio, setTipoDomicilio] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [localidades, setLocalidades] = useState([]);
  const [localizacion, setLocalizacion] = useState("esES");
  const [paginacion, setPaginacion] = useState({
    pageSize: 10,
    page: 0,
  });

  const tema = usarTema();

  const temaConlocalizacion = useMemo(
    () => CrearTema(tema, localizaciones[localizacion]),
    [localizacion, tema]
  );

  useEffect(() => {
    const getTipoDomicilio = async () => {
      const data = await axiosDomicilios.getTipoDomicilio();
      if (data) setTipoDomicilio(data.map((item) => ({ ...item })));
    };
    getTipoDomicilio();
  }, []);

  useEffect(() => {
    const getProvincias = async () => {
      const data = await axiosDomicilios.getProvincias();
      console.log(data);
      if (data) setProvincias(data.map((item) => ({ ...item })));
    };
    getProvincias();
  }, []);

  useEffect(() => {
    const getLocalidades = async () => {
      const data = await axiosDomicilios.getLocalidades(provinciaSeleccionada);
      setLocalidades(data.map((item) => ({ ...item })));
    };
    getLocalidades();
  }, [provinciaSeleccionada]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const volverPrimerPagina = () => {
    setPaginacion((paginacionAnterior) => ({
      ...paginacionAnterior,
      page: 0,
    }));
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    //showSwallAgregarDomicilio();
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    showSwallEliminarDomicilio();
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

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const showSwallAgregarDomicilio = () => {
    Swal.fire({
      icon: "success",
      title: "Se agrego el domicilio correctamente",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const showSwallEliminarDomicilio = () => {
    Swal.fire({
      icon: "success",
      title: "Se elimino el domicilio correctamente",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const columns = [
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
      editable: true,
      headerAlign: "center",
      headerClassName: "header--cell",
      type: "singleSelect",
      getOptionValue: (dato) => dato.codigo,
      getOptionLabel: (dato) => dato.descripcion,
      valueOptions: tipoDomicilio,
    },
    {
      field: "provinciaId",
      headerName: "Provincia",
      flex: 1,
      editable: true,
      headerClassName: "header--cell",
      headerAlign: "center",
      type: "singleSelect",
      getOptionValue: (dato) => dato.id,
      getOptionLabel: (dato) => dato.descripcion,
      valueOptions: provincias,
      renderEditCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => {
            // Limpiar el valor de la localidad
            params.api.setEditCellValue({
              id: params.id,
              field: "localidadId",
              value: "",
            });
            setProvinciaSeleccionada(e.target.value);
            params.api.setEditCellValue({
              id: params.id,
              field: "provinciaId",
              value: e.target.value,
            });
          }}
          style={{ width: "100%", padding: "8px" }}
        >
          {provincias.map((province) => (
            <MenuItem key={province.id} value={province.id}>
              {province.descripcion}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "localidadId",
      headerName: "Localidad",
      headerClassName: "header--cell",
      flex: 1,
      editable: true,
      type: "singleSelect",
      headerAlign: "center",
      getOptionValue: (dato) => dato.id,
      getOptionLabel: (dato) => dato.descripcion,
      valueOptions: localidades,
    },
    {
      field: "calle",
      headerName: "Calle",
      headerAlign: "center",
      headerClassName: "header--cell",
      flex: 1,
      editable: true,
    },
    {
      field: "piso",
      headerName: "Piso",
      headerAlign: "center",
      headerClassName: "header--cell",
      flex: 1,
      editable: true,
    },
    {
      field: "depto",
      headerName: "Depto",
      headerAlign: "center",
      headerClassName: "header--cell",
      flex: 1,
      editable: true,
    },
    {
      field: "oficina",
      headerName: "Oficina",
      headerAlign: "center",
      headerClassName: "header--cell",
      flex: 1,
      editable: true,
    },
    {
      field: "cp",
      headerName: "CP",
      headerAlign: "center",
      headerClassName: "header--cell",
      flex: 1,
      editable: true,
    },
    {
      field: "planta",
      headerName: "Planta",
      headerAlign: "center",
      headerClassName: "header--cell",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      headerAlign: "center",
      headerClassName: "header--cell",
      type: "actions",
      headerName: "Acciones",
      flex: 2,
      cellClassName: "actions",
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
    <Box
      sx={{
        height: "auto",
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
            toolbar: {
              setRows,
              rows,
              setRowModesModel,
              volverPrimerPagina,
            },
          }}
          paginationModel={paginacion}
          onPaginationModelChange={setPaginacion}
          pageSizeOptions={[10, 15, 25]}
        />
      </ProveedorTemas>
    </Box>
  );
};
