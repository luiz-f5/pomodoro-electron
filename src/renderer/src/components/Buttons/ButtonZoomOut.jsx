import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonZoomOut() {
  return <Button className="btn-settings" value="Diminuir Zoom" func={() => api.send('zoom-out')} />
}
