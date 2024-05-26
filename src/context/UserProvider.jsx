import React, { useState } from 'react';
import { UserContext } from './userContext';

export const UserProvider = ({ children }) => {
  const pageSizeOptions = [50, 75, 100];
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 50,
    page: 0,
  });
  return (
    <UserContext.Provider
      value={{
        paginationModel,
        setPaginationModel,
        pageSizeOptions,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
