import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import './MisDDJJConsulta.css';
import {
  MisDDJJConsultaGrilla,
  castearMisDDJJ,
} from './grilla/MisDDJJConsultaGrilla';
import { axiosDDJJ } from './grilla/MisDDJJConsultaGrillaApi';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import localStorageService from '@/components/localStorage/localStorageService';
export const MisDDJJConsulta = ({
  setDDJJState,
  setPeriodo,
  rows_mis_ddjj,
  setRowsMisDdjj,
  setTabState,
  setPeticion,
  setTituloPrimerTab,
}) => {
  const ahora = dayjs().startOf('month');
  const ahoraMenosUnAnio = ahora.add(-11, 'month');
  const [fromDate, setFromDate] = useState(ahoraMenosUnAnio);
  const [toDate, setToDate] = useState(ahora);

  const ID_EMPRESA = localStorageService.getEmpresaId();

  const buscarDDJJ = async () => {
    console.log('dayjs(): ', dayjs());
    console.log('dayjs() - typeof : ', typeof dayjs());

    try {
      let desde = null;
      if (fromDate !== null) {
        desde = fromDate.startOf('month').format('YYYY-MM-DD');
      }
      let hasta = null;
      if (toDate !== null) {
        hasta = toDate.startOf('month').format('YYYY-MM-DD');
      }

      const ddjjResponse = await axiosDDJJ.consultar(ID_EMPRESA, desde, hasta);

      setRowsMisDdjj(ddjjResponse);
      //console.log('ddjjResponse', ddjjResponse);

      const ddjjCasteadas = castearMisDDJJ(ddjjResponse);
      //console.log('ddjjCasteadas', ddjjCasteadas);

      //setRowsMisDdjj(declaracionesFiltradas);
    } catch (error) {
      console.error('Error al buscar declaraciones juradas:', error);
    }
  };

  useEffect(() => {
    buscarDDJJ();
  }, []);

  return (
    <div>
      <div className="mis_declaraciones_juradas_container">
        <Stack
          spacing={4}
          direction="row"
          display="flex"
          justifyContent="initial"
          alignItems="center"
        >
          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label={'Periodo desde'}
              views={['month', 'year']}
              closeOnSelect={true}
              onChange={(oValue) => setFromDate(oValue)}
              value={fromDate}
            />
          </DemoContainer>

          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label={'Periodo hasta'}
              views={['month', 'year']}
              closeOnSelect={true}
              onChange={(oValue) => setToDate(oValue)}
              value={toDate}
            />
          </DemoContainer>
        </Stack>

        <Stack
          spacing={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            onClick={buscarDDJJ}
            variant="contained"
            style={{ marginLeft: '2em' }}
          >
            Buscar
          </Button>
        </Stack>
      </div>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <MisDDJJConsultaGrilla
          setDDJJState={setDDJJState}
          setPeriodo={setPeriodo}
          rows_mis_ddjj={rows_mis_ddjj}
          setRowsMisDdjj={setRowsMisDdjj}
          setTabState={setTabState}
          // setRowsAltaDDJJ={setRowsAltaDDJJ}
          setPeticion={setPeticion}
          setTituloPrimerTab={setTituloPrimerTab}
        />
      </Stack>
    </div>
  );
};
