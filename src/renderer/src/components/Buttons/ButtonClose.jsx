import Button from '../Template/Button'

const api = window.widgetAPI

function fechar() {
  api.pararSessao().finally(() => api.fechar())
}

function ButtonClose() {
  return <Button func={fechar} className="btn-close" value="✕" />
}

export default ButtonClose
