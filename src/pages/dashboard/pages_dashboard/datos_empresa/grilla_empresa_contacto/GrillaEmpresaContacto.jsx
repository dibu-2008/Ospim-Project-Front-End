import { useState, useEffect, useContext } from 'react';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CancelIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { axiosContacto } from './GrillaEmpresaContactoApi';
import Swal from 'sweetalert2';
import { UserContext } from '@/context/userContext';

function EditToolbar(props) {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const handleClick = () => {
    const newReg = {
      tipo: '',
      prefijo: '',
      valor: '',
    };

    volverPrimerPagina();

    setRows((oldRows) => [newReg, ...oldRows]);
    setRowModesModel((oldModel) => ({
      [0]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
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

export const GrillaEmpresaContacto = ({ idEmpresa, rows, setRows }) => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [tipoContacto, setTipoContacto] = useState([]);
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  useEffect(() => {
    const getTipoContacto = async () => {
      const tipo = await axiosContacto.obtenerTipo();
      setTipoContacto(tipo);
    };
    getTipoContacto();
  }, []);

  useEffect(() => {
    const getDatosEmpresa = async () => {
      console.log('** getDatosEmpresa - idEmpresa: ' + idEmpresa);
      const datosEmpresa = await axiosContacto.obtenerDatosEmpresa(idEmpresa);
      setRows(datosEmpresa);
    };
    getDatosEmpresa();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: { mode: GridRowModes.Edit },
    });
  };

  const handleSaveClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: { mode: GridRowModes.View },
    });
  };

  const handleDeleteClick = (row) => async () => {
    const showSwalConfirm = async () => {
      try {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1A76D2',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Si, bórralo!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const bBajaOk = await axiosContacto.eliminar(idEmpresa, row.id);
            if (bBajaOk) setRows(rows.filter((rowAux) => rowAux.id !== row.id));
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarContacto:', error);
      }
    };

    showSwalConfirm();
  };

  const handleCancelClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    });

    const editedRow = rows.find((reg) => reg.id === row.id);
    if (!editedRow.id) {
      setRows(rows.filter((reg) => reg.id !== row.id));
    }
  };

  const processRowUpdate = async (newRow, oldRow) => {
    let bOk = false;
    if (!newRow.id) {
      try {
        const data = await axiosContacto.crear(idEmpresa, newRow);
        if (data && data.id) {
          newRow.id = data.id;
          bOk = true;
          const newRows = rows.map((row) => (!row.id ? newRow : row));
          setRows(newRows);
        } else {
          console.log('alta sin ID generado');
        }
      } catch (error) {
        console.log(
          'X - processRowUpdate - ALTA - ERROR: ' + JSON.stringify(error),
        );
      }
    } else {
      try {
        bOk = await axiosContacto.actualizar(idEmpresa, newRow);
        console.log('4 - processRowUpdate - MODI - bOk: ' + bOk);
        if (bOk) {
          const rowsNew = rows.map((row) =>
            row.id === newRow.id ? newRow : row,
          );
          setRows(rowsNew);
        }
      } catch (error) {
        console.log(
          'X - processRowUpdate - MODI - ERROR: ' + JSON.stringify(error),
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
      field: 'tipo',
      headerName: 'Tipo de contacto',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: tipoContacto.map((item) => {
        return {
          value: item.codigo,
          label: item.descripcion,
        };
      }),
    },
    {
      field: 'prefijo',
      headerName: 'Prefijo',
      flex: 1,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'valor',
      headerName: 'Valor de contacto',
      flex: 1,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      type: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      getActions: ({ row }) => {
        const isInEditMode =
          rowModesModel[rows.indexOf(row)]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(row)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(row)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(row)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: '600px',
        width: '100%',
        overflowX: 'scroll',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => rows.indexOf(row)}
        getRowClassName={(params) =>
          rows.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
        }
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
          '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
            width: '8px',
            visibility: 'visible',
          },
          '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
          },
          '& .css-1iyq7zh-MuiDataGrid-columnHeaders': {
            backgroundColor: '#1A76D2 !important',
          },
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={pageSizeOptions}
      />
    </Box>
  );
};
