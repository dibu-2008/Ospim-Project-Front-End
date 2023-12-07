import { useState, useEffect } from 'react';
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
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
    return randomArrayItem(roles);
};

function EditToolbar(props) {
    const { setRows, rows, setRowModesModel } = props;

    const handleClick = () => {

        const maxId = Math.max(...rows.map((row) => row.id), 0);

        const newId = maxId + 1;

        const id = newId;

        setRows((oldRows) => [...oldRows, { id, camaraCodigo: '', descripcion: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

export const Categorias = () => {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [camaras, setCamaras] = useState([]);

    const getCategoria = async () => {
        try {
            const response = await axios.get(`${backendUrl}/categoria`);
            const jsonData = response.data;
            setRows(jsonData.map((item) => ({ id: item.id, ...item })));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {

        getCategoria();

    }, []);

    const getCamaras = async () => {
        try {
            const response = await axios.get(`${backendUrl}/camara`);
            const jsonData = response.data;
            setCamaras(jsonData.map((item) => ({ id: item.id, ...item })));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {

        getCamaras();

    }, []);


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
            setRows(rows.filter((row) => row.id !== id));
            
            await axios.delete(`${backendUrl}/categoria/${id}`);

        } catch (error) {
            
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

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        console.log(updatedRow);

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        
        if(newRow.isNew){

            console.log("FILA NUEVA");



            const newCategoria = {
                camaraCodigo: newRow.camaraCodigo,
                descripcion: newRow.descripcion
            };

            console.log(newCategoria);

            try {

                await axios.post(`${backendUrl}/categoria`, newCategoria);

            } catch (error) {

                const { codigo, descripcion, ticket, tipo } = error.response.data;

                console.log(tipo);

                if(tipo === 'ERROR_APP_BUSINESS') {
                    alert(`${descripcion}`);
                }else {
                    alert(`Su peticion no fue procesada ${ticket}`);
                    console.log(error.response.data);
                }
            }
        }else {
            console.log("FILA EDITADA");

            const updatedCategoria = {
                camaraCodigo: newRow.camaraCodigo,
                descripcion: newRow.descripcion
            };

            console.log(newRow.id);
            console.log(updatedCategoria);

            try {
                const response = await axios.put(`${backendUrl}/categoria/${newRow.id}`, updatedCategoria);
                console.log(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'camaraCodigo',
            headerName: 'Camara',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: camaras.map((camara) => camara.codigo),
        },
        {
            field: 'descripcion',
            headerName: 'Descripcion de la Categoria',
            width: 280,
            editable: true
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
                height: 500,
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
                    toolbar: { setRows, rows, setRowModesModel },
                }}
            />
        </Box>
    );
}