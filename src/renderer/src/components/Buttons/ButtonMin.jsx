import Button from '../Template/Button'

const api = window.widgetAPI

function ButtonMin() {
  return <Button func={api.minimizar} className="btn-min" value="─" />
}

export default ButtonMin
