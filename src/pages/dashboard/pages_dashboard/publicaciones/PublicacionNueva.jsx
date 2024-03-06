import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

export const EditarNuevaFila = (props) => {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const handleClick = () => {
    const maxId = rows ? Math.max(...rows.map((row) => row.id), 0) : 1;
    const newId = maxId + 1;
    const id = newId;

    volverPrimerPagina();

    setRows((oldRows) => [
      {
        id,
        titulo: "",
        cuerpo: "",
        vigenciaDesde: "",
        vigenciaHasta: "",
        isNew: true,
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
};
