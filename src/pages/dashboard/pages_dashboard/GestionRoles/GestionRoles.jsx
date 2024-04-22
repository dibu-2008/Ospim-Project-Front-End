import {
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { axiosGestionRoles } from './GestionRolesApi';
import Card from '@mui/material/Card';

export const GestionRoles = () => {
  const [roles, setRoles] = useState([]);
  const [rol, setRol] = useState({});
	const [funcionalidades, setFuncionalidades] = useState([]);
	const [funcionalidadesByRol, setFuncionalidadesByRol] = useState([]);
  const [funcionalidadesActivas, setFuncionalidadesActivas] = useState([]);
  const [funcionalidadesInactivas, setFuncionalidadesInactivas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosGestionRoles.getRoles();
      setRoles(response);
      setRol(response.length > 0 ? response[0] : {});
      const funcionalidades = await axiosGestionRoles.getFuncionalidades(); //traigo la lista de funcionalidades
      // traigo las listas del primer rol que es el que va por defecto
      const funcionalidadesActivasReponse =
        await axiosGestionRoles.getFuncionalidadesByRol();
      // filtro los elementos para armar las funcionalidades activas e inactivas
      const funcionalidadesActivas = funcionalidadesActivasReponse[0].funcionalidades;

			const funcionalidadesInactivas = funcionalidades.filter(
        (funcionalidad) => funcionalidad.id === funcionalidadesActivas.id,
      );
			setFuncionalidades(funcionalidades)
			setFuncionalidadesByRol(funcionalidadesActivasReponse)
      setFuncionalidadesActivas(funcionalidadesActivas);
      setFuncionalidadesInactivas(funcionalidadesInactivas);
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    const selectedRol = roles.find((r) => r.id === event.target.value);
    setRol(selectedRol || {});
		
		
		const factivas = funcionalidadesByRol.find(f => f.rolId === event.target.value )
		console.log(factivas)
		setFuncionalidadesActivas(factivas)
		//console.log(funcionalidades)
		//console.log(funcionalidadesActivas)
		const funcionalidadesInactivas = funcionalidades.filter(
			(funcionalidad) => funcionalidad.id === funcionalidadesActivas.id,
		);
		setFuncionalidadesInactivas(funcionalidadesInactivas)
  };

	const startDrag = (evt, item) =>{
		evt.dataTransfer.setData('itemId', item.id)
		console.log(item)
	}

	const dragginOver = (evt) =>{
		evt.preventDefault()
	}

	const onDrop = (evt, list) => {
		const itemId = evt.dataTransfer.getData('itemId')
		//const item = 
	}

  return (
    <>
      <Button
        onClick={() =>
          console.log(
            'funcionalidades activas: ' +
              funcionalidadesActivas +
              ' \nfuncionalidades inactivas:' +
              funcionalidadesInactivas,
							' \nfuncionalidades: ' +
              funcionalidades,
          )
        }
      >
        clickme
      </Button>
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
      <div>
				<strong>Activas</strong>
        <div droppable="true" onDragOver={evt =>dragginOver(evt)}>
          {funcionalidadesActivas.map((fa) => (
            <Card key={fa.id} draggable onDragStart={(evt) => startDrag(evt,fa)} >{fa.descripcion}</Card>
          ))}
        </div>
				<div>
					<strong>Inactivas</strong>
          {funcionalidadesInactivas.map((fa) => (
            <Card key={fa.id}>{fa.descripcion}</Card>
          ))}
        </div>
      </div>
    </>
  );
};
