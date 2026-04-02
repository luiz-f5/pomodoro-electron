import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonQuit() {
  return <Button className="btn-settings" value="Sair" func={() => api.send('quit')} />
}
