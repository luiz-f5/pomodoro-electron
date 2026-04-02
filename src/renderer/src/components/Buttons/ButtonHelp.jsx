import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonHelp() {
  return <Button className="btn-settings" value="Ajuda" func={() => api.send('help')} />
}
