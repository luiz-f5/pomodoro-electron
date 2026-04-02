import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonReload() {
  return <Button className="btn-settings" value="Resetar" func={() => api.send('reload')} />
}
