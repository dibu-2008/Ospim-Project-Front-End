import './Datos.css';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// data grid
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';

import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ramos = [
    { value: "Ramo A", label: "Ramo A" },
    { value: "Ramo B", label: "Ramo B" },
    { value: "Ramo C", label: "Ramo C" },
];

// Logica de los tabs incio

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <span>{children}</span>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// Logica de la grilla contacto 
function EditToolbar(props) {
    const { setRows, rows, setRowModesModel } = props;

    const handleClick = () => {

        const maxId = Math.max(...rows.map((row) => row.id), 0);

        const newId = maxId + 1;

        const id = newId;

        setRows((oldRows) => [{ id, tipo: '', prefijo: '', valor: '', isNew: true }, ...oldRows]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'tipo' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Agregar contacto
            </Button>
        </GridToolbarContainer>
    );
}



export const Datos = () => {

    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [cuit, setCuit] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [ramo, setRamo] = useState('');
    const [tipoContacto, setTipoContacto] = useState([]);

    // Estado para los tabs
    const [value, setValue] = useState(0);

    const state = JSON.parse(localStorage.getItem('state'));

    // consulta a la api tipo de contacto
    useEffect(() => {
        const getTipoContacto = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/empresa/contacto/tipo`, {
                    headers: {
                        'Authorization': state.token,
                    }
                });
                const jsonData = await response.data;
                setTipoContacto(jsonData.map((item) => ({ ...item })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getTipoContacto();
    }, []);

    // consulta a la api datos de la empresa
    useEffect(() => {
        const getDatosEmpresa = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/empresa/contacto/`, {
                    headers: {
                        'Authorization': state.token,
                    }
                });
                const jsonData = await response.data;
                setRows(jsonData.map((item) => ({ ...item })));
                console.log(rows);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDatosEmpresa();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const OnInputChangeCuit = (e) => {
        setCuit(e.target.value);
    }

    const OnInputChangeRazonSocial = (e) => {
        setRazonSocial(e.target.value);
    }

    const OnChangeRamos = (e) => {
        setRamo(e.target.value);
    }

    // Logica de la grilla contacto
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

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }

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
    }

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const OnTipoContactoChange = (e, row, params) => {
        const selectedValue = e.target.value;

        console.log("Fila seleccionada:", row);
        console.log("Valor seleccionado:", selectedValue);
        console.log("Parametros:", params);
        console.log("Parametros:", params.cellMode);
        

        if (selectedValue === 'MAIL') {

            console.log(params.isEditable);
            params.isEditable = false;
            console.log(params.isEditable);
           
        }
        
    };


    const columns = [
        {
            field: 'tipo',
            headerName: 'Tipo de contacto',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: tipoContacto.map((item) => {
                return {
                    value: item.codigo,
                    label: item.descripcion
                }
            }),
            renderEditCell: (params) => (
                <Select
                    value={params.value}
                    onChange={(e) => OnTipoContactoChange(e, params.row, params)}
                    inputProps={{
                        name: 'tipo',
                        id: 'tipo',
                    }}
                    sx={{
                        width: '100%',
                    }}
                >
                    {
                        tipoContacto.map((item) => (
                            <MenuItem key={item.codigo} value={item.codigo}>{item.descripcion}</MenuItem>
                        ))
                    }
                </Select>
            ),
        },
        {
            field: 'prefijo',
            headerName: 'Prefijo',
            width: 100,
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            editable: true,
        },
        {
            field: 'valor',
            headerName: 'Valor de contacto',
            width: 200,
            type: (params) => (params.row.tipo === 'email' ? 'email' : 'number'),
            editable: true,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            type: 'actions',
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
        }
    ]

    return (
        <div
            style={{
                margin: '50px auto',
                width: '70%',
            }}
        >
            <h1>Mis datos empresas</h1>

            <form
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-around',
                    alignContent: 'center',
                    margin: '50px auto',
                }}
            >
                <TextField
                    type="text"
                    name="cuit"
                    value={cuit}
                    onChange={OnInputChangeCuit}
                    autoComplete="off"
                    label="CUIT"
                />
                <TextField
                    type="text"
                    name="razonSocial"
                    value={razonSocial}
                    onChange={OnInputChangeRazonSocial}
                    autoComplete="off"
                    label="Razón Social"
                />
                <Box sx={{
                    textAlign: 'left',
                    color: '#606060',
                    width: '200px',
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Seleccionar ramo</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={ramo}
                            label="Seleccionar ramo"
                            onChange={OnChangeRamos}
                        >
                            {
                                ramos.map((option, index) => (
                                    <MenuItem key={index} value={option.value}>{option.value}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Button
                    variant='contained'
                    sx={{

                    }}
                    type='submit'
                >Guardar</Button>
            </form>
            {/* Tabs */}
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Contacto" {...a11yProps(0)} />
                        <Tab label="Domicilio" {...a11yProps(1)} />

                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>

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
                    />

                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    Item Two
                </CustomTabPanel>

            </Box>

        </div>
    )
}
