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

import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;
const ERROR_BODY = import.meta.env.VITE_ERROR_BODY;
const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;

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
            const response = await axios.get(`${BACKEND_URL}/categoria`);
            const jsonData = response.data;
            console.log(jsonData);
            setRows(jsonData.map((item, index) => ({ id: index+1, ...item })));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {

        getCategoria();

    }, []); 

    const getCamaras = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/camara`);
            const jsonData = response.data;
            setCamaras(jsonData.map((item) => ({ id: item.id, ...item })));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {

        getCamaras();

    }, []);

    // SweetAlert2
    const showSwal = (message) => {
        withReactContent(Swal).fire({
            html: `
                <div style="color:red; font-size: 26px;">
                ${message}
                </div>
            `,
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            onOpen: (modalElement) => {
                // Personaliza el estilo del icono
                const iconElement = modalElement.querySelector('.swal2-icon');
                if (iconElement) {
                    iconElement.style.color = 'green';  // Cambia el color del icono a rojo
                    iconElement.style.fontSize = '24px';  // Cambia el tamaño del icono
                    // Otros estilos que desees aplicar al icono
                }
            },
        })
    }

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

            await axios.delete(`${BACKEND_URL}/categoria/${id}`);

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

        if (newRow.isNew) {

            console.log("FILA NUEVA");

            const newCategoria = {
                camaraCodigo: newRow.camaraCodigo,
                descripcion: newRow.descripcion
            };

            try {

                await axios.post(`${BACKEND_URL}/categoria`, newCategoria);

            } catch (error) {

                try {

                    if (error.response && error.response.data) {

                        const { codigo, descripcion, ticket, tipo } = error.response.data;

                        if (tipo === ERROR_BUSINESS) {

                            showSwal(descripcion);

                        } else {

                            showSwal(`${ERROR_MESSAGE} ${ticket}`);
                            console.error(error.response.data);
                        }
                    } else {
                        showSwal(`${ERROR_MESSAGE}`);
                        console.error(`${ERROR_BODY} : ${error}`);
                    }

                } catch (error) {
                    showSwal(`${ERROR_MESSAGE}`);
                    console.error(`${ERROR_BODY} : ${error}`);
                }

            }
        } else {
            console.log("FILA EDITADA");

            const updatedCategoria = {
                camaraCodigo: newRow.camaraCodigo,
                descripcion: newRow.descripcion
            };

            try {
                const response = await axios.put(`${BACKEND_URL}/categoria/${newRow.id}`, updatedCategoria);
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