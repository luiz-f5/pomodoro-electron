import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonForceReload() {
  return (
    <Button className="btn-settings" value="Forçar resetar" func={() => api.send('force-reload')} />
  )
}
