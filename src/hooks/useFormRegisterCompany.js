import { useState } from 'react';

export const useFormRegisterCompany = (initialState = {}) => {
  const [formState, setFormState] = useState(initialState);

  const OnInputChangeRegisterCompany = ({ target }) => {
    const { name, value } = target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const OnResetFormRegisterCompany = () => {
    setFormState(initialState);
  };

  return {
    ...formState,
    formState,
    OnInputChangeRegisterCompany,
    OnResetFormRegisterCompany,
  };
};
