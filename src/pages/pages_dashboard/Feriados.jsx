import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
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

        setRows((oldRows) => [...oldRows, { id, fecha: '', descripcion: '', isNew: true}]);
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


export function Feriados() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    useEffect(() => {
        try {
            axios.get(`${backendUrl}/feriados`)
                .then(response => {
                    setRows(response.data.map((item, index) => ({ id: index + 1, ...item })));
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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

            await axios.delete(`${backendUrl}/feriados/${id}`);
            
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
        
        if(newRow.isNew){
            console.log("FILA NUEVA")

            const newFeriado = {
                fecha: newRow.fecha,
                descripcion: newRow.descripcion,
            };

            try {
                const response = await axios.post(`${backendUrl}/feriados`, newFeriado);
                console.log(response);
            } catch (error) {
                console.error(error);
            }

        }else {
            console.log("FILA VIEJA EDITADA")
            
            const updatedFeriado = {
                fecha: newRow.fecha,
                descripcion: newRow.descripcion,
            };

            try {
                const response = await axios.put(`${backendUrl}/feriados/${newRow.id}`, updatedFeriado);
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
            width: 180,
            type: 'date',
            editable: true,
            valueFormatter: (params) => {
                const date = new Date(params.value);

                date.setDate(date.getDate() + 1);

                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            },

        },
        {
            field: 'descripcion',
            headerName: 'Descripción',
            width: 250,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Edición',
            width: 100,
            cellClassName: 'actions',
            getActions: ( params ) => {
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
        }
    ];

    return (
        <Box
            sx={{
                margin: '60px auto',
                height: 'auto',
                width: '80%',
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
            />
        </Box>
    );
}
