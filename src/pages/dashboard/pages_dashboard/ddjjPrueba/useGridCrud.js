import { GridRowModes, GridRowEditStopReasons } from '@mui/x-data-grid';
import { axiosDDJJ } from '../ddjjPrueba/DDJJApi';
import { useGridValidaciones } from './useGridValidaciones';
import { DDJJMapper } from './DDJJMapper';

//gridApiRef=> parametrizado
//const [rowModesModel, setRowModesModel] = useState({});

const processRowUpdate = async (ddjjCabe, newRow) => {
  try {
    //Actualiza Validaciones del registro nuevo.-
    console.log('useGridCrud - processRowUpdate - 1 - newRow:', newRow);

    //Mapeo a dto Backend
    const DDJJ = DDJJMapper.regToDDJJValDto(ddjjCabe, newRow);
    console.log('useGridCrud - processRowUpdate - 2 - DDJJ:', DDJJ);

    //Ejecuto validaciones Backend
    const val = await axiosDDJJ.validar(ddjjCabe.empresaId, DDJJ);
    console.log('useGridCrud - processRowUpdate - 3 - val:', val);

    if (val && val.errores && val.errores.length > 0) {
      //Si hay errores en el registro, los agrego a las validaciones existentes
      console.log('useGridCrud - processRowUpdate - 4');
      useGridValidaciones.add(val.errores);
      console.log('useGridCrud - processRowUpdate - 5');
      newRow.gErrores = true;
    } else {
      console.log('useGridCrud - processRowUpdate - 5.. REMOVE()');
      useGridValidaciones.remove(newRow.cuil);
      newRow.gErrores = false;
    }
    console.log('useGridCrud - processRowUpdate - 6 - newRow:', newRow);
    return newRow;
  } catch (error) {
    console.log(error);
  }
};
const handleDeleteClick = (gridApiRef, row) => {
  console.log('useCridCrud - handleDeleteClick - HOLA');
  gridApiRef.current.updateRows([{ id: row.id, _action: 'delete' }]);
  useGridValidaciones.remove(row.cuil);
};
const handleRowEditStop = (gridApiRef, params) => {
  console.log('useGridCrud - handleRowEditStop - 1');
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    gridApiRef.current?.stopRowEditMode({
      id: params.id,
      ignoreModifications: false,
    });
  }
  console.log('useGridCrud - handleRowEditStop - 2');
};
const handleCancelClick = (gridApiRef, row) => {
  useGridCrud.setRowModesModel({
    ...useGridCrud.getRowModesModel,
    [row.id]: { mode: GridRowModes.View, ignoreModifications: true },
  });
  //const editedRow = rows.find((row) => row.id === id);
  if (row.regId && row.regId == null) {
    gridApiRef.current.updateRows([{ id: row.id, _action: 'delete' }]);
  }
};
const handleRowModesModelChange = (newRowModesModel) => {
  console.log('useGridCrud - handleRowModesModelChange - 1 ');
  useGridCrud.setRowModesModel(newRowModesModel);
  console.log('useGridCrud - handleRowModesModelChange - 2');
};
const handleEditClick = (id) => {
  console.log('handleEditClick - id: ' + id);
  //const editedRow = rows.find((row) => row.id === id);
  //getCategoriasCamara(editedRow.camara);
  useGridCrud.setRowModesModel({
    ...useGridCrud.getRowModesModel,
    [id]: { mode: GridRowModes.Edit },
  });
};
const handleSaveClick = (id) => {
  console.log('useGridCrud - handleSaveClick - 1');
  useGridCrud.setRowModesModel({
    ...useGridCrud.getRowModesModel,
    [id]: { mode: GridRowModes.View },
  });
  console.log('useGridCrud - handleSaveClick - 2');
};
const onProcessRowUpdateError = (error) => {
  console.log(error);
};

export const useGridCrud = {
  processRowUpdate: processRowUpdate,
  onProcessRowUpdateError: onProcessRowUpdateError,
  handleDeleteClick: handleDeleteClick,
  handleRowEditStop: handleRowEditStop,
  handleCancelClick: handleCancelClick,
  handleRowModesModelChange: handleRowModesModelChange,
  handleEditClick: handleEditClick,
  handleSaveClick: handleSaveClick,
  getRowModesModel: null,
  setRowModesModel: null,
};
