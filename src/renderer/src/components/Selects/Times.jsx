import Select from '../Template/Select'

const timesOptions = [
  { id: 1, value: '1', text: '1' },
  { id: 2, value: '2', text: '2' },
  { id: 3, value: '3', text: '3' },
  { id: 4, value: '4', text: '4' }
]

function Times({ value, onChange, disabled }) {
  return (
    <Select
      options={timesOptions}
      label="Número de loops"
      name="times"
      value={value}
      func={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  )
}

export default Times
