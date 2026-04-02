import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonZoomIn() {
  return <Button className="btn-settings" value="Aumentar zoom" func={() => api.send('zoom-in')} />
}
