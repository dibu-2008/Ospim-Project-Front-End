import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { axiosGestionRoles } from './GestionRolesApi';
import { DragAndDrop } from './DragAndDrop';
import './GestionRoles.css';

export const GestionRoles = () => {
  const [roles, setRoles] = useState([]);
  const [rol, setRol] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosGestionRoles.getFuncionalidadesByRol();
      setRoles(response);
      setRol(response[0]);
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    const selectedRol = roles.find((r) => r.id === event.target.value);
    setRol(selectedRol || {});
  };

  useEffect(() => {
    console.log(roles);
  }, []);

  return (
    <>
      <div className="container">
        <h1>Gestion Roles</h1>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Nombre Rol</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={rol.id || ''}
            label="Rol"
            onChange={handleChange}
          >
            {roles.map((element) => (
              <MenuItem key={element.id} value={element.id}>
                {element.descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DragAndDrop tareas={roles.find((e) => e.id == rol.id)}></DragAndDrop>
      </div>
    </>
  );
};
