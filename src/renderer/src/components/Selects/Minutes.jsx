import Select from '../Template/Select'

const minuteOptions = [
  { id: 1, value: '25:00:5:00', text: '25:00 / 5:00' },
  { id: 2, value: '50:00:10:00', text: '50:00 / 10:00' }
]

function Minutes({ value, onChange, disabled }) {
  return (
    <Select
      options={minuteOptions}
      label="Duração do timer"
      name="minutes"
      value={value}
      func={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  )
}

export default Minutes
