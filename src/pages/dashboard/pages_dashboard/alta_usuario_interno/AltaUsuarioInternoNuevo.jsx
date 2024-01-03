import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

export const AltaUsuarioInternoNuevo = (props) => {
  const { setRows, rows, setRowModesModel } = props;

  const handleClick = () => {
    const maxId = Math.max(...rows.map((row) => row.id), 0);

    const newId = maxId + 1;

    const id = newId;

    setRows((oldRows) => [
      {
        id,
        apellido: "",
        nombre: "",
        descripcion: "",
        email: "",
        clave: "",
        password2: "",
        rolId: "",
        habilitado: null,
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
