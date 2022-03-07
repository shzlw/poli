export const CUSTOM_STYLE = {
  control: (provided, state) => ({
    ...provided,
    width: '100%',
    background: '#ffffff',
    borderColor: state.isSelected ? '#bdbdbd' : '#e0e0e0',
    minHeight: '33px',
    height: '33px',
    boxShadow: 'rgba(50, 50, 93, 0.149) 0px 1px 3px, rgba(0, 0, 0, 0.0196) 0px 1px 0px',
    '&:hover': {
      borderColor: state.isFocused ? '#bdbdbd' : '#e0e0e0'
    }
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    height: '33px',
    padding: '0 6px',
    width: '100%',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '33px',
    width: '100%',
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