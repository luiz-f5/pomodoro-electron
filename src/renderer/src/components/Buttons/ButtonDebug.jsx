import Button from '../Template/Button'
const api = window.menuAPI
export default function ButtonDebug() {
  return <Button className="btn-settings" value="Debug" func={() => api.send('debug')} />
}
