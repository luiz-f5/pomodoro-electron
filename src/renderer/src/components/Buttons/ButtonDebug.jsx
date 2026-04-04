import Button from '../Template/Button'
const api = window.menuAPI

export default function ButtonDebug() {
  return (
    <Button
      className="btn-settings"
      value="Debug"
      menuOptions={[
        {
          label: 'Abrir console',
          onClick: () => api.send('debug'),
        },
        {
          label: 'Resetar',
          onClick: () => api.send('reload'),
        },
        {
          label: 'Forçar resetar',
          onClick: () => api.send('force-reload'),
        },
      ]}
    />
  )
}