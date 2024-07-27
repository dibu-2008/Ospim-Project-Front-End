import oAxios from '@components/axios/axiosInstace';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  IconButton,
  alpha,
  Grid,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
} from '@mui/material';
import { patch } from './axios/EntityCrud';
import swal from './swal/swal';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #1A76D2',
  boxShadow: 24,
  p: 4,
};

export const ClaveComponent = ({ showModal, setShowModal }) => {
  const [clave, setClave] = useState('');
  const [claveNueva, setClaveNueva] = useState('');

  const [claveNuevaRepe, setClaveNuevaRepe] = useState('');
  const [claveNuevaRepeError, setClaveNuevaRepeError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleFormSubmit = async (e) => {
    console.log('claveNueva:', claveNueva);
    if (
      claveNuevaRepe != claveNueva ||
      claveNueva == '' ||
      claveNuevaRepe == '' ||
      clave == ''
    ) {
      return false;
    }
    const URL = '/usuario/clave';
    e.preventDefault();
    const bRta = await patch(URL, { clave, claveNueva });
    setShowModal(!showModal);
  };

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(!showModal)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={handleFormSubmit}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '5px',
              width: '400px',
              marginBottom: '20px',
              color: theme.palette.primary.main,
            }}
          >
            Gestion de Clave
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl variant="outlined" fullWidth margin="dense">
                <InputLabel htmlFor="clave">Clave</InputLabel>
                <OutlinedInput
                  id="clave"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Clave"
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" fullWidth margin="dense">
                <InputLabel htmlFor="clave-nueva">Nueva Clave</InputLabel>
                <OutlinedInput
                  id="clave-nueva"
                  value={claveNueva}
                  onChange={(e) => setClaveNueva(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Clave Nueva"
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                fullWidth
                margin="dense"
                error={claveNuevaRepeError}
              >
                <InputLabel htmlFor="clave-nueva">Repetir Clave </InputLabel>
                <OutlinedInput
                  id="clave-nueva"
                  value={claveNuevaRepe}
                  onChange={(e) => {
                    setClaveNuevaRepe(e.target.value);
                    setClaveNuevaRepeError(e.target.value != claveNueva);
                  }}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Clave Nueva"
                />
              </FormControl>
            </Grid>
          </Grid>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ width: '76%' }}
          >
            <Button
              variant="contained"
              sx={{ marginTop: '20px' }}
              type="submit"
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              sx={{ marginTop: '20px' }}
              onClick={() => setShowModal(!showModal)}
            >
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
