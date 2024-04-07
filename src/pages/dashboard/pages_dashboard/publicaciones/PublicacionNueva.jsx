import {
  GridRowModes,
  GridToolbarContainer,
  GridToolbar,
} from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

export const EditarNuevaFila = (props) => {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const handleClick = () => {

    const newReg = {
      titulo: "",
      cuerpo: "",
      vigenciaDesde: "",
      vigenciaHasta: ""
    }

    volverPrimerPagina();
    
    setRows((oldRows) => [newReg, ...oldRows]);

    setRowModesModel((oldModel) => ({
      [0]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer>
      <GridToolbar showQuickFilter={props.showQuickFilter} />
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
};
