import { useState, useMemo, useRef } from "react";
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
import { Checkbox, Box, Button, TextField, Select, MenuItem, appBarClasses } from "@mui/material";
import { obtenerAfiliados, obtenerCategorias } from "../MisAltaDeclaracionesJuradasApi";

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
                empresaDomicilioId: "",
                categoria: "",
                remunerativo: "",
                noRemunerativo: "",
                adheridoSindicato: false,
                pagaMutual: false,
                isNew: true
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
                Nuevo Registro
            </Button>
        </GridToolbarContainer>
    );
}

export const GrillaPasoTres = ({
    rowsAltaDDJJ,
    setRowsAltaDDJJ,
    token,
    camaras,
    categoriasFiltradas,
    setCategoriasFiltradas,
    afiliado,
    setAfiliado,
    todasLasCategorias,
    plantas,
    validacionResponse
}) => {

    // Validacion response deberia de hacer una logica con rowsAltaDDJJ para ver si hay errores y mostrarlos en la grilla

    const [locale, setLocale] = useState('esES');
    const [rowModesModel, setRowModesModel] = useState({});
    const [selectedRowId, setSelectedRowId] = useState(null);

    const theme = useTheme();
    const themeWithLocale = useMemo(
        () => createTheme(theme, locales[locale]),
        [locale, theme],
    );

    const ObtenerAfiliados = async (params, cuilElegido) => {

        const afiliados = await obtenerAfiliados(token, cuilElegido);
        const afiliadoEncontrado = afiliados.find((afiliado) => afiliado.cuil === cuilElegido);

        setAfiliado(afiliadoEncontrado);
        // TODO : Mirar el tema de la logica de busqueda por que tambien podria poder escribir sin buscar el cuil
        if (afiliadoEncontrado) {

            // Apellido
            params.api.setEditCellValue({
                id: params.id,
                field: 'apellido',
                value: afiliadoEncontrado.apellido,
            });

            const textFieldApellido = document.getElementById('apellido' + params.row.id);
            const abueloApellido = textFieldApellido.parentNode.parentNode;
            abueloApellido.style.display = 'block';

            // Nombre
            params.api.setEditCellValue({
                id: params.id,
                field: 'nombre',
                value: afiliadoEncontrado.nombre,
            });

            const textFieldNombre = document.getElementById('nombre' + params.row.id);
            const abueloNombre = textFieldNombre.parentNode.parentNode;
            abueloNombre.style.display = 'block';


        } else {
            const textFieldApellido = document.getElementById('apellido' + params.row.id);
            const abueloApellido = textFieldApellido.parentNode.parentNode;
            abueloApellido.style.display = 'block';

            const textFieldNombre = document.getElementById('nombre' + params.row.id);
            const abueloNombre = textFieldNombre.parentNode.parentNode;
            abueloNombre.style.display = 'block';
        }
    };

    const filtroDeCategoria = async (params, codigoCamara) => {

        //const categoriasResponse = await obtenerCategorias(token);

        const filtroCategorias = todasLasCategorias.filter((categoria) => categoria.camara === codigoCamara);
        //console.log("categoriasFiltradas: ", filtroCategorias);

        //armar un array solo de categorias
        const soloCategorias = filtroCategorias.map((item) => item.categoria);
        //console.log("soloCategorias: ", soloCategorias);

        params.api.setEditCellValue({
            id: params.id,
            field: 'categoria',
            value: soloCategorias[0],
        });

        setCategoriasFiltradas(soloCategorias);
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

        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const formatter = new Intl.NumberFormat("es-CL", {
        minimumFractionDigits: 2,
        useGrouping: true,
        currency: "CLP",
        style: "currency",
    });

    const columns = [
        {
            field: "cuil",
            type: "string",
            headerName: "CUIL",
            flex: 2,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            renderEditCell: (params) => {
                
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            id={params.row.id ? 'cuil' + params.row.id.toString() : ''}
                            fullWidth
                            value={params.value || ''}
                            onChange={(event) => {
                                const newValue = event.target.value;
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'cuil',
                                    value: newValue,
                                });
                                // Darle background color verde cuando escriba el cuil
                                /* const textField = document.getElementById('cuil' + params.row.id);
                                textField.style.backgroundColor = 'transparent'; */

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
            flex: 1.5,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            renderEditCell: (params) => {

                return (

                    afiliado?.apellido ?

                        <TextField
                            id={params.row.id ? 'apellido' + params.row.id.toString() : ''}
                            fullWidth
                            value={params.value || ''}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent',
                                    },
                                },
                            }}
                        />
                        :
                        <TextField
                            id={params.row.id ? 'apellido' + params.row.id.toString() : ''}
                            fullWidth
                            value={params.value || ''}
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
                                        backgroundColor: params.row.cuil === '' ? 'white' : 'transparent',
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent',
                                    },
                                },
                            }}
                        />
                );
            }

        },
        {
            field: "nombre",
            type: "string",
            headerName: "Nombre",
            flex: 1.5,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            renderEditCell: (params) => {

                return (
                    afiliado?.nombre ?

                        <TextField
                            id={params.row.id ? 'nombre' + params.row.id.toString() : ''}
                            fullWidth
                            value={params.value || ''}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent',
                                    },
                                },
                            }}
                        />
                        :
                        <TextField
                            id={params.row.id ? 'nombre' + params.row.id.toString() : ''}
                            fullWidth
                            value={params.value || ''}
                            onChange={(event) => {
                                const newValue = event.target.value;
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: 'nombre',
                                    value: newValue,
                                });
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        backgroundColor: params.row.cuil === '' ? 'white' : 'transparent',
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent',
                                    },
                                },
                            }}
                        />
                );
            },
        },
        {
            field: "camara",
            headerName: "Camara",
            flex: 1,
            editable: true,
            headerAlign: "center",
            align: "center",
            type: "singleSelect",
            valueOptions: camaras.map((camara) => {
                return { value: camara.codigo, label: camara.descripcion }; // Agrega la propiedad 'key'
            }),
            headerClassName: 'header--cell',
            renderEditCell: (params) => {

                return (
                    <Select
                        fullWidth
                        value={params.value || ''}
                        onChange={(event) => {


                            params.api.setEditCellValue({ id: params.id, field: 'categoria', value: '' });
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'camara',
                                value: event.target.value,
                            });

                        }}

                    >
                        {camaras.map((camara) => {
                            return (
                                <MenuItem
                                    key={camara.codigo}
                                    value={camara.codigo}
                                    onClick={() => filtroDeCategoria(params, camara.codigo)}
                                >
                                    {camara.descripcion}
                                </MenuItem>
                            );
                        })}
                    </Select>
                )
            }
        },
        {

            field: "categoria",
            type: "singleSelect",
            headerName: "Categoria",
            flex: 1,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueOptions: categoriasFiltradas

        },
        {
            field: "fechaIngreso",
            type: "date",
            headerName: "Fecha Ingreso",
            flex: 1,
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
            field: "empresaDomicilioId",
            type: "singleSelect",
            headerName: "Planta",
            flex: 1,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueOptions: plantas.map((planta) => {
                return { value: planta.id, label: planta.planta }; // Agrega la propiedad 'key'
            })
        },
        {
            field: "remunerativo",
            type: "string",
            headerName: "Remunerativo",
            flex: 1,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueFormatter: (params) => formatter.format(params.value || 0),
        },
        {
            field: "noRemunerativo",
            type: "string",
            renderHeader: () => (
                <div style={{ textAlign: 'center', color: '#fff', fontSize: '0.8rem' }}>
                    <span role="img" aria-label="enjoy">
                        No
                        <br />
                        Remunerativo
                    </span>
                </div>
            ),
            flex: 1,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueFormatter: (params) => formatter.format(params.value || 0),
        },
        {
            field: "adheridoSindicato",
            type: "singleSelect",
            headerName: "Adherido a sindicato",
            flex: 1,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueOptions: [
                { value: true, label: 'Si' },
                { value: false, label: 'No' },
            ],
        },
        {
            field: "pagaMutual",
            type: "singleSelect",
            headerName: "Paga mutual",
            flex: 1,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueOptions: [
                { value: true, label: 'Si' },
                { value: false, label: 'No' },
            ],
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Acciones",
            flex: 1,
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
        <div>
            <Box
                sx={{
                    height: "auto",
                    width: "100%",
                    "& .actions": {
                        color: "text.secondary",
                    },
                    "& .textPrimary": {
                        color: "text.primary",
                    },
                    '& .cold': {
                        backgroundColor: '#b9d5ff91',
                        color: '#1a3e72',
                    },
                    '& .hot': {
                        backgroundColor: '#ff943975',
                        color: '#1a3e72',
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
                            '& .css-1iyq7zh-MuiDataGrid-columnHeaders': {
                                backgroundColor: '#1A76D2 !important',
                            },
                            '& .art46--cell': {
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
                        getCellClassName={(params) => {
                            let cellClassName = '';
                        
                            validacionResponse?.errores?.forEach((error) => {
                                if (params.row.cuil === error.cuil && params.field === error.codigo) {
                                    cellClassName = 'hot';
                                }
                            });
                        
                            // Action no implementar estilos hot o cold
                            if (params.field === 'actions') {
                                cellClassName = '';
                            }
                        
                            return cellClassName;
                        }}
                        
                    />
                </ThemeProvider>
            </Box>
        </div>
    )
}