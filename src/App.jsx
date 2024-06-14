import NavBar from './components/navbar/NavBar';
import AppRouter from './router/AppRouter';
import { AppTheme } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';

function App() {
  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={'es'}
        localeText={
          esES.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <AppTheme>
          <AppRouter />
        </AppTheme>
      </LocalizationProvider>
    </>
  );
}

export default App;
