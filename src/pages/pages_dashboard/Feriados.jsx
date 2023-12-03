import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton } from '@mui/material';
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

        setRows((oldRows) => [...oldRows, { id, fecha: '', descripcion: '', isNew: true, filaNueva: true }]);
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
    // Cuando Modificamos o agregamos una fila, se guarda en este estado y podemos ver los valores en la consola para luego mandarlos al backend y bbdd
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


    const handleDeleteClick = (id) => async () => {
        try {
            // Get the date associated with the row being deleted
            const dateToDelete = rows.find((row) => row.id === id)?.fecha;

            // Remove the row from the state
            setRows((prevRows) => prevRows.filter((row) => row.id !== id));

            // Send a request to delete the date in the backend
            await axios.delete(`http://localhost:3000/feriados/${id}`);

            console.log(`Row with ID ${id} and date ${dateToDelete} deleted.`);
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

    const guardarFila = async (rowData) => {
        
        if(rowData.filaNueva){

            console.log("FILA NUEVA")
            console.log(rowData);
            /* const newFeriado = {
                fecha: rowData.fecha,
                descripcion: rowData.descripcion,
            };
    
            try {
                const response = await axios.post('http://localhost:3000/feriados', newFeriado);
                console.log(response);
            } catch (error) {
                console.error(error);
            } */

        }else{

            console.log("FILA VIEJA EDITADA")
            console.log(rowData);

            /* const updatedFeriado = {
                fecha: rowData.fecha,
                descripcion: rowData.descripcion,
            };

            try {
                const response = await axios.put(`http://localhost:3000/feriados/${rowData.id}`, updatedFeriado);
                console.log(response);
            } catch (error) {
                console.error(error);
            } */
        }
    }

    /* const handleSendHoliday = async () => {

        const id = rows.length;

        const newId = rows.length;

        const newFecha = modifiedRows[0].fecha;
        const newDescripcion = modifiedRows[0].descripcion;

        const newFeriado = {

            id: newId,
            fecha: newFecha,
            descripcion: newDescripcion,
        };

        console.log(newFeriado);

        try {
            const response = await axios.post('http://localhost:3000/feriados', newFeriado);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (modifiedRows.length > 0) {

            console.log("fila nueva numero: " + rows.length);
            handleSendHoliday();
        }
    }, [modifiedRows]);
 */


    const columns = [
        {
            field: 'fecha',
            headerName: 'Fecha',
            width: 280,
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
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<CheckIcon />}
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
        {
            field: 'save',
            headerName: 'Guardar',
            width: 120,
            renderCell: (params) => (
                <IconButton
                    color="primary"
                    onClick={() => guardarFila(params.row)}
                >
                    <SaveIcon />
                </IconButton>
            ),
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
