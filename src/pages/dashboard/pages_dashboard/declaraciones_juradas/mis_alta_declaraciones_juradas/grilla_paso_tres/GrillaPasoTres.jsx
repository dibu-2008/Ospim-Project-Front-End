import { useState, useMemo, useEffect } from "react";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { Checkbox, Box, Button, TextField } from "@mui/material";
import { obtenerAfiliados } from "../MisAltaDeclaracionesJuradasApi";

function EditToolbar(props) {
    const { setRowsAltaDDJJ, rowsAltaDDJJ, setRowModesModel } = props;

    const handleClick = () => {
        const maxId = Math.max(...rowsAltaDDJJ.map((row) => row.id), 0);
        const newId = maxId + 1;
        const id = newId;

        setRowsAltaDDJJ((oldRows) => [
            {
                id,
                cuil: "",
                apellido: "",
                nombre: "",
                camara: "",
                fechaIngreso: "",
                planta: "",
                categoria: "",
                remunerativo: "",
                noRemunerativo: "",
                cuotaSocUoma: false,
                aporteSolUoma: false,
                cuotaUsuf: false,
                art46: false,
                amtima: false,
                isNew: true
            },
            ...oldRows,
        ]);
        setRowModesModel((oldModel) => ({
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
            ...oldModel,
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Nuevo Registro
            </Button>
        </GridToolbarContainer>
    );
}

export const GrillaPasoTres = ({ rowsAltaDDJJ, setRowsAltaDDJJ, token }) => {

    const [locale, setLocale] = useState('esES');
    const [rowModesModel, setRowModesModel] = useState({});
    const [camaras, setCamaras] = useState([]);

    const theme = useTheme();
    const themeWithLocale = useMemo(
        () => createTheme(theme, locales[locale]),
        [locale, theme],
    );

    /* const ObtenerAfiliados = async (row, cuilElegido) => {

        console.log("row antes: " , row);
        const afiliados = await obtenerAfiliados(token, cuilElegido);
        const afiliado = afiliados.find(afiliado => afiliado.cuil === cuilElegido);
        row.apellido = afiliado.apellido;
        row.nombre = afiliado.nombre;
        
        console.log("row ahora: " , row);

    }; */

    
    const ObtenerAfiliados = async (params, cuilElegido) => {
    
        const afiliados = await obtenerAfiliados(token, cuilElegido);
        const afiliado = afiliados.find((afiliado) => afiliado.cuil === cuilElegido);    
    
        // Actualizar el estado con el nuevo objeto usando setEditCellValue
        params.api.setEditCellValue({
            id: params.id,
            field: 'apellido',
            value: afiliado.apellido,
            renderEditCell: (params) => {
                return (
                    <TextField
                        fullWidth
                        value={params.value}
                        onChange={(event) => {
                            const newValue = event.target.value;
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'apellido',
                                value: newValue,
                            });
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'transparent', // Color del borde cuando no está enfocado
                                },
                                '&:hover fieldset': {
                                    borderColor: 'transparent', // Color del borde al pasar el ratón
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'transparent', // Color del borde cuando está enfocado
                                },
                            },
                        }}

                    />
                );
            }
        });

        params.api.setEditCellValue({
            id: params.id,
            field: 'nombre',
            value: afiliado.nombre,
        });
    
    };
    


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
        const updatedRows = rowsAltaDDJJ.map((row) => (row.id === id ? { ...row, isNew: false } : row));
        setRowsAltaDDJJ(updatedRows);
    };

    const handleDeleteClick = (id) => async () => {
        setRowsAltaDDJJ(rowsAltaDDJJ.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rowsAltaDDJJ.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRowsAltaDDJJ(rowsAltaDDJJ.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow) => {

        const updatedRow = { ...newRow, isNew: false };

        setRowsAltaDDJJ(rowsAltaDDJJ.map((row) => (row.id === newRow.id ? updatedRow : row)));

        if (newRow.isNew) {

        } else {

        }

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: "cuil",
            type: "string",
            headerName: "CUIL",
            width: 250,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            renderEditCell: (params) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            value={params.value}
                            onChange={(event) => {
                                const newValue = event.target.value;
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'cuil',
                                    value: newValue,
                                });
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent', // Color del borde cuando no está enfocado
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent', // Color del borde al pasar el ratón
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent', // Color del borde cuando está enfocado
                                    },
                                },
                            }}

                        />
                        <SearchIcon
                            style={{ marginLeft: 8, cursor: 'pointer' }}
                            onClick={() => ObtenerAfiliados(params, params.value)}
                        />
                    </div>
                );
            },
        },
        {
            field: "apellido",
            type: "string",
            headerName: "Apellido",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
        },
        {
            field: "nombre",
            type: "string",
            headerName: "Nombre",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
        },
        {
            field: "camara",
            type: "singleSelect",
            headerName: "Camara",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell'
        },
        {
            field: "fechaIngreso",
            type: "date",
            headerName: "Fecha Ingreso",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueFormatter: (params) => {

                const date = new Date(params.value);

                const day = date.getUTCDate().toString().padStart(2, "0");
                const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
                const year = date.getUTCFullYear();

                return `${day}-${month}-${year}`;
            },
        },
        {
            field: "planta",
            type: "singleSelect",
            headerName: "Planta",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
        },
        {

            field: "categoria",
            type: "singleSelect",
            headerName: "Categoria",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
        },
        {
            field: "remunerativo",
            headerName: "Remunerativo",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
        },
        {
            field: "noRemunerativo",
            type: "string",
            headerName: "No Remunerativo",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
        },
        {
            field: "cuotaSocUoma",
            headerName: "Cuota Soc UOMA",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            renderEditCell: (params) => {
                return (
                    <Checkbox
                        value={params.value}
                        checked={(params.value)}
                        onChange={(event) => {
                            const isChecked = event.target.checked;
                            params.api.setEditCellValue({ id: params.id, field: 'cuotaSocUoma', value: isChecked });
                        }}
                    />

                )
            },
            renderCell: (params) => (
                params.value ? <CheckBoxIcon sx={{ color: '#1A76D2' }} /> : <CheckBoxOutlineBlankIcon sx={{ color: '#1A76D2' }} />
            ),
        },
        {
            field: "aporteSolUoma",
            headerName: "Aporte Sol UOMA",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            renderEditCell: (params) => {
                return (
                    <Checkbox
                        value={params.value}
                        checked={(params.value)}
                        onChange={(event) => {
                            const isChecked = event.target.checked;
                            params.api.setEditCellValue({ id: params.id, field: 'aporteSolUoma', value: isChecked });
                        }}
                    />

                )
            },
            renderCell: (params) => (
                params.value ? <CheckBoxIcon sx={{ color: '#1A76D2' }} /> : <CheckBoxOutlineBlankIcon sx={{ color: '#1A76D2' }} />
            ),
        },
        {
            field: "cuotaUsuf",
            headerName: "Cuota USUF",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            renderEditCell: (params) => {
                return (
                    <Checkbox
                        value={params.value}
                        checked={(params.value)}
                        onChange={(event) => {
                            const isChecked = event.target.checked;
                            params.api.setEditCellValue({ id: params.id, field: 'cuotaUsuf', value: isChecked });
                        }}
                    />

                )
            },
            renderCell: (params) => (
                params.value ? <CheckBoxIcon sx={{ color: '#1A76D2' }} /> : <CheckBoxOutlineBlankIcon sx={{ color: '#1A76D2' }} />
            ),
        },
        {
            field: "art46",
            headerName: "Art 46",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            renderEditCell: (params) => {
                return (
                    <Checkbox
                        value={params.value}
                        checked={(params.value)}
                        onChange={(event) => {
                            const isChecked = event.target.checked;
                            params.api.setEditCellValue({ id: params.id, field: 'art46', value: isChecked });
                        }}
                    />

                )
            },
            renderCell: (params) => (
                params.value ? <CheckBoxIcon sx={{ color: '#1A76D2' }} /> : <CheckBoxOutlineBlankIcon sx={{ color: '#1A76D2' }} />
            ),
        },
        {
            field: "amtima",
            headerName: "AMTIMA",
            width: 150,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            renderEditCell: (params) => {
                return (
                    <Checkbox
                        value={params.value}
                        checked={(params.value)}
                        onChange={(event) => {
                            const isChecked = event.target.checked;
                            params.api.setEditCellValue({ id: params.id, field: 'amtima', value: isChecked });
                        }}
                    />

                )
            },
            renderCell: (params) => (
                params.value ? <CheckBoxIcon sx={{ color: '#1A76D2' }} /> : <CheckBoxOutlineBlankIcon sx={{ color: '#1A76D2' }} />
            ),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Acciones",
            width: 150,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
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
        <div

        >

            <Box
                sx={{
                    height: "400px",
                    width: "100%",
                    "& .actions": {
                        color: "text.secondary",
                    },
                    "& .textPrimary": {
                        color: "text.primary",
                    },
                }}
            >
                <ThemeProvider theme={themeWithLocale}>
                    <DataGrid
                        rows={rowsAltaDDJJ}
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
                            toolbar: { setRowsAltaDDJJ, rowsAltaDDJJ, setRowModesModel },
                        }}
                        sx={{
                            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                                width: '8px',
                                visibility: 'visible',
                            },
                            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                                backgroundColor: '#ccc',
                            },
                        }}
                        initialState={{
                            ...rowsAltaDDJJ.initialState,
                            pagination: {
                                paginationModel: { pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                </ThemeProvider>
            </Box>
        </div>
    )
}
