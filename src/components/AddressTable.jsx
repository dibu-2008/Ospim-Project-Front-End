import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "name", label: "", minWidth: 50 },
  { id: "tipo", label: "Tipo", minWidth: 70 },
  {
    id: "provincia",
    label: "Provincia",
    minWidth: 70,
  },
  {
    id: "localidad",
    label: "Localidad",
    minWidth: 70,
  },
  {
    id: "calle",
    label: "Calle",
    minWidth: 70,
  },
  {
    id: "numero",
    label: "N°",
    minWidth: 70,
  },
  {
    id: "piso",
    label: "Piso",
    minWidth: 70,
  },
  {
    id: "depto",
    label: "Depto",
    minWidth: 70,
  },
  {
    id: "oficina",
    label: "Oficina",
    minWidth: 70,
  },
  {
    id: "cp",
    label: "CP",
    minWidth: 70,
  },
  {
    id: "planta",
    label: "Planta",
    minWidth: 70,
  },
];

const rows = ["fila1", "fila2", "fila3"];

export const AddressTable = () => {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
