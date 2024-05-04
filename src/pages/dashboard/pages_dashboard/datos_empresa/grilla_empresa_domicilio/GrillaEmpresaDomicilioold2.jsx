import * as locales from '@mui/material/locale';
import { useState, useEffect, useMemo } from "react";
import { MenuItem, Select } from '@mui/material';
import {
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { axiosDomicilio, obtenerLocalidades } from './GrillaEmpresaDomicilioApi';
import { StripedDataGrid, dataGridStyle } from "@/common/dataGridStyle";
import Swal from 'sweetalert2';
import { onChange } from 'react-toastify/dist/core/store';

const isNotNull = (value) => (value !== null && value !== '' ? value : '');
// Traerme las etiquetas del dom que tengas la clase .MuiDataGrid-cell--editable
const crearNuevoRegistro = (props) => {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const altaHandleClick = () => {
    const newReg =       {
			id:'',
			tipo: '',
			provincia:{
				id:'',
				descripcion: ''
			},
			localidad: {
				provinciaId:'',
				id:'',
				descripcion:''
			},
			calle: '',
			piso: '',
			dpto: '',
			oficina: '',
			cp: '',
			planta: '',
			valor: '',
			isNew: true,
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
      <GridToolbar showQuickFilter={props.showQuickFilter} />
      <Button color="primary" startIcon={<AddIcon />} onClick={altaHandleClick}>
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
};


export const GrillaEmpresaDomicilio = ({ idEmpresa, rows, setRows }) => {
	console.log(rows)
  const [locale, setLocale] = useState('esES');
  const [rowModesModel, setRowModesModel] = useState({});
	const [provincias, setProvincias] = useState([])
	const [tipoDomicilio, setTipoDomicilio] = useState([])
	//const [localidadesXProvincia, setLocalidadesXProvincia] = useState({})
	const [localidades, setLocalidades] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 50,
    page: 0,
  });


	useEffect( () => {
		async function cargarDatos() {
			await getRowsDomicilio()
			await getProvincias()
			await getTipoDomicilio()
		}
		cargarDatos()
		console.log(rows)
		console.log(provincias)
	},[])

	const getRowsDomicilio = async () => {
    const response = await axiosDomicilio.obtenerDomicilios(idEmpresa);
    setRows(response);
    //getDatosLocalidad(response.map((item) => ({ ...item })));
  };

	const getDatosLocalidad = async (provinciaId) => {
		const localidades = await axiosDomicilio.obtenerLocalidades(provinciaId);
		setLocalidades(localidades)
	}

	const getProvincias = async () => {
		const response = await axiosDomicilio.obtenerProvincias();
		console.log(provincias)
    setProvincias(response);
	}
/*
	const getLocalidadesXProvincia =  ()=> {
		const objLocXProv = {}
		provincias.forEach(async (provincia)  => {
			const localidades = await obtenerLocalidades(provincia.id)
			objLocXProv[provincia.id] = localidades
		})
		setLocalidadesXProvincia(objLocXProv)
		console.log(objLocXProv)
	}
*/
  const getTipoDomicilio = async () => {
    const response = await axiosDomicilio.obtenerTipo();
    setTipoDomicilio(response.map((item) => ({ ...item })));
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
            const bBajaOk = await axiosAjustes.eliminar(row.id);
            if (bBajaOk) setRows(rows.filter((rowAux) => rowAux.id !== row.id));
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarAjuste:', error);
      }
    };

    showSwalConfirm();
  };

  const handleEditClick = (row) => () => {
    console.log('handleEditClick - row:');
    console.log(row);
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

    const editedRow = rows.find((reg) => reg.id === row.id);
    if (!editedRow.id) {
      setRows(rows.filter((reg) => reg.id !== row.id));
    }
  };

//const actualizarDatosLocalidad = async (provincia) => {
//	const provinciaABuscar = provincias.find(element => element.descripcion =provincia)
//	console.log(provinciaABuscar)
//	const localidades = await obtenerLocalidades(provinciaABuscar.id)
//	setLocalidades(localidades)
//
//} 

  const processRowUpdate = async (newRow, oldRow) => {
    console.log('processRowUpdate - INIT');
    let bOk = false;

    if (!newRow.id) {
      try {
        console.log(newRow);
        const data = await axiosDomicilio.crear(idEmpresa, newRow);
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
        console.log(newRow)
        bOk = await axiosDomicilio.actualizar(idEmpresa, newRow);
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
			//value:tipo
      //getOptionValue: (params) => params.value.codigo,
      //getOptionLabel: (params) => params.value.descripcion,
      //valueOptions: tipoDomicilio,
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
			valueOptions: provincias.map(provincia => provincia.descripcion),
			valueGetter: (params) => params.row.provincia.descripcion,
			//onChange:(async params =>await actualizarDatosLocalidad(params.row.value))
      //getOptionValue: (params) => params.value.id,
      //getOptionLabel: (params) => console.log(params),//params.value.descripcion,
      /*renderEditCell: (params) => {
        actualizarDatosLocalidad(params.value);
        return (
          <Select
            value={params.value}
            onChange={(e) => {
              // Limpiar el valor de la localidad
              params.api.setEditCellValue({
                id: params.id,
                field: 'localidadId',
                value: '',
              });
              params.api.setEditCellValue(
                {
                  id: params.id,
                  field: 'provinciaId',
                  value: e.target.value,
                },
                e.target.value,
              );

              console.log('params:', params);
              console.log(params.row.localidadId);
              params.row.localidad = '';
            }}
            sx={{ width: 200 }}
          >
            {provincias.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.descripcion}
                </MenuItem>
              );
            })}
          </Select>
        );
      },*/
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
			valueGetter: (params) => params.row.localidad.descripcion,
      //valueOptions: localidadesList,
      //valueOptions: ({ row }) => {
      //  var options = localidades.filter((item) => {
      //    return item.provinciaId == row.provinciaId;
      //  });
      //  return options;
      //},
      //getOptionValue: (params) => params.value.id,
     // getOptionLabel: (params) => params.value.descripcion,
      renderEditCell: (params) => {
        // limpiar el campo localidadId cuando se cambia la provincia
        var datos = localidades.filter((item) => {
          return item.provinciaId == params.row.provincia.id;
        });
        return (
          <Select
            value={params.value}
            onChange={(e) => {
              params.api.setEditCellValue(
                {
                  id: params.id,
                  field: 'localidad',
                  value: e.target.value,
                },
                e.target.value,
              );
            }}
            sx={{ width: 220 }}
          >
            {datos.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.descripcion}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
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
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
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
	]

	return (
    <div>
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
