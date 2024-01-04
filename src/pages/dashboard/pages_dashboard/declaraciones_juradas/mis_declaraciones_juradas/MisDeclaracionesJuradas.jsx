import { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import './MisDeclaracionesJuradas.css'
import { GrillaMisDeclaracionesJuradas } from './grilla_mis_declaraciones_juradas/GrillaMisDeclaracionesJuradas';

export const MisDeclaracionesJuradas = () => {

    const [rows_mis_ddjj, setRowsMisDdjj] = useState([]); 
    const [desde, setDesde] = useState(null);
    const [hasta, setHasta] = useState(null);
    const TOKEN = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.usuario.token;
    const ID_EMPRESA = JSON.parse(localStorage.getItem('stateLogin')).usuarioLogueado.empresa.id;

    const handleChangeDesde = (date) => {

        setDesde(date);
        console.log(date ? date.toISOString() : null);
    };

    const handleChangeHasta = (date) => {

        setHasta(date);
        console.log(date ? date.toISOString() : null);
    };

    return (
        <div>
            <div className='mis_declaraciones_juradas_container'>
                <Stack
                    spacing={4}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Periodo desde"
                                value={desde}
                                onChange={handleChangeDesde}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Periodo hasta"
                                value={hasta}
                                onChange={handleChangeHasta}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Stack>

                <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >

                    <Button variant="contained">Buscar</Button>
                    <Button variant="contained">Exportar</Button>

                </Stack>

            </div>
            <Stack
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <GrillaMisDeclaracionesJuradas
                    rows_mis_ddjj={rows_mis_ddjj}
                    setRowsMisDdjj={setRowsMisDdjj}
                    token={TOKEN}
                    idEmpresa={ID_EMPRESA}
                />
            </Stack>
        </div>

    )
}
