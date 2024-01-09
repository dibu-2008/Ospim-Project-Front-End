import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridToolbar,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import {
    eliminarDeclaracionJurada,
    obtenerMisDeclaracionesJuradas,
    presentarDeclaracionJurada
} from "./GrillaMisDeclaracionesJuradasApi";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { MyDocument } from "./MiPdf";

/* function EditToolbar(props) {

    const { setRowsMisDdjj, rows_mis_ddjj, setRowModesModel } = props;

    const handleClick = () => {
        const maxId = Math.max(...rows_mis_ddjj.map((row) => row.id), 0);

        const newId = maxId + 1;

        const id = newId;

        setRowsMisDdjj((oldRows) => [
            {
                id,
                periodo: "",
                numero: "",
                totalUomaCS: "",
                totalUomaAS: "",
                totalCuotaUsu: "",
                totalART46: "",
                totalAntimaCS: "",
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
} */


export const GrillaMisDeclaracionesJuradas = ({ rows_mis_ddjj, setRowsMisDdjj, token, idEmpresa }) => {

    const [rowModesModel, setRowModesModel] = useState({});

    useEffect(() => {

        const ObtenerMisDeclaracionesJuradas = async () => {

            const ddjjResponse = await obtenerMisDeclaracionesJuradas(idEmpresa, token);

            setRowsMisDdjj(ddjjResponse.map((item) => ({ id: item.id, ...item })));

        };

        ObtenerMisDeclaracionesJuradas();

    }, []);

    const PresentarDeclaracionesJuradas = async (id) => {

        const updatedRow = { ...rows_mis_ddjj.find((row) => row.id === id) };

        updatedRow.estado = "PR";

        const estado = {
            estado: updatedRow.estado,
        }

        await presentarDeclaracionJurada(idEmpresa, id, estado, token);

        setRowsMisDdjj(rows_mis_ddjj.map((row) => (row.id === id ? updatedRow : row)));

        return updatedRow;

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
        setRowsMisDdjj(rows_mis_ddjj.filter((row) => row.id !== id));

        await eliminarDeclaracionJurada(idEmpresa, id, token);
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows_mis_ddjj.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRowsMisDdjj(rows_mis_ddjj.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow) => {

        const updatedRow = { ...newRow, isNew: false };

        if (newRow.isNew) {

        } else {

        }

        setRowsMisDdjj(rows_mis_ddjj.map((row) => (row.id === newRow.id ? updatedRow : row)));

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
            field: "periodo",
            headerName: "Periodo",
            width: 180,
            editable: true,
            type: "date",
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
            field: "secuencia",
            headerName: "Numero",
            width: 180,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueGetter: (params) => {

                // Si secuencia es 0 es "Original" sino es "Rectificativa"+secuencia
                if (params.value === 0) {
                    return "Original";
                } else {
                    return "Rectificativa " + params.value;
                }
            }
        },
        {
            field: "totalUomaCS",
            headerName: "Total UOMA CS",
            width: 180,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueFormatter: (params) => formatter.format(params.value || 0),
        },
        {
            field: "totalUomaAS",
            headerName: "Total UOMA AS",
            width: 180,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueFormatter: (params) => formatter.format(params.value || 0),
        },
        {
            field: "totalCuotaUsu",
            headerName: "Total Cuota Usu",
            width: 180,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueFormatter: (params) => formatter.format(params.value || 0),
        },
        {
            field: "totalART46",
            headerName: "Total ART 46",
            width: 180,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueFormatter: (params) => formatter.format(params.value || 0),
        },
        {
            field: "totalAntimaCS",
            headerName: "Total Antima CS",
            width: 180,
            editable: true,
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            valueFormatter: (params) => formatter.format(params.value || 0),
        },

        {
            field: "actions",
            headerName: "Acciones",
            width: 280,
            type: "actions",
            headerAlign: "center",
            align: "center",
            headerClassName: 'header--cell',
            getActions: ({ id, row }) => {

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

                if (row.estado === "PE") {
                    return [
                        <Button
                            sx={{
                                width: '160px',
                            }}
                            onClick={() => PresentarDeclaracionesJuradas(id)}
                            variant="contained">Presentar</Button>,
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
                        <PDFDownloadLink
                            document={<MyDocument rows_mis_ddjj={rows_mis_ddjj} />}
                            fileName="ddjj.pdf"
                        >
                            <GridActionsCellItem
                                icon={<LocalPrintshopIcon />}
                                label="Print"
                                color="inherit"
                            />
                        </PDFDownloadLink>
                    ];
                } else {
                    return [
                        <Button
                            sx={{
                                width: '160px',
                                marginLeft: '-40px',
                            }}
                            variant="contained">Generar Boleta</Button>,
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(id)}
                            color="inherit"
                        />,
                        <PDFDownloadLink
                            document={<MyDocument rows_mis_ddjj={rows_mis_ddjj} />}
                            fileName="ddjj.pdf"
                        >
                            <GridActionsCellItem
                                icon={<LocalPrintshopIcon />}
                                label="Print"
                                color="inherit"
                            />,
                        </PDFDownloadLink>
                    ];
                }
            },
        },
    ];

    return (
        <div
            style={{
                marginTop: 50,
                height: 400,
                width: "100%",
            }}>
            <Box
                sx={{
                    margin: "0 auto",
                    height: "400px",
                    width: "100%%",
                    "& .actions": {
                        color: "text.secondary",
                    },
                    "& .textPrimary": {
                        color: "text.primary",
                    },
                }}
            >
                <DataGrid
                    rows={rows_mis_ddjj}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    /* slots={{
                        toolbar: GridToolbar,
                    }} */
                    /* 
                    slotProps={{
                        toolbar: { setRowsMisDdjj, rows_mis_ddjj, setRowModesModel },
                    }} */
                    sx={{
                        // ...
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                            width: '8px',
                            visibility: 'visible',
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ccc',
                        }
                    }}
                    initialState={{
                        ...rows_mis_ddjj.initialState,
                        pagination: {
                            paginationModel: { pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Box>
            <PDFViewer style={{ width: "100%", height: "500px" }}>
                <MyDocument
                    rows_mis_ddjj={rows_mis_ddjj}
                />
            </PDFViewer>
        </div>
    );
}
