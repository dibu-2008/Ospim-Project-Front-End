import React from 'react';
import { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StyleIcon from '@mui/icons-material/Style';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { Link, Outlet } from 'react-router-dom';

const DashboardPage = () => {

  const [value, setValue] = useState(0);

  return (
    <div className="container_dashboard_register_company">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Inicio" icon={<HomeIcon />} component={Link} to="./inicio" />
        <BottomNavigationAction label="Feriados" icon={<LibraryBooksIcon />} component={Link} to="./feriados" />
        <BottomNavigationAction label="DDJJ" icon={<LibraryBooksIcon />} component={Link} to="./ddjj" />
        <BottomNavigationAction label="Boletas" icon={<StyleIcon />} component={Link} to="./boletas" />
        <BottomNavigationAction label="Pagos" icon={<AccountBalanceWalletIcon />} component={Link} to="./pagos" />
        <BottomNavigationAction label="Mis datos" icon={<PersonIcon />} component={Link} to="./misdatos" />
        <BottomNavigationAction label="Salir" icon={<CloseIcon />} />
      </BottomNavigation>

      <Outlet />

    </div>
  );
};

export default DashboardPage;
