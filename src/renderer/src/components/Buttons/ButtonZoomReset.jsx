import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonZoomReset() {
  return (
    <Button className="btn-settings" value="Tamanho original" func={() => api.send('zoom-reset')} />
  )
}
