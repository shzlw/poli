export const CUSTOM_STYLE = {
  control: (provided, state) => ({
    ...provided,
    background: '#ffffff',
    borderColor: state.isSelected ? '#bdbdbd' : '#e0e0e0',
    minHeight: '32px',
    height: '32px',
    boxShadow: 'rgba(50, 50, 93, 0.149) 0px 1px 3px, rgba(0, 0, 0, 0.0196) 0px 1px 0px',
    '&:hover': {
      borderColor: state.isFocused ? '#bdbdbd' : '#e0e0e0'
    }
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    height: '32px',
    padding: '0 6px'
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '32px',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    top: '45%'
  }),
  placeholder: (provided, state) => ({
    ...provided,
    top: '45%'
  }),
  menu: (provided, state) => ({
    ...provided,
    marginTop: '0px',
    zIndex: '100'
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#FFFFFF' : '#212121',
    backgroundColor: state.isSelected ? '#212121' : '#FFFFFF',
    padding: '6px 8px',
    '&:hover': {
      backgroundColor: '#C1C7D0',
      color: '#FFFFFF'
    }
  })
}