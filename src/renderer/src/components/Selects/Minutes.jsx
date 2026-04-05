import Dropdown from '../Template/Dropdown'

const minuteOptions = [
  { id: 1, value: '25:00:5:00', text: '25 min / 5 min pausa' },
  { id: 2, value: '50:00:10:00', text: '50 min / 10 min pausa' }
]

function Minutes({ value, onChange, disabled }) {
  return (
    <Dropdown
      options={minuteOptions}
      label="Duração"
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

export default Minutes
