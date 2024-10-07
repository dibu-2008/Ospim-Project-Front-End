import { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { Box, Checkbox } from '@mui/material';
import formatter from '@/common/formatter';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';
import './Grilla.css';

export const GrillaActas = ({ actas, selectedActas, setSelectedActas }) => {
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const handleSelectionChange = (id) => {
    setSelectedActas((prevSelected) => {
      console.log(prevSelected);
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });

  };

  return (
    <Box
      style={{ height: 400 }}
      sx={{
        width: '100%',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#1d0a83',
          color: 'white',
        },
      }}
    >
      <DataGrid
        rows={actas ? actas : []}
        columns={[
          {
            field: 'selection',
            headerName: '',
            renderCell: (params) => (
              <Checkbox
                checked={selectedActas.includes(params.id)}
                onChange={() => handleSelectionChange(params.id)}
              />
            ),
            headerCheckboxSelection: true,
            checkboxSelection: true,
            flex: 0.25,
          },
          { field: 'estadoDeuda', headerName: 'Estado', flex: 0.5 },
          {
            field: 'nroActa',
            headerName: 'Nro. Acta',
            flex: 0.5,
          },
          {
            field: 'fechaActa',
            headerName: 'Fecha Acta',
            flex: 0.8,
            valueFormatter: (params) =>
              params.value ? formatter.dateString(params.value) : '',
          },
          {
            field: 'importe',
            headerName: 'Importe Acta',
            align: 'right',
            flex: 1,
            valueFormatter: (params) =>
              params.value ? formatter.currencyString(params.value) : '',
          },
          {
            field: 'intereses',
            headerName: 'Intereses',
            align: 'right',
            flex: 1,
            valueFormatter: (params) =>
              params.value ? formatter.currencyString(params.value) : '',
          },
          {
            field: 'importeTotal',
            headerName: 'Importe Total',
            align: 'right',
            flex: 1,
            valueFormatter: (params) =>
              params.value ? formatter.currencyString(params.value) : '',
          },
        ]}
        getRowClassName={(params) =>
          actas.indexOf(params.row) % 2 === 0 ? 'even' : ''
        }
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={pageSizeOptions}
        components={{
          Toolbar: () => (
            <GridToolbarContainer>
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarExport />
            </GridToolbarContainer>
          ),
        }}
        localeText={{
          toolbarColumns: 'Columnas',
          toolbarFilters: 'Filtros',
          toolbarExport: 'Exportar',
        }}
      />
    </Box>
  );
};
