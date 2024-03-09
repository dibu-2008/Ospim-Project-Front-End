import { useState, useEffect } from "react";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CancelIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { axiosContacto } from "./GrillaEmpresaContactoApi";
import Swal from "sweetalert2";

function EditToolbar(props) {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const handleClick = () => {
    const maxId = rows ? Math.max(...rows.map((row) => row.id), 0) : 1;

    const newId = maxId + 1;

    const id = newId;

    volverPrimerPagina();

    setRows((oldRows) => [
      { id, tipo: "", prefijo: "", valor: "", isNew: true },
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
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
}

export const GrillaEmpresaContacto = ({ idEmpresa, rows, setRows }) => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [tipoContacto, setTipoContacto] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  useEffect(() => {
    const getTipoContacto = async () => {
      const tipo = await axiosContacto.obtenerTipo();
      setTipoContacto(tipo.map((item) => ({ ...item })));
    };
    getTipoContacto();
  }, []);

  useEffect(() => {
    const getDatosEmpresa = async () => {
      console.log("** getDatosEmpresa - idEmpresa: " + idEmpresa);
      const datosEmpresa = await axiosContacto.obtenerDatosEmpresa(idEmpresa);
      setRows(datosEmpresa.map((item) => ({ ...item, id: item.id })));
    };
    getDatosEmpresa();
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
    const showSwalConfirm = async () => {
      try {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¡No podrás revertir esto!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#1A76D2",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Si, bórralo!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const bBajaOk = await axiosContacto.eliminar(idEmpresa, id);
            if (bBajaOk) setRows(rows.filter((row) => row.id !== id));
          }
        });
      } catch (error) {
        console.error("Error al ejecutar eliminarContacto:", error);
      }
    };

    showSwalConfirm();
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

  const processRowUpdate = async (newRow, oldRow) => {
    let bOk = false;
    if (newRow.isNew) {
      try {
        delete newRow.id;
        delete newRow.isNew;
        const data = await axiosContacto.crear(idEmpresa, newRow);
        if (data && data.id) {
          newRow.id = data.id;
          newRow.isNew = false;
          bOk = true;
          const newRows = rows.map((row) => (row.isNew ? newRow : row));
          setRows(newRows);
        } else {
          console.log("alta sin ID generado");
        }
      } catch (error) {
        console.log(
          "X - processRowUpdate - ALTA - ERROR: " + JSON.stringify(error)
        );
      }
    } else {
      try {
        delete newRow.isNew;
        bOk = await axiosContacto.actualizar(idEmpresa, newRow);
        console.log("4 - processRowUpdate - MODI - bOk: " + bOk);
        newRow.isNew = false;
        if (bOk) {
          setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
        }
      } catch (error) {
        console.log(
          "X - processRowUpdate - MODI - ERROR: " + JSON.stringify(error)
        );
      }
    }

    if (bOk) {
      return newRow;
    } else {
      return oldRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "tipo",
      headerName: "Tipo de contacto",
      flex: 1,
      editable: true,
      type: "singleSelect",
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
      valueOptions: tipoContacto.map((item) => {
        return {
          value: item.codigo,
          label: item.descripcion,
        };
      }),
    },
    {
      field: "prefijo",
      headerName: "Prefijo",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "valor",
      headerName: "Valor de contacto",
      flex: 1,
      type: "string",
      editable: true,
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      type: "actions",
      headerAlign: "center",
      align: "center",
      headerClassName: "header--cell",
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
        height: "600px",
        width: "100%",
        overflowX: "scroll",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={(updatedRow, originalRow) =>
          processRowUpdate(updatedRow, originalRow)
        }
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, rows, setRowModesModel, volverPrimerPagina },
        }}
        sx={{
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            width: "8px",
            visibility: "visible",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
          },
          "& .css-1iyq7zh-MuiDataGrid-columnHeaders": {
            backgroundColor: "#1A76D2 !important",
          },
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 25]}
      />
    </Box>
  );
};
