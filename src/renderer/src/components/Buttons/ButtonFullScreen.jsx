import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonFullScreen() {
  return <Button className="btn-settings" value="Tela cheia" func={() => api.send('fullscreen')} />
}
