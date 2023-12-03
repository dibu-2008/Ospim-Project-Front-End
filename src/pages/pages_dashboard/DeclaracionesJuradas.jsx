import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
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
import { IconButton } from '@mui/material';

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
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

export function DeclaracionesJuradas() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [dataRows, setDataRows] = useState({
    name: '',
    age: '',
  });

  const getApiData = async () =>{

    try {

      const response = axios.get('http://localhost:3000/pruebas')
      

      setRows(response.data);
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
   
    getApiData();
  }, [])
  

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (params, id) => () => {

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

  const handleChange = (event) => {
    setDataRows({
      ...dataRows,
      [event.target.name]: event.target.value,
    });

    console.log(dataRows);
  }

  const handleEditCellChange = (params) => {
    handleChange(params);
  }

  const guardarFila = async(rowData) => {
    console.log(rowData);
  }

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
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (params) => {
        const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<CheckIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(params.row, params.row.id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(params.row.id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params.row.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(params.row.id)}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: 'save',
      headerName: 'Guardar',
      width: 120,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => guardarFila(params.row)}
        >
          <SaveIcon />
        </IconButton>
      ),
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
        onEditCellChange={handleEditCellChange}
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








/* import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import { Button } from '@mui/material';

export const DeclaracionesJuradas = () => {
  const [data, setData] = useState([]);
  const [dataRows, setDataRows] = useState({
    name: '',
    age: '',
  });
  const [newRow, setNewRow] = useState({ name: '', age: '' });


  const handleChange = (event) => {
    setDataRows({
      ...dataRows,
      [event.target.name]: event.target.value,
    });

    console.log(dataRows);
  }

  const handleEditCellChange = (params) => {
    handleChange(params);
  };

  const guardarFila = async(rowData) => {

    console.log(rowData);

    try {

      if (rowData.id) {
        // Si la fila tiene un ID, actualiza la fila existente
        const res = await axios.put(`http://localhost:3000/pruebas/${rowData.id}`, rowData);
        console.log(res.data);
      } else {
        // Si la fila no tiene un ID, crea una nueva fila
        const res = await axios.post('http://localhost:3000/pruebas', newRow);
        console.log(res.data);
        setNewRow({ name: '', age: '' }); // Reinicia la nueva fila después de agregarla
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // función para manejar los cambios en la nueva fila
  const handleNewRowChange = (event) => {
    setNewRow({
      ...newRow,
      [event.target.name]: event.target.value,
    });
  };
  


  const getAllPruebas = async () => {
    try {
      const res = await axios.get('http://localhost:3000/pruebas');
      console.log(res.data); // assuming the data is in the response's data property
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    (async () => {
      await getAllPruebas();
    })();
  }, []);

  const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      editable: true,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => guardarFila(params.row)}
        >
          <SaveIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        onEditCellChange={handleEditCellChange}
      />
    </div>
  );
}; */
