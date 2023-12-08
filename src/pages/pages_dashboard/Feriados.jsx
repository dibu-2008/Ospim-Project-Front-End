import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import { Grid, IconButton } from '@mui/material';
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

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EditToolbar(props) {

    const { setRows, rows, setRowModesModel } = props;


    const handleClick = () => {

        const maxId = Math.max(...rows.map((row) => row.id), 0);

        const newId = maxId + 1;

        const id = newId;

        setRows((oldRows) => [
            { id, fecha: '', descripcion: '', isNew: true },
            ...oldRows
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Nuevo Feriado
            </Button>
        </GridToolbarContainer>
    );
}

const state = JSON.parse(localStorage.getItem('state'));

export function Feriados() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});


    useEffect(() => {


        const fetchData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/feriados`, {
                    headers: {
                        'Authorization': state.token, 
                    },
                });
                
                setRows(response.data.map((item, index) => ({ id: index + 1, ...item })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
    
    

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

    };

    const handleSaveClick = (fila, id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };


    const handleDeleteClick = (id) => async () => {

        try {

            setRows((prevRows) => prevRows.filter((row) => row.id !== id));

            await axios.delete(`${backendUrl}/feriados/${id}`, {
                headers: {
                    'Authorization': state.token, 
                },
            });

        } catch (error) {
            console.error('Error deleting row:', error);
        }
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

    // captura los valores actualizados
    const processRowUpdate = async (newRow) => {

        const updatedRow = { ...newRow, isNew: false };

        if (newRow.isNew) {
            console.log("FILA NUEVA")

            const newFeriado = {
                fecha: newRow.fecha,
                descripcion: newRow.descripcion,
            };

            try {
                const response = await axios.post(`${backendUrl}/feriados`, newFeriado, {
                    headers: {
                        'Authorization': state.token, 
                    },
                });
                console.log(response);
            } catch (error) {
                console.error(error);
            }

        } else {
            console.log("FILA VIEJA EDITADA")

            const updatedFeriado = {
                fecha: newRow.fecha,
                descripcion: newRow.descripcion,
            };

            try {
                const response = await axios.put(`${backendUrl}/feriados/${newRow.id}`, updatedFeriado, {
                    headers: {
                        'Authorization': state.token, 
                    }
                });
                console.log(response);
            } catch (error) {
                console.error(error);
            }

        }

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'fecha',
            headerName: 'Fecha',
            width: 250,
            type: 'date',
            editable: true,
            valueFormatter: (params) => {
                const date = new Date(params.value);

                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();

                return `${day}-${month}-${year}`;
            },
            renderHeader: (params) => (
                <Grid container alignItems="center">
                    <Grid item>Fecha</Grid>
                    <Grid item>
                        <IconButton size="small" sx={{ ml: 1, color: '#1A76D2' }}>
                            <CalendarMonthIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ),
        },
        {
            field: 'descripcion',
            headerName: 'Descripción',
            width: 250,
            editable: true,
            renderHeader: (params) => (
                <Grid container alignItems="center">
                    <Grid item>Descripción</Grid>
                    <Grid item>
                        <IconButton size="small" sx={{ ml: 1, color: '#1A76D2' }}>
                            <DescriptionIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Edición',
            width: 250,
            cellClassName: 'actions',
            getActions: (params) => {
                const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(params.row, params.row.id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(params.row.id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(params.row.id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        color="inherit"
                        onClick={handleDeleteClick(params.row.id)}
                    />,
                ];


            },
            renderHeader: (params) => (
                <Grid container alignItems="center">
                    <Grid item>Descripción</Grid>
                    <Grid item>
                        <IconButton size="small" sx={{ ml: 1, color: '#1A76D2' }}>
                            <EditIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ),
        }
    ];




    return (
        <div style={{
            width: '70%',
            margin: '80px auto',
        }}>
            <h1 style={{
                color: '#1A76D2',
                marginBottom: '10px',
                textAlign: 'center'
            }}>Administración de feriados</h1>
            <Box
                sx={{
                    margin: '60px auto',
                    height: 'auto',
                    width: '80%',
                    boxShadow: '0px 4px 8px rgba(26, 118, 210, 0.6)',
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
                    onProcessRowUpdateError={(error) => {
                        console.error('Error during row update:', error);
                        // Puedes agregar lógica adicional para manejar el error, si es necesario.
                    }}
                    slots={{
                        toolbar: EditToolbar,
                    }}
                    slotProps={{
                        toolbar: { setRows, rows, setRowModesModel },
                    }}
                    
                    pageSizeOptions={[
                        
                    ]}
                />
            </Box>
        </div>
    );
}
