import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import formatter from '@/common/formatter';
import {
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { axiosDDJJ } from './MisDDJJConsultaGrillaApi';
import { consultarAportesDDJJ } from '@/common/api/AportesApi';
import Swal from 'sweetalert2';
import swal from '@/components/swal/swal';
import { useNavigate } from 'react-router-dom';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import localStorageService from '@/components/localStorage/localStorageService';
import { UserContext } from '@/context/userContext';

function misDDJJColumnaAporteGet(ddjjResponse) {
  //toma todas las ddjj de la consulta de "Mis DDJJ" y arma "vector de Columnas Aportes"
  //Ejemplo: ['UOMACU', 'ART46', 'UOMASC']
  let vecAportes = ddjjResponse.map((item) => item.aportes).flat();
  let colAportes = vecAportes.reduce((acc, item) => {
    if (!acc.includes(item.codigo)) {
      acc.push(item.codigo);
    }
    return acc;
  }, []);
  return colAportes;
}

function ddjjTotalesAportes(ddjj, colAportes) {
  //toma una ddjj de la consulta de "Mis DDJJ" y arma "vector de Columnas Totales por Aportes"

  let vecAportes = ddjj.aportes;

  let vecAportesConTotales = [];
  colAportes.forEach((element) => {
    vecAportesConTotales.push({ codigo: element, importe: 0 });
  });

  vecAportes.forEach((aporte) => {
    vecAportesConTotales.forEach((total) => {
      if (total.codigo == aporte.codigo) {
        total.importe = total.importe + aporte.importe;
      }
    });
  });
  return vecAportesConTotales;
}

export function castearMisDDJJ(ddjjResponse) {
  let colAportes = misDDJJColumnaAporteGet(ddjjResponse);
  ddjjResponse.forEach((dj) => {
    let colAportesConTotales = ddjjTotalesAportes(dj, colAportes);

    colAportesConTotales.forEach((regTot) => {
      dj['total' + regTot.codigo] = regTot.importe;
    });
  });
  return ddjjResponse;
}

export const MisDDJJConsultaGrilla = ({
  setDDJJState,
  rows_mis_ddjj: rowsMisDdjj,
  setRowsMisDdjj,
  setTabState,
  setTituloPrimerTab,
}) => {
  const [vecAportes, setVecAportes] = useState({});
  const [rowModesModel, setRowModesModel] = useState({});

  const ID_EMPRESA = localStorageService.getEmpresaId();

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  useEffect(() => {
    const ObtenerVecAportes = async () => {
      const data = await consultarAportesDDJJ();
      setVecAportes(data);
    };
    ObtenerVecAportes();
  }, []);

  const getAporteDescrip = (codigo) => {
    if (vecAportes && vecAportes.find) {
      let reg = vecAportes.find((aporte) => aporte.codigo == codigo);
      //console.log('getAporteDescrip - reg: ', reg);
      if (!reg) return codigo;
      return reg.descripcion;
    }
  };

  //console.log('getAporteDescrip() => ', getAporteDescrip('AMTIMACS'));

  let colAportes = [];

  const navigate = useNavigate();

  const handleGenerarBoletaClick = (id) => () => {
    try {
      navigate(`/dashboard/generarboletas/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const ObtenerMisDeclaracionesJuradas = async () => {
      //let ddjjResponse = await axiosDDJJ.consultar(ID_EMPRESA);

      //Agrego las columnas deTotales de Aportes
      const ddjjResponse = await castearMisDDJJ(rowsMisDdjj);

      setRowsMisDdjj(ddjjResponse.map((item) => ({ id: item.id, ...item })));
    };

    ObtenerMisDeclaracionesJuradas();
  }, []);

  const PresentarDeclaracionesJuradas = async (rowGrilla) => {
    const confirm = {
      titulo: 'Presentación de DDJJ en OSPIM',
      texto:
        'Confirma la Presentación de la Declaración Jurada para el Período <b>' +
        formatter.periodo(rowGrilla.periodo) +
        '</b>?',
      esHtml: true,
      reverseButtons: true,
      textoBtnOK: 'Si, Presentar !',
    };
    //textoBtnOK: 'Si, Presentar !',
    //reverseButtons: true,
    let minSettings = swal.getSettingConfirm(confirm);
    minSettings.reverseButtons = true;

    Swal.fire(minSettings).then(async (result) => {
      if (result.isConfirmed) {
        const updatedRow = {
          ...rowsMisDdjj.find((row) => row.id === rowGrilla.id),
        };
        const data = await axiosDDJJ.presentar(ID_EMPRESA, rowGrilla.id);

        console.log('data: ', data);

        if (data) {
          updatedRow.estado = data.estado || null;
          updatedRow.secuencia = data.secuencia || null;

          setRowsMisDdjj(
            rowsMisDdjj.map((row) =>
              row.id === rowGrilla.id ? updatedRow : row,
            ),
          );
        }

        return updatedRow;
      }
    });
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => async () => {
    setDDJJState({ id: id });
    setTabState(0);
    setTituloPrimerTab('Modificar Declaracion Jurada');
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const declaracionJuradasImpresion = async (idDDJJ) => {
    await axiosDDJJ.imprimir(ID_EMPRESA, idDDJJ);
  };

  const handleDeleteClick = (id) => async () => {
    const showSwalConfirm = async () => {
      try {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1A76D2',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Si, bórralo!',
        }).then(async (result) => {
          console.log(
            'handleDeleteClick() - ID_EMPRESA: ' + ID_EMPRESA + ' id: ' + id,
          );
          if (result.isConfirmed) {
            const bRta = await axiosDDJJ.eliminar(ID_EMPRESA, id);
            console.log('bRta: ' + bRta);
            if (bRta)
              setRowsMisDdjj(rowsMisDdjj.filter((row) => row.id !== id));
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarFeriado:', error);
      }
    };

    showSwalConfirm();
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rowsMisDdjj.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRowsMisDdjj(rowsMisDdjj.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    setRowsMisDdjj(
      rowsMisDdjj.map((row) => (row.id === newRow.id ? updatedRow : row)),
    );

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  //1ro seteo columans fijas
  let columns = [
    {
      field: 'periodo',
      headerName: 'Periodo',
      flex: 1,
      editable: false,
      type: 'date',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueFormatter: (params) => {
        return formatter.periodoString(params.value);
      },
    },
    {
      field: 'secuencia',
      headerName: 'Numero',
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueGetter: (params) => {
        // Si secuencia es 0 es "Original" sino es "Rectificativa"+secuencia
        if (params.value === null) {
          return 'Pendiente';
        } else if (params.value === 0) {
          return 'Original';
        } else {
          return 'Rectif. ' + params.value;
        }
      },
    },
    {
      field: 'presentada',
      headerName: 'Presentación',
      flex: 1,
      editable: false,
      type: 'date',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueFormatter: (params) => {
        return formatter.dateString(params.value);
      },
    },
  ];

  colAportes = misDDJJColumnaAporteGet(rowsMisDdjj);

  colAportes.forEach((elem) => {
    columns.push({
      field: 'total' + elem,
      headerName: getAporteDescrip(elem),
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    });
  });

  columns.push({
    field: 'actions',
    headerName: 'Acciones',
    flex: 2,
    type: 'actions',
    headerAlign: 'center',
    align: 'right',
    headerClassName: 'header--cell',
    getActions: ({ id, row }) => {
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

      if (row.estado === 'PE') {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<LocalPrintshopIcon />}
            label="Print"
            color="inherit"
            onClick={() => declaracionJuradasImpresion(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          /> /*
          <Button
            sx={{
              width: '160px',
            }}
            onClick={() => PresentarDeclaracionesJuradas(row)}
            variant="contained"
          >
            Presentar
          </Button>,*/,
        ];
      } else if (row.estado == 'PR') {
        return [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<LocalPrintshopIcon />}
            label="Print"
            color="inherit"
            onClick={() => declaracionJuradasImpresion(id)}
          />,
          /*<Button
            sx={{
              width: '160px',
              marginLeft: '-40px',
            }}
            variant="contained"
            onClick={handleGenerarBoletaClick(id)}
          >
            Generar Boleta
          </Button>,*/
        ];
      } else {
        return [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<LocalPrintshopIcon />}
            label="Print"
            color="inherit"
            onClick={() => declaracionJuradasImpresion(id)}
          />,
        ];
      }
    },
  });

  columns.push({
    field: 'Decision',
    headerName: 'Decisión',
    flex: 2,
    type: 'actions',
    headerAlign: 'center',
    align: 'right',
    headerClassName: 'header--cell',
    getActions: ({ id, row }) => {
      //      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (row.estado === 'PE') {
        return [
          <Button
            sx={{
              width: '160px',
            }}
            onClick={() => PresentarDeclaracionesJuradas(row)}
            variant="contained"
          >
            Presentar
          </Button>,
        ];
      } else if (row.estado == 'PR') {
        return [
          <Button
            sx={{
              width: '160px',
              marginLeft: '-40px',
            }}
            variant="contained"
            onClick={handleGenerarBoletaClick(id)}
          >
            Generar Boleta
          </Button>,
        ];
      } else {
        return [];
      }
    },
  });

  return (
    <div
      style={{
        marginTop: 50,
        height: 400,
        width: '100%',
      }}
    >
      <Box
        sx={{
          margin: '0 auto',
          height: '600px',
          width: '100%%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <StripedDataGrid
          rows={rowsMisDdjj}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          getRowClassName={(params) =>
            rowsMisDdjj.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
          }
          localeText={dataGridStyle.toolbarText}
          slots={{
            toolbar: GridToolbar,
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
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={pageSizeOptions}
        />
      </Box>
    </div>
  );
};
