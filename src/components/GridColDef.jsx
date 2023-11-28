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
import { useEffect, useState } from 'react';

const randomRole = () => {
    return randomArrayItem(roles);
};

const initialRows = [];

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            {
                id,
                name: '',
                age: '',
                role: '',
                role_children: '',
                isNew: true
            }
        ]);
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

export default function DataGridDemo() {
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);

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

    const getAllProvincias = async () => {

        try {

            const provinciasResponse = await axios.get('https://apis.datos.gob.ar/georef/api/provincias')

            const nombresProvincias = provinciasResponse.data.provincias.map((prov) => prov.nombre);

            setProvincias(['Seleccione una provincia',...nombresProvincias]);

        } catch (error) {
            console.error('Error al obtener provincias:', error);
        }
    }

    const getAllLocalidades = async (prov) => {

        console.log(prov);
        try {
            const localidadesProv = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${prov?prov:'seleccione'}&campos=nombre&max=1000`)
            const uniqueLocalidades = Array.from(new Set(localidadesProv.data.localidades.map(local => local.nombre)));

            setLocalidades(uniqueLocalidades);

        } catch (error) {
            console.error('Error al obtener localidades:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getAllProvincias();
            if(selectedDepartment){
                await getAllLocalidades(selectedDepartment);
                console.log(localidades);
            }
        };
        fetchData();
    }, [selectedDepartment]);

    const columns = [
        { field: 'name', headerName: 'Name', width: 180, editable: true },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 80,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'joinDate',
            headerName: 'Join date',
            type: 'date',
            width: 180,
            editable: true,
        },
        {
            field: 'role',
            headerName: 'Department',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Seleccione una provincia', ...provincias],
            renderEditCell: (params) => (
                <select
                    value={params.value}
                    onChange={(e) => {
                        setSelectedDepartment(e.target.value);
                        params.api.setEditCellValue({ id: params.id, field: 'role', value: e.target.value });
                    }}
                >
                    {provincias.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ),
        },
        {
            field: 'role_children',
            headerName: 'Department_children',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: localidades,
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
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );
}