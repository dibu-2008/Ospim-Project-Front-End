import { useState, useEffect } from 'react'
import { 
    eliminar, 
    obtener, 
    crear, 
    actualizar
} from './PublicacionesApi';
import { EditarNuevaFila } from './PublicacionNueva';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import './Publicaciones.css';

export const Publicaciones = () => {

    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState([])

    const state = JSON.parse(localStorage.getItem('state')); 
    const token = state.token;

    useEffect(() => {

        const ObtenerPublicaciones = async () => {
            
            const publicaciones = await obtener(token);
            
            setRows(publicaciones.map((item, index)=>({...item, id: index + 1})));

        };

        ObtenerPublicaciones();

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
        setRows((oldRows) => oldRows.filter((row) => row.id !== id));
        setRowModesModel((oldModel) => {
            const newModel = { ...oldModel };
            delete newModel[id];
            return newModel;
        });

        await eliminar(id, token); 
    }

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

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

        if (newRow.isNew) {

            const nuevaPublicacion = {
                titulo: newRow.titulo,
                cuerpo: newRow.cuerpo,
                vigenciaDesde: newRow.vigenciaDesde,
                vigenciaHasta: newRow.vigenciaHasta
            };

            await crear(nuevaPublicacion, token);

        }else {

            const publicacionEditada = {
                titulo: newRow.titulo,
                cuerpo: newRow.cuerpo,
                vigenciaDesde: newRow.vigenciaDesde,
                vigenciaHasta: newRow.vigenciaHasta
            };

            await actualizar(newRow.id, publicacionEditada, token);

        }

        return updatedRow;
    }

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'titulo',
            headerName: 'Titulo',
            width: 150,
            type: 'string',
            editable: true,
        },
        {
            field: 'cuerpo',
            headerName: 'Cuerpo',
            width: 200,
            type: 'string',
            editable: true,
        },
        {
            field: 'vigenciaDesde',
            headerName: 'Vigencia Desde',
            width: 200,
            type: 'date',
            editable: true,
            valueFormatter: (params) => {
                const date = new Date(params.value);

                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();

                return `${day}-${month}-${year}`;
            },
        },
        {
            field: 'vigenciaHasta',
            headerName: 'Vigencia Hasta',
            width: 200,
            type: 'date',
            editable: true,
            valueFormatter: (params) => {
                const date = new Date(params.value);

                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();

                return `${day}-${month}-${year}`;
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            type: 'actions',
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
        }
    ]


    return (

        <div className='publicaciones_container'>
            <h1>Administracion de Novedades</h1>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditarNuevaFila,
                }}
                slotProps={{
                    toolbar: { setRows, rows, setRowModesModel },
                }}
            />
        </div>
    )
}
