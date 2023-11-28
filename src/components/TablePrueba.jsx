import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
} from '@mui/x-data-grid-generator';


const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
    return randomArrayItem(roles);
};

const initialRows = [

];

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        const newRecord = {
            id,
            tipo: '',
            provincia: '',
            localidad: '',
            calle: '',
            piso: '',
            depto: '',
            oficina: '',
            cp: '',
            planta: '',
            isNew: true,
        };
        setRows((oldRows) => [...oldRows, newRecord]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Agregar Domicilio Fiscal
            </Button>
        </GridToolbarContainer>
    );
}

export default function FullFeaturedCrudGrid() {
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState({});
    const [provincias, setProvincias] = useState([]);
    const [localidades_2, setLocalidades] = useState([]);
    const [selectedProvincia, setSelectedProvincia] = useState('chubut');

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

    const handleProvinciaChange = (id) => (event) => {
        const newProvinciaValue = event.target.value;
        setSelectedProvincia(newProvinciaValue);
        console.log(`Provincia seleccionada: ${newProvinciaValue}`);
        getAllLocalidades();
    };


    const tipos = ['Fiscal', 'Real', 'Legal'];


    const getAllProvincias = async () => {

        try {

            const provinciasResponse = await axios.get('https://apis.datos.gob.ar/georef/api/provincias')

            const nombresProvincias = [];

            provinciasResponse.data.provincias.forEach((prov) => {

                nombresProvincias.push(prov.nombre)

            })

            setProvincias(nombresProvincias);

        } catch (error) {
            console.error('Error al obtener provincias:', error);
        }
    }

    const getAllLocalidades = async () => {

        try {

            const nombresLocalidades = [];

            const localidades = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${selectedProvincia}&campos=nombre&max=1000`)

            const uniqueLocalidades = Array.from(new Set(localidades.data.localidades.map(local => local.nombre)));

            nombresLocalidades.push(...uniqueLocalidades);

            const uniqueNombresLocalidades = Array.from(new Set(nombresLocalidades));

            setLocalidades(uniqueNombresLocalidades);

        } catch (error) {
            console.error('Error al obtener localidades', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getAllProvincias();
            
            //console.log('Provincias:', selectedProvincia);

            if (selectedProvincia) {
                await getAllLocalidades();
                
            }
        };
    
        fetchData();
       // console.log(rows);
    }, [selectedProvincia]);


    const columns = [
        {
            field: 'tipo',
            headerName: 'Tipo',
            width: 120,
            editable: true,
            type: 'singleSelect',
            valueOptions: tipos,
        },
        {
            field: 'provincia',
            headerName: 'Provincia',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: provincias,
            cellEditorParams: function cellEditorParams(params) {
                return {
                    value: params.value,
                    options: provincias,
                    onChange: handleProvinciaChange(params.id), // Agregar esta línea
                };
            },
        },
        {
            field: 'localidad',
            headerName: 'Localidad',
            width: 180,
            editable: true,
            type: 'singleSelect',
            valueOptions: localidades_2,
        },
        {
            field: 'calle',
            headerName: 'Calle',
            width: 150,
            editable: true,
        },
        {
            field: 'piso',
            headerName: 'Piso',
            width: 80,
            editable: true,
        },
        {
            field: 'depto',
            headerName: 'Depto',
            width: 80,
            editable: true,
        },
        {
            field: 'oficina',
            headerName: 'Oficina',
            width: 100,
            editable: true,
        },
        {
            field: 'cp',
            headerName: 'CP',
            width: 80,
            editable: true,
        },
        {
            field: 'planta',
            headerName: 'Planta',
            width: 100,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
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

    ];

    return (
        <Box
            sx={{
                height: 'auto',
                width: '100%',
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
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                localeText={{
                    noRowsLabel: '',
                }}
            />
        </Box>
    );
} 

