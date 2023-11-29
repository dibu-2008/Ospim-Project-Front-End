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
import { MenuItem, Select } from '@mui/material';


const randomRole = () => {
    return randomArrayItem(roles);
};

const initialRows = [];
const tipos = ['Fiscal', 'Real', 'Legal'];

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            {
                id,
                tipo: '',
                provincia: '',
                localidad: '',
                calle: '',
                piso: '',
                dpto: '',
                oficina: '',
                cp: '',
                planta: '',
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
                Agregar domicilio
            </Button>
        </GridToolbarContainer>
    );
}

export const AddressTable = ({ companiesDto }) => {



    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [modifiedRows, setModifiedRows] = useState([]);
    const [userCompaniesSend, setUserCompaniesSend] = useState({});
    const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

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
        setModifiedRows((prevModifiedRows) => [...prevModifiedRows, updatedRow]);
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const getAllProvincias = async () => {

        try {

            const provinciasResponse = await axios.get('https://apis.datos.gob.ar/georef/api/provincias')

            const nombresProvincias = provinciasResponse.data.provincias.map((prov) => prov.nombre);

            setProvincias(['Seleccione una provincia', ...nombresProvincias]);

        } catch (error) {
            console.error('Error al obtener provincias:', error);
        }
    }

    const getAllLocalidades = async (prov) => {

        try {
            const localidadesProv = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${prov ? prov : 'seleccione'}&campos=nombre&max=1000`)
            const uniqueLocalidades = Array.from(new Set(localidadesProv.data.localidades.map(local => local.nombre)));

            setLocalidades(uniqueLocalidades);

        } catch (error) {
            console.error('Error al obtener localidades:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getAllProvincias();
            if (selectedDepartment) {
                await getAllLocalidades(selectedDepartment);
            }
        };
        fetchData();
    }, [selectedDepartment]);

    useEffect(() => {
        if (companiesDto) {

            if (modifiedRows.length > 0) {

                const userCompanies = {
                    razonsocial: companiesDto.razonSocial,
                    cuit: companiesDto.cuit,
                    clave: companiesDto.password,
                    email: companiesDto.email,
                    telefono: companiesDto.phone,
                    whatsapp: companiesDto.whatsapp,
                    telefonosAlternativos: [],
                    emailAlternativos: companiesDto.emailAlternativos,
                    domicilios: modifiedRows.map((row) => ({
                        tipo: row.tipo,
                        provincia: row.provincia,
                        localidad: row.localidad,
                        calle: row.calle,
                        piso: row.piso,
                        depto: row.depto,
                        oficina: row.oficina,
                        cp: row.cp,
                        planta: row.planta,
                    })),
                }

                console.log(companiesDto)

                setUserCompaniesSend(userCompanies);
            }
        }
    }, [companiesDto, modifiedRows])

    const handleRegisterCompany = async () => {

        try {
            const response = await axios.post('http://localhost:3000/empresas', userCompaniesSend)
            console.log(response);

            // Marcamos el registro como completo
            setIsRegistrationComplete(true);
        } catch (error) {
            console.error('Error al registrar empresa:', error);
        }
    }

    const columns = [
        {
            field: 'tipo',
            headerName: 'Tipo',
            width: 180,
            editable: true,
            type: 'singleSelect',
            valueOptions: tipos,
        },
        {
            field: 'provincia',
            headerName: 'Provincia',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Seleccione una provincia', ...provincias],
            renderEditCell: (params) => (
                <Select
                    value={params.value}
                    onChange={(e) => {
                        setSelectedDepartment(e.target.value);
                        params.api.setEditCellValue({ id: params.id, field: 'provincia', value: e.target.value });
                    }}
                    style={{ width: '100%', padding: '8px' }}
                >
                    {provincias.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option.toLowerCase()}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            field: 'localidad',
            headerName: 'Localidad',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: localidades,
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
            {isRegistrationComplete ? (
                <div>
                    <p>¡Registro completado con éxito!</p>
                    {/* Puedes agregar aquí cualquier otro contenido que desees mostrar */}
                </div>
            ) : (
                <>
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
                    <Button
                        sx={{
                            width: '150px',
                            padding: '15px',
                            marginTop: '25px',
                        }}
                        variant="contained"
                        onClick={handleRegisterCompany}
                    >
                        Registrar
                    </Button>
                </>
            )}
        </Box>
    );
}