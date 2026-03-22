import Button from '../Template/Button'

const api = window.widgetAPI

function ButtonMax() {
  return <Button func={api.maximizar} className="btn-max" value="□" />
}

export default ButtonMax
