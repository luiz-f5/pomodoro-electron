function Button({ className, value, func, disabled = false }) {
  return (
    <button onClick={func} className={className} disabled={disabled}>
      {value}
    </button>
  )
}

export default Button
