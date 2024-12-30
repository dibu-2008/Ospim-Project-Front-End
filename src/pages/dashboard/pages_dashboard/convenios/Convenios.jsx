import * as locales from '@mui/material/locale';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  createTheme,
} from '@mui/material';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import './Convenios.css';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { UserContext } from '@/context/UserContext';
import AddIcon from '@mui/icons-material/Add';
import localStorageService from '@/components/localStorage/localStorageService';
import { width } from '@mui/system';

// Datos de ejemplo para el DataGrid
const conveniosData = [
  {
    id: 1,
    cuit: 12345678910,
    razon_social: 'COCOBONGO',
    fecha: 'MM/AAAA',
    numero: 1,
    deuda: '20.000,00',
    interes: '100,00',
    saldo: '20.100,00',
    total: '20.100,00',
    cuotas: 3,
    medioPago: 'Cheque',
    cheque: '',
    estado: 'Pendiente...',
  },
  {
    id: 2,
    cuit: 12345678910,
    razon_social: 'COCOBONGO',
    fecha: 'MM/AAAA',
    numero: 2,
    deuda: '30.000,00',
    interes: '3.000,00',
    saldo: '33.000,00',
    total: '33.000,00',
    cuotas: 2,
    medioPago: 'Cheque',
    cheque: '123 / 567',
    estado: 'Cheque Recibido',
  },
  {
    id: 3,
    cuit: 12345678910,
    razon_social: 'COCOBONGO',
    fecha: 'MM/AAAA',
    numero: 3,
    deuda: '120.000,00',
    interes: '20.000,00',
    saldo: '140.000,00',
    total: '140.000,00',
    cuotas: 1,
    medioPago: 'Cheque',
    cheque: '',
    estado: 'Cerrado',
  },
];

const crearNuevoRegistro = (props) => {
  const {
    setRows,
    rows,
    setRowModesModel,
    volverPrimerPagina,
    showQuickFilter,
    themeWithLocale,
  } = props;

  const altaHandleClick = () => {
    if (rows) {
      const editRow = rows.find((row) => !row.id);
      if (typeof editRow === 'undefined' || editRow.id) {
        const newReg = { descripcion: '' };
        volverPrimerPagina();
        setRows((oldRows) => [newReg, ...oldRows]);
        setRowModesModel((oldModel) => ({
          [0]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
          ...oldModel,
        }));
      }
    }
  };

  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button color="primary" startIcon={<AddIcon />} onClick={altaHandleClick}>
        Nuevo Registro
      </Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
};

export const Convenios = () => {
  const [locale, setLocale] = useState('esES');
  const [rows, setRows] = useState([]);
  const [rol, setRol] = useState([]);
  const [estado, setEstado] = useState('Todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [cuit, setCuit] = useState('');

  const [rowModesModel, setRowModesModel] = useState({});
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  useEffect(() => {
    setRol(localStorageService.getRol());
  }, []);

  const columnas = [
    { field: 'cuit', headerName: 'CUIT', width: 120 },
    { field: 'razon_social', headerName: 'Razon Social', width: 120 },
    { field: 'fecha', headerName: 'Fecha', width: 120 },
    { field: 'numero', headerName: 'N°', width: 40, align: 'right' },
    { field: 'deuda', headerName: 'Deuda Orig', width: 120, align: 'right' },
    {
      field: 'interes',
      headerName: 'Intereses Financ.',
      width: 120,
      align: 'right',
    },
    {
      field: 'saldo',
      headerName: 'Sdo a Favor utilizado',
      width: 120,
      align: 'right',
    },
    {
      field: 'total',
      headerName: 'Total Convenio',
      width: 150,
      align: 'right',
    },
    { field: 'cuotas', headerName: 'Cant. Cuotas', width: 80, align: 'right' },
    { field: 'medioPago', headerName: 'Medio Pago', width: 120 },
    { field: 'cheque', headerName: 'N° Cheque', width: 120 },
    { field: 'estado', headerName: 'Estado', width: 150 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 100,
      renderCell: ({ row }) => {
        const isInEditMode =
          rowModesModel[rows.indexOf(row)]?.mode === GridRowModes.Edit;
        if (rol !== 'TESORERIA') {
          // Mostrar solo el botón de descarga si el rol no es TESORERIA
          return (
            <IconButton color="primary">
              <DownloadIcon />
            </IconButton>
          );
        }

        if (isInEditMode && rol === 'TESORERIA') {
          return (
            <>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Guardar"
                sx={{ color: 'primary.main' }}
                onClick={() => handleSaveClick(row)}
              />
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancelar"
                className="textPrimary"
                onClick={() => handleCancelClick(row)}
                color="inherit"
              />
            </>
          );
        } else {
          return (
            <>
              {rol === 'TESORERIA' && (
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Editar"
                  className="textPrimary"
                  onClick={() => handleEditClick(row)}
                  color="inherit"
                />
              )}
              <IconButton color="primary">
                <DownloadIcon />
              </IconButton>
            </>
          );
        }
      },
      sortable: false,
    },
  ];

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
  const handleCancelClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    });
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };
  const handleBuscar = () => {
    console.log('Buscando con los siguientes filtros:');
    console.log('Estado:', estado);
    console.log('Fecha Desde:', fechaDesde);
    console.log('Fecha Hasta:', fechaHasta);
    console.log('CUIT:', cuit);
    // Aquí podrías llamar a una API, filtrar datos, etc.
  };
  return (
    <Box>
      {/* Título */}
      <div className="convenios_container">
        <h1 className="mt-1em">CONVENIOS</h1>

        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }} className="mt-1em">
          <TextField
            label="Estado"
            select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Cheque Recibido">Cheque Recibido</MenuItem>
            <MenuItem value="Cerrado">Cerrado</MenuItem>
          </TextField>

          <TextField
            label="Fecha desde"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            sx={{ width: 180 }}
          />

          <TextField
            label="Fecha hasta"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            sx={{ width: 180 }}
          />

          {(rol === 'USUARIO INTERNO' ||
            rol === 'TESORERIA' ||
            rol === 'EMPLEADOR') && (
            <TextField
              label="CUIT"
              type="number"
              InputLabelProps={{ shrink: true }}
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              sx={{ width: 180 }}
            />
          )}

          <Button variant="contained" color="primary" onClick={handleBuscar}>
            Buscar
          </Button>
          <Button variant="contained" color="primary">
            Exportar
          </Button>
        </Box>

        {/* DataGrid */}
        <Box sx={{ height: 450, width: '100%' }}>
          <ThemeProvider theme={themeWithLocale}>
            <StripedDataGrid
              rows={conveniosData}
              columns={columnas}
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
                toolbar: {
                  setRows,
                  rows,
                  setRowModesModel,
                  volverPrimerPagina,
                  showQuickFilter: true,
                  themeWithLocale,
                },
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
                  color: 'white',
                },
              }}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={pageSizeOptions}
            />
          </ThemeProvider>
        </Box>
      </div>
    </Box>
  );
};
