import { useState, useEffect } from "react";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { obtenerMisDeclaracionesJuradas } from "./GrillaMisDeclaracionesJuradasApi";

function EditToolbar(props) {

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
}

export const GrillaMisDeclaracionesJuradas = ({ rows_mis_ddjj, setRowsMisDdjj, token }) => {

    
    useEffect(() => {

        const ObtenerMisDeclaracionesJuradas = async () => {

            const ddjjResponse = await obtenerMisDeclaracionesJuradas(token);
            console.log(ddjjResponse);

            setRowsMisDdjj(ddjjResponse.map((item) => ({ id: item.id, ...item })));

        };

        ObtenerMisDeclaracionesJuradas(); 

    }, []);
        

    const [rowModesModel, setRowModesModel] = useState({});

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

    const columns = [
        {
            field: "periodo",
            headerName: "Periodo",
            width: 150,
            editable: true,
            type: "date"
        },
        {
            field: "numero",
            headerName: "Numero",
            width: 150,
            editable: true,
        },
        {
            field: "totalUomaCS",
            headerName: "Total UOMA CS",
            width: 150,
            editable: true,
        },
        {
            field: "totalUomaAS",
            headerName: "Total UOMA AS",
            width: 150,
            editable: true,
        },
        {
            field: "totalCuotaUsu",
            headerName: "Total Cuota Usu",
            width: 150,
            editable: true,
        },
        {
            field: "totalART46",
            headerName: "Total ART 46",
            width: 150,
            editable: true,
        },
        {
            field: "totalAntimaCS",
            headerName: "Total Antima CS",
            width: 150,
            editable: true,
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 200,
            type: "actions",
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
        <DataGrid
            rows={rows_mis_ddjj}
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
                toolbar: { setRowsMisDdjj, rows_mis_ddjj, setRowModesModel },
            }}
        />
    );
}
