import * as React from 'react';
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

import { useState } from 'react';
import { obtenerLocalidades, obtenerProvincias, obtenerTipoDomicilio } from './GrillaRegistroDomicilioApi';
import { useEffect } from 'react';
import { MenuItem, Select } from '@mui/material';


function EditToolbar(props) {
    const { setRows, rows, setRowModesModel } = props;

    const handleClick = () => {

        const maxId = Math.max(...rows.map((row) => row.id), 0);

        const newId = maxId + 1;

        const id = newId;

        setRows((oldRows) => [
            {
                id,
                tipo: "",
                provinciaId: "",
                localidadId: "",
                calle: "",
                piso: "",
                dpto: "",
                oficina: "",
                cp: "",
                planta: "",
                valor: "",
                isNew: true,
            },
            ...oldRows,
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                AGREGAR DOMICILIO
            </Button>
        </GridToolbarContainer>
    );
}

export const GrillaRegistroDomilicio = ({ rows, setRows }) => {

    const [rowModesModel, setRowModesModel] = useState({});
    const [tipoDomicilio, setTipoDomicilio] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
    const [localidades, setLocalidades] = useState([]);

    useEffect(() => {

        const getTipoDomicilio = async () => {

            const tiposResponse = await obtenerTipoDomicilio();

            setTipoDomicilio(tiposResponse.map((item) => ({ ...item })));
        };

        getTipoDomicilio();

    }, []);

    useEffect(() => {

        const getProvincias = async () => {
            const provinciasResponse = await obtenerProvincias();
            console.log(provinciasResponse);
            setProvincias(provinciasResponse.map((item) => ({ ...item })));
        };

        getProvincias();

    }, []);

    useEffect(() => {

        const getLocalidades = async () => {

            const localidadesResponse = await obtenerLocalidades(provinciaSeleccionada);

            setLocalidades(localidadesResponse.map((item) => ({ ...item })));

        };

        getLocalidades();

    }, [provinciaSeleccionada]);


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

    const columns = [
        {
            field: "tipo",
            headerName: "Tipo",
            width: 120,
            editable: true,
            type: "singleSelect",
            getOptionValue: (dato) => dato.codigo,
            getOptionLabel: (dato) => dato.descripcion,
            valueOptions: tipoDomicilio,
        },
        {
            field: "provinciaId",
            headerName: "Provincia",
            width: 200,
            editable: true,
            type: "singleSelect",
            getOptionValue: (dato) => dato.id,
            getOptionLabel: (dato) => dato.descripcion,
            valueOptions: provincias,
            renderEditCell: (params) => (
                <Select
                    value={params.value}
                    onChange={(e) => {
                        // Limpiar el valor de la localidad
                        params.api.setEditCellValue({ id: params.id, field: 'localidadId', value: '' }); 
                        setProvinciaSeleccionada(e.target.value);
                        params.api.setEditCellValue({ id: params.id, field: 'provinciaId', value: e.target.value });
                    }}
                    style={{ width: '100%', padding: '8px' }}
                >
                    {
                        provincias.map((province) => (
                            <MenuItem key={province.id} value={province.id}>
                                {province.descripcion}
                            </MenuItem>
                        ))
                    }
                </Select>
            ),
        },
        {
            field: "localidadId",
            headerName: "Localidad",
            width: 220,
            editable: true,
            type: "singleSelect",
            getOptionValue: (dato) => dato.id,
            getOptionLabel: (dato) => dato.descripcion,
            valueOptions: localidades,
        },
        {
            field: "calle",
            headerName: "Calle",
            width: 120,
            editable: true,
        },
        {
            field: "piso",
            headerName: "Piso",
            width: 80,
            editable: true,
        },
        {
            field: "depto",
            headerName: "Depto",
            width: 80,
            editable: true,
        },
        {
            field: "oficina",
            headerName: "Oficina",
            width: 100,
            editable: true,
        },
        {
            field: "cp",
            headerName: "CP",
            width: 80,
            editable: true,
        },
        {
            field: "planta",
            headerName: "Planta",
            width: 100,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
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
                    toolbar: {
                        setRows,
                        rows,
                        setRowModesModel
                    },
                }}
            />
        </Box>
    );
}