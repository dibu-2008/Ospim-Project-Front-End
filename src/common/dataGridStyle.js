import { alpha, styled } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";

const ODD_OPACITY = 0.2;

export const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },

  // quiero que odd tenga un hover verde
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: "#fff",
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

//textos en castellano del Toolbar
const toolbarText = {
  toolbarColumns: "Columnas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Estilo",
  toolbarExport: "Exportar",
  columnMenuUnsort: "Desordenar",
  columnMenuSortAsc: "Ordenar Ascendente",
  columnMenuSortDesc: "Ordenar Descendente",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar Columna",
  columnMenuShowColumns: "Mostrar columnas",
  
};

export const dataGridStyle = {
  toolbarText: toolbarText,
  ODD_OPACITY: ODD_OPACITY,
};

export default StripedDataGrid;
