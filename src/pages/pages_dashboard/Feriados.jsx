import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
} from '@mui/x-data-grid-generator';
import { TextField } from '@mui/material';

const initialRows = [];

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;


    const handleClick = () => {
        const id = randomId();
       
        setRows((oldRows) => [...oldRows, { id, fecha: '', descripcion: '', isNew: true }]);
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
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState({});
    const [modifiedRows, setModifiedRows] = useState([]);

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
        setModifiedRows((oldModifiedRows) => [...oldModifiedRows, updatedRow]);
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    useEffect(() => {

        axios.get('http://localhost:3000/feriados')
            .then(response => {

                // Inicializa las filas con los datos obtenidos
                setRows(response.data.map((item, index) => ({ id: index + 1, ...item })));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [])

    useEffect(() => {
        if (modifiedRows.length > 0) {
           modifiedRows.forEach((row)=>{
            console.log(row)
           })
        }
    }, [modifiedRows]);

    const columns = [
        {
            field: 'fecha',
            headerName: 'Fecha',
            width: 280,
            editable: true, // La fecha no es editable
            valueFormatter: (params) => {
                // Formatear la fecha a año-mes-dia
                const date = new Date(params.value);
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
                margin: '100px auto',
                height: 600,
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
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );
}
