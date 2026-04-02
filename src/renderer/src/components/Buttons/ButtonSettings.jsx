import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonSettings() {
  return (
    <Button className="btn-settings" value="Configurações" func={() => api.send('secondary')} />
  )
}
