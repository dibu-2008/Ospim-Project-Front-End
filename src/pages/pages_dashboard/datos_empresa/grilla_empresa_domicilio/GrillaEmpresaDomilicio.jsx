import { useState, useEffect } from 'react';
import { MenuItem, Select } from '@mui/material';
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
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';


function EditToolbar(props) {
    const { setRowsDomicilio, rows_domicilio, setRowModesModel } = props;

    const handleClick = () => {

        const maxId = Math.max(...rows_domicilio.map((row) => row.id), 0);

        const newId = maxId + 1;

        const id = newId;

        setRowsDomicilio((oldRows) => [
            {
                id,
                tipo: '',
                provinciaId: '',
                localidadId: '',
                calle: '',
                piso: '',
                dpto: '',
                oficina: '',
                cp: '',
                planta: '',
                valor: '',
                isNew: true
            },
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
                Agregar contacto
            </Button>
        </GridToolbarContainer>
    );
}

export const GrillaEmpresaDomilicio = ({ rows_domicilio, setRowsDomicilio, BACKEND_URL, token }) => {

    const [rowModesModel, setRowModesModel] = useState({});
    const [tipoDomicilio, setTipoDomicilio] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
    const [localidades, setLocalidades] = useState([]);

    useEffect(() => {

        const getTipoDomicilio = async () => {
            try {

                const response = await axios.get(`${BACKEND_URL}/empresa/domicilio/tipo`, {
                    headers: {
                        'Authorization': token,
                    }
                });

                const jsonData = await response.data;
                setTipoDomicilio(jsonData.map((item) => ({ ...item })));

            } catch (error) {

                console.error('Error al consultar los tipos de domicilio:', error);
            }
        }

        getTipoDomicilio();
    }, [])

    const getProvincias = async () => {

        try {

            const response = await axios.get(`${BACKEND_URL}/provincia`, {
                headers: {
                    'Authorization': token,
                }
            })

            const jsonData = await response.data;
            setProvincias(jsonData.map((item) => ({ ...item })));

        } catch (error) {
            console.error('Error al obtener provincias:', error);
        }
    }

    const getLocalidades = async (provinciaId) => {

        console.log("id de provincia: " + provinciaId)

        try {

            const response = await axios.get(`${BACKEND_URL}/provincia/${provinciaId}/localidad`, {
                headers: {
                    'Authorization': token,
                }
            })

            const jsonData = await response.data;
            setLocalidades(jsonData.map((item) => ({ ...item })));

        } catch (error) {

            console.error('Error al obtener localidades:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {

            await getProvincias();

            if (provinciaSeleccionada) {

                getLocalidades(provinciaSeleccionada);

            }
        };
        fetchData();
    }, [provinciaSeleccionada]);

    useEffect(() => {

        const getDatosEmpresa = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/empresa/:empresaId/domicilio`, {
                    headers: {
                        'Authorization': token,
                    }
                });
                const jsonData = await response.data;
                setRowsDomicilio(jsonData.map((item) => ({ ...item })));

                // recorrer el jsondata con un for of
                for (const item of jsonData) {
                    
                    try {

                        const res = await axios.get(`http://localhost:3001/localidad-${item.provinciaId}`)

                        const json = await res.data;

                        setLocalidades(json.map((item) => ({ ...item })));
                        
                    } catch (error) {
                        
                        console.error('Error al obtener localidades:', error);
                    }
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDatosEmpresa();
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

    const handleDeleteClick = (id) => () => {
        setRowsDomicilio(rows_domicilio.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows_domicilio.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRowsDomicilio(rows_domicilio.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        setRowsDomicilio(rows_domicilio.map((row) => (row.id === newRow.id ? updatedRow : row)));

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'tipo',
            headerName: 'Tipo',
            width: 120,
            editable: true,
            type: 'singleSelect',
            valueOptions: tipoDomicilio.map((item) => {
                return {
                    value: item.codigo,
                    label: item.descripcion,
                }
            })
        },
        {
            field: 'provinciaId',
            headerName: 'Provincia',
            width: 200,
            editable: true,
            type: 'singleSelect',
            valueOptions: provincias.map((item) => {
                return {
                    value: item.id,
                    label: item.descripcion,
                }
            }),
            renderEditCell: (params) => {
                return (
                    <Select
                        value={params.value}

                        onChange={(e) => {
                            setProvinciaSeleccionada(e.target.value)
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'provinciaId',
                                value: e.target.value,
                            }, e.target.value);
                        }}
                        sx={{ width: 200 }}
                    >

                        {provincias.map((item) => {
                            return (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.descripcion}
                                </MenuItem>
                            )
                        })}
                    </Select>
                )
            } 
        },
        {
            field: 'localidadId',
            headerName: 'Localidad',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: localidades.map((item) => {
                return {
                    value: item.id,
                    label: item.descripcion,
                }
            })
        },
        {
            field: 'calle',
            headerName: 'Calle',
            width: 120,
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
                overflowX: 'scroll',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >

            <DataGrid
                autoHeight
                rows={rows_domicilio}
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
                    toolbar: { setRowsDomicilio, rows_domicilio, setRowModesModel },
                }}
                localeText={{
                    noRowsLabel: '',
                }}
            />



        </Box>
    )
}
