import Select from "react-select"

const customStyles = {

    control: (provided) => ({
        ...provided,
        
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? '#fff' : '#18365D',
        backgroundColor: state.isSelected ? '#18365D' : '#fff',
        // hover
        ':hover': {
            backgroundColor: '#18365D',
            color: '#fff'
        }
    }),
}

const options = [
    { value: 'opcion1', label: 'Opción 1' },
    { value: 'opcion2', label: 'Opción 2' },
    { value: 'opcion3', label: 'Opción 3' },
];

export const CustomSelect = () => {

    const onHandleChange = (e) => {
        console.log(e)
    }

    return(
        <Select
            placeholder="Seleccionar Ramo"
            styles={customStyles}
            options={options}
            onChange={onHandleChange}
        />
    )
}
