import { useEffect, useState, useMemo, useContext } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import {
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
  GridToolbar,
} from '@mui/x-data-grid';
import formatter from '@/common/formatter';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import * as locales from '@mui/material/locale';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { axiosDDJJEmpleado } from './DDJJConsultaEmpleadoApi';
import { consultarAportesDDJJ } from '@/common/api/AportesApi';
import dayjs from 'dayjs';
import { UserContext } from '@/context/userContext';
import { axiosDDJJ } from '../mis_ddjj/grilla/MisDDJJConsultaGrillaApi';

function DDJJColumnaAporteGet(ddjjResponse) {
  //toma todas las ddjj de la consulta de "Mis DDJJ" y arma "vector de Columnas Aportes"
  //Ejemplo: ['UOMACU', 'ART46', 'UOMASC']
  let vecAportes = ddjjResponse.map((item) => item.aportes).flat();
  let colAportes = vecAportes.reduce((acc, item) => {
    if (!acc.includes(item.codigo)) {
      acc.push(item.codigo);
    }
    return acc;
  }, []);
  return colAportes;
}

function ddjjTotalesAportes(ddjj, colAportes) {
  //toma una ddjj de la consulta de "Mis DDJJ" y arma "vector de Columnas Totales por Aportes"

  let vecAportes = ddjj.aportes;

  let vecAportesConTotales = [];
  colAportes.forEach((element) => {
    vecAportesConTotales.push({ codigo: element, importe: 0 });
  });

  vecAportes.forEach((aporte) => {
    vecAportesConTotales.forEach((total) => {
      if (total.codigo == aporte.codigo) {
        total.importe = total.importe + aporte.importe;
      }
    });
  });
  return vecAportesConTotales;
}

function castearDDJJ(ddjjResponse) {
  let colAportes = DDJJColumnaAporteGet(ddjjResponse);
  ddjjResponse.forEach((dj) => {
    let colAportesConTotales = ddjjTotalesAportes(dj, colAportes);

    colAportesConTotales.forEach((regTot) => {
      dj['total' + regTot.codigo] = regTot.importe;
    });
  });
  return ddjjResponse;
}

const CustomToolbar = (props) => {
  const { showQuickFilter, themeWithLocale } = props;
  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button color="primary"></Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
};

export const DDJJConsultaEmpleado = () => {
  const ahora = dayjs().startOf('month');
  const ahoraMenosUnAnio = ahora.add(-11, 'month');
  const [fromDate, setFromDate] = useState(ahoraMenosUnAnio);
  const [toDate, setToDate] = useState(ahora);

  const [showCuitRazonSocial, setShowCuitRazonSocial] = useState(true);
  const [rowModesModel, setRowModesModel] = useState({});
  const [locale, setLocale] = useState('esES');
  const [cuit, setCuit] = useState('');
  const [rows, setRows] = useState([]);
  const [columnas, setColumnas] = useState([]);

  const [vecAportes, setVecAportes] = useState({});
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  let colAportes = [];

  useEffect(() => {
    buscarDDJJ();
  }, []);

  useEffect(() => {
    const ObtenerVecAportes = async () => {
      const data = await consultarAportesDDJJ();
      setVecAportes(data);
    };
    ObtenerVecAportes();
  }, []);

  const getAporteDescrip = (codigo) => {
    if (vecAportes && vecAportes.find) {
      let reg = vecAportes.find((aporte) => aporte.codigo == codigo);
      if (!reg) return codigo;
      return reg.descripcion;
    }
  };

  const declaracionJuradasImpresion = async (empresaId, idDDJJ) => {
    await axiosDDJJ.imprimir(empresaId, idDDJJ);
  };

  const buscarDDJJ = async () => {
    // Busqueda por rango de periodo
    let desde = null;
    if (fromDate !== null) {
      desde = fromDate.startOf('month').format('YYYY-MM-DD');
    }
    let hasta = null;
    if (toDate !== null) {
      hasta = toDate.startOf('month').format('YYYY-MM-DD');
    }

    let cuitFlt = null;
    if (cuit != '') {
      cuitFlt = cuit;
      setShowCuitRazonSocial(false);
    } else {
      setShowCuitRazonSocial(true);
    }

    const data = await axiosDDJJEmpleado.consultarFiltrado(
      desde,
      hasta,
      cuitFlt,
    );
    const newRows = castearDDJJ(data);
    const newColumns = getColumnas(newRows);

    setRows(newRows);
    setColumnas(newColumns);
  };

  const getColumnas = (rowsGrilla) => {
    const columns = [
      {
        field: 'periodo',
        headerName: 'Periodo',
        flex: 1.5,
        editable: false,
        type: 'date',
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'header--cell',
        valueFormatter: (params) => {
          return formatter.periodo(params.value);
        },
      },
    ];

    if (showCuitRazonSocial) {
      columns.push(
        {
          field: 'cuit',
          headerName: 'Cuit',
          flex: 1.5,
          editable: false,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header--cell',
        },
        {
          field: 'razonSocial',
          headerName: 'Razon Social',
          flex: 2,
          editable: false,
          headerAlign: 'center',
          align: 'center',
          headerClassName: 'header--cell',
        },
      );
    }
    columns.push({
      field: 'secuencia',
      headerName: 'Numero',
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueGetter: (params) => {
        // Si secuencia es 0 es "Original" sino es "Rectificativa"+secuencia
        if (params.value === null) {
          return 'Pendiente';
        } else if (params.value === 0) {
          return 'Original';
        } else {
          return 'Rectif. ' + params.value;
        }
      },
    });

    colAportes = DDJJColumnaAporteGet(rowsGrilla);

    colAportes.forEach((elem) => {
      columns.push({
        field: 'total' + elem,
        headerName: getAporteDescrip(elem),
        flex: 1,
        editable: false,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'header--cell',
        valueFormatter: (params) =>
          formatter.currency.format(params.value || 0),
      });
    });

    columns.push({
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
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<LocalPrintshopIcon />}
            label="Print"
            color="inherit"
            onClick={() => {
              console.log(' **** row: ', row);
              return declaracionJuradasImpresion(row.empresaId, row.id);
            }}
          />,
        ];
      },
    });

    return columns;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <div className="declaraciones_juradas_container">
      <h1
        style={{
          marginBottom: '50px',
        }}
      >
        Consulta de Declaraciones Juradas
      </h1>
      <div
        className="mis_declaraciones_juradas_container"
        style={{
          marginBottom: '50px',
        }}
      >
        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label={'Periodo desde'}
              views={['month', 'year']}
              onChange={(oValue) => setFromDate(oValue)}
              value={fromDate}
            />
          </DemoContainer>

          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label={'Periodo hasta'}
              views={['month', 'year']}
              onChange={(oValue) => setToDate(oValue)}
              value={toDate}
            />
          </DemoContainer>
          <div
            style={{
              height: '100px',
              width: '250px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '8px',
            }}
          >
            <TextField
              id="outlined-basic"
              label="Cuit"
              variant="outlined"
              value={cuit}
              //onChange={handleChangeCuil}
              onChange={(oValue) => setCuit(oValue.target.value)}
            />
          </div>
        </Stack>

        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button onClick={buscarDDJJ} variant="contained">
            Consultar
          </Button>
        </Stack>
      </div>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Box
          sx={{
            margin: '0 auto',
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
              localeText={dataGridStyle.toolbarText}
              slots={{ toolbar: CustomToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  showColumnMenu: true,
                  themeWithLocale,
                },
              }}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={pageSizeOptions}
            />
          </ThemeProvider>
        </Box>
      </Stack>
    </div>
  );
};
