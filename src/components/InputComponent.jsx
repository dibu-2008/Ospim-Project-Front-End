import * as React from 'react';
import TextField from '@mui/material/TextField';

export const InputComponent = (props) => {

    const { type, name, id, value, onChange, autocomplete, variant, label} = props;

    return (
        <TextField
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          autoComplete={autocomplete}
          variant={variant}
          label={label}
          sx={{}}
        />
      );
}
