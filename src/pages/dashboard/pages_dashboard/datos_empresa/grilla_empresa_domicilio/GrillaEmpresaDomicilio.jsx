import * as locales from '@mui/material/locale';
import { useState, useEffect, useMemo } from 'react';
import { MenuItem, Select } from '@mui/material';
import {
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  axiosDomicilio,
  adaptadorDomicilioGrilla,
  adaptadorRegistroCompanyGrilla,
} from './GrillaEmpresaDomicilioApi';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { width } from '@mui/system';
//const isNotNull = (value) => (value !== null && value !== '' ? value : '');

let isOnEditMode = false;
const crearNuevoRegistro = (props) => {
  const { setRows, setRowModesModel, volverPrimerPagina } = props;
  const altaHandleClick = () => {
    if (!isOnEditMode) {
      const newReg = {
        tipo: '',
        provincia: {
          id: '',
          descripcion: '',
        },
        localidad: {
          provinciaId: '',
          id: '',
          descripcion: '',
        },
        calle: '',
        calleNro: '',
        piso: '',
        depto: '',
        oficina: '',
        cp: '',
        planta: '',
      };
      volverPrimerPagina();
      setRows((oldRows) => [newReg, ...oldRows]);
      setRowModesModel((oldModel) => ({
        [0]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        ...oldModel,
      }));
    }
    isOnEditMode = true;
  };
  return (
    <GridToolbarContainer>
      <GridToolbar showQuickFilter={props.showQuickFilter} />
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={altaHandleClick}
        disabled={isOnEditMode}
      >
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
};

export const GrillaEmpresaDomicilio = ({ idEmpresa, rows, setRows }) => {
  const [locale, setLocale] = useState('esES');
  const [rowModesModel, setRowModesModel] = useState({});
  const [provincias, setProvincias] = useState([]);
  const [provinciasValueOptions, setProvinciasValueOptions] = useState([]);
  const [tipoDomicilio, setTipoDomicilio] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [idRow, setIdRow] = useState(1);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 50,
    page: 0,
  });

  useEffect(() => {
    async function cargarDatos() {
      if (idEmpresa !== 'PC') {
        await getRowsDomicilio();
      }
      await getProvincias();
      await getTipoDomicilio();
      console.log(rows);
    }
    cargarDatos();
  }, []);

  const getRowsDomicilio = async () => {
    const data = await axiosDomicilio.obtenerDomicilios(idEmpresa);
    setRows(data);
  };

  const getDatosLocalidad = async (provDescrip) => {
    const prov = provincias.find((prov) => prov?.descripcion == provDescrip);
    const localidades = await axiosDomicilio.obtenerLocalidades(prov.id);
    setLocalidades(localidades);
  };

  const getProvincias = async () => {
    const response = await axiosDomicilio.obtenerProvincias();
    setProvincias(response);
    const PRO_V_O = response.map((prov) => prov?.descripcion);
    console.log(PRO_V_O);
    setProvinciasValueOptions(PRO_V_O);
  };

  const getTipoDomicilio = async () => {
    const response = await axiosDomicilio.obtenerTipo();
    setTipoDomicilio(response.map((item) => item.codigo));
  };

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleDeleteClick = (row) => async () => {
    console.log('handleDeleteClick - row.id:', row.id);
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
          console.log(row.id);
          if (result.isConfirmed && idEmpresa !== 'PC') {
            const bBajaOk = await axiosDomicilio.eliminar(idEmpresa, row.id);
            if (bBajaOk) setRows(rows.filter((rowAux) => rowAux.id !== row.id));
          } else {
            setRows(rows.filter((rowAux) => rowAux.id !== row.id));
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarAjuste:', error);
      }
    };

    showSwalConfirm();
  };
  const handleEditClick = (row) => () => {
    if (!isOnEditMode) {
      isOnEditMode = true;
      getDatosLocalidad(row.provincia?.descripcion);
      setRowModesModel({
        ...rowModesModel,
        [rows.indexOf(row)]: { mode: GridRowModes.Edit },
      });
    } else {
      toast.info('Solo se puede editar de a un registro a la vez');
    }
  };
  const handleSaveClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: { mode: GridRowModes.View },
    });
    isOnEditMode = false;
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
    isOnEditMode = false;
  };
  const processRowUpdate = async (newRow, oldRow) => {
    console.log('processRowUpdate - INIT - newRow:', newRow);
    let bOk = false;
    console.log(idEmpresa);
    if (!newRow.id) {
      try {
        if (idEmpresa !== 'PC') {
          //Condicion para la grilla de registrar empresa
          const data = await axiosDomicilio.crear(idEmpresa, newRow);
          if (data && data.id) {
            newRow.id = data.id;
            bOk = true;
            console.log(newRow);
            newRow = await adaptadorDomicilioGrilla(newRow);
            console.log(newRow);
            const newRows = rows.map((row) => (!row.id ? newRow : row));
            setRows(newRows);
          } else {
            console.log('alta sin ID generado');
          }
        } else {
          bOk = true;
          console.log(newRow);
          newRow = await adaptadorRegistroCompanyGrilla(newRow);
          newRow.id = idRow;
          setIdRow(idRow + 1);
          console.log(newRow);
          const newRows = rows.map((row) => (!row.id ? newRow : row));
          setRows(newRows);
        }
      } catch (error) {
        console.log(
          'X - processRowUpdate - ALTA - ERROR: ' + JSON.stringify(error),
        );
      }
    } else {
      if (idEmpresa !== 'PC') {
        try {
          bOk = await axiosDomicilio.actualizar(idEmpresa, newRow);
          console.log('4 - processRowUpdate - MODI - bOk: ' + bOk);
          console.log('** processRowUpdate - MODI - oldRow: ', oldRow);
          console.log('** processRowUpdate - MODI - newRow: ', newRow);
          if (bOk) {
            newRow = await adaptadorDomicilioGrilla(newRow);
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
      } else {
        bOk = true;
        newRow = await adaptadorRegistroCompanyGrilla(newRow);
        const rowsNew = rows.map((row) =>
          row.id === newRow.id ? newRow : row,
        );
        setRows(rowsNew);
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

  const columnas = [
    {
      field: 'tipo',
      headerName: 'Tipo',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: tipoDomicilio,
    },
    {
      field: 'provincia',
      headerName: 'Provincia',
      flex: 2,
      editable: true,
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: provinciasValueOptions,
      valueGetter: (params) => params.row.provincia?.descripcion,
      renderEditCell: (params) => {
        return (
          <Select
            value={params.value}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'provincia',
                value: e.target.value,
              });
              getDatosLocalidad(e.target.value);
            }}
            sx={{ width: 200 }}
          >
            {provinciasValueOptions.map((item) => {
              return (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: 'localidad',
      headerName: 'Localidad',
      flex: 2,
      editable: true,
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: localidades.map((localidad) => localidad.descripcion),
      valueGetter: (params) =>
        params.row.localidad.descripcion
          ? params.row.localidad.descripcion
          : params.row.localidad,
      //valueGetter: (params) => params.row.localidad.descripcion
    },
    {
      field: 'calle',
      headerName: 'Calle',
      flex: 2,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'calleNro',
      headerName: 'Altura',
      flex: 2,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'piso',
      headerName: 'Piso',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'depto',
      headerName: 'Depto',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'oficina',
      headerName: 'Oficina',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'cp',
      headerName: 'CP',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'planta',
      headerName: 'Planta',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      flex: 2,
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
              label="Guardar"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(row)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              className="textPrimary"
              onClick={handleCancelClick(row)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            className="textPrimary"
            onClick={handleEditClick(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Eliminar"
            className="textPrimary"
            onClick={handleDeleteClick(row)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div style={{ width: idEmpresa === 'PC' ? '100%' : 'auto' }}>
      <Box
        sx={{
          height: '600px',
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <ThemeProvider theme={themeWithLocale}>
          <StripedDataGrid
            rows={rows}
            columns={columnas}
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
            localeText={dataGridStyle.toolbarText}
            slots={{ toolbar: crearNuevoRegistro }}
            slotProps={{
              toolbar: { setRows, rows, setRowModesModel, volverPrimerPagina },
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 75, 100]}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
};
