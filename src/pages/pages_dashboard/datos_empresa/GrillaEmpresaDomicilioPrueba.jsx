import { useState, useEffect } from 'react'
import axios from 'axios'

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const GrillaEmpresaDomicilioPrueba = () => {

    const [tipo, setTipo] = useState('');
    const [tipos, setTipos] = useState([]);
    const [provincia, setProvincia] = useState('');
    const [provincias, setProvincias] = useState([]);
    const [localidad, setLocalidad] = useState('');
    const [localidades, setLocalidades] = useState([]);

    const handleChangeTipo = (event) => {
        setTipo(event.target.value);
    };

    const handleChangeProvincia = (event) => {
        setProvincia(event.target.value);
        console.log(event.target.value);
        setLocalidad('');

        const idProvincia = event.target.value;

        try {

            const getLocalidades = async () => {


                const response = await axios.get(`${BACKEND_URL}/provincia/${idProvincia}/localidad`, {
                    headers: {
                        'Authorization': state.token,
                    }
                })

                const jsonData = await response.data;
                setLocalidades(jsonData.map((item) => ({ ...item })));

            }

            getLocalidades();

        } catch (error) {
            console.error('Error al consultar las localidades:', error);
        }
    };

    const handleChangeLocalidad = (event) => {
        setLocalidad(event.target.value);
    };


    const state = JSON.parse(localStorage.getItem('state'));

    useEffect(() => {

        const getTipoDomicilio = async () => {
            try {

                const response = await axios.get(`${BACKEND_URL}/empresa/domicilio/tipo`, {
                    headers: {
                        'Authorization': state.token,
                    }
                });

                const jsonData = await response.data;

                setTipos(jsonData);

            } catch (error) {

                console.error('Error al consultar los tipos de domicilio:', error);
            }
        }

        getTipoDomicilio();
    }, [])

    useEffect(() => {
        const getProvincias = async () => {

            try {

                const response = await axios.get(`${BACKEND_URL}/provincia`, {
                    headers: {
                        'Authorization': state.token,
                    }
                })

                const jsonData = await response.data;
                setProvincias(jsonData.map((item) => ({ ...item })));

            } catch (error) {
                console.error('Error al obtener provincias:', error);
            }
        }
        getProvincias();
    }, [])

    useEffect(() => {

        const getDatosEmpresa = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/empresa/:empresaId/domicilio`, {
                    headers: {
                        'Authorization': state.token,
                    }
                });
                const jsonData = await response.data;

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        getDatosEmpresa();

    }, []);


    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="label-tipo">Tipo</InputLabel>
                <Select
                    labelId="label-tipo"
                    id="select-tipo"
                    value={tipo}
                    label="Age"
                    onChange={handleChangeTipo}
                >
                    {/* Mapea los tipos de domicilio para crear dinámicamente los MenuItem */}
                    {tipos.map((tipo, index) => (
                        <MenuItem key={index} value={tipo.codigo}>
                            {tipo.descripcion}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="label-provincia">Provincia</InputLabel>
                <Select
                    labelId="label-provincia"
                    id="select-provincia"
                    value={provincia}
                    label="Provincia"
                    onChange={handleChangeProvincia}
                >
                    {/* Mapea las provincias para crear dinámicamente los MenuItem */}
                    {provincias.map((provincia, index) => (
                        <MenuItem key={index} value={provincia.id}>
                            {provincia.descripcion}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {
                localidades.length > 0 &&
                <FormControl fullWidth>
                    <InputLabel id="label-localidad">Localidad</InputLabel>
                    <Select
                        labelId="label-localidad"
                        id="select-localidad"
                        value={localidad}
                        label="Localidad"
                        onChange={handleChangeLocalidad}
                    >
                        {/* Mapea las localidades para crear dinámicamente los MenuItem */}
                        {localidades.map((localidad, index) => (
                            <MenuItem key={index} value={localidad.id}>
                                {localidad.descripcion}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
        </div>
    )
}
