// ReusableInput.jsx

import * as React from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useController } from 'react-hook-form';
import { Controller } from 'react-hook-form';



const RHFSelect = ({ control, name, options,label, placeholder, ...rest }) => {
    const {
        field: { value, onChange },
        fieldState: { invalid, error },
    } = useController({
        name,
        control,
        defaultValue: '',
    });
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormControl fullWidth >
                        <Select
                            id="select"
                            labelId="select-label"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            error={invalid} 
                            sx={{  borderRadius: '8px' }}
                            {...rest}
                            displayEmpty
                            placeholder={placeholder}
                            inputProps={{ autoComplete: 'off' }}
                        >
                            {options.map((option:any) => (
                            <MenuItem key={option.value} value={option.value} >
                                {option.label}
                            </MenuItem>
                            ))}
                        </Select>
                        {invalid && <span style={{ fontSize: '0.75rem', color: '#d32f2f', marginRight: '14px', marginLeft: '14px',  fontWeight: 400, marginTop: '3px' }}>{error?.message}</span>}
                </FormControl>
            )}
        />
    );
};

export default RHFSelect;