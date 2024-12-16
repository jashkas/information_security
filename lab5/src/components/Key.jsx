import React, { useEffect } from 'react'

export default function Key({label = '', key_gen = '', key_save = '' , onLoadKey = (key_save) => {}, onGenerate = (key_save) => {}}) {

  const [enabled, setEnabled] = React.useState(true)

  useEffect(() => {
    setInterval(() => {
      const key = localStorage.getItem(key_save)
      if (key) {
        setEnabled(false)
      } else {
        setEnabled(true)
      }
    }, 1000)
  }, [key_save])

  function onSaveKey() {
    if (key_save !== '' && key_gen !== '') {
      localStorage.setItem(key_save, key_gen)
    } else {
      alert('Пожалуйста, сгенерируйте ключ')
    }
  }

  return (
    <div className="key-iv">
      <div>
        <p className='label'>{label}</p>
        <p className='key'>{key_gen}</p>
      </div>
      <div>
        <button onClick={() => onGenerate(key_save)}>Generate Key</button>
        <button onClick={onSaveKey} className='save key'>Save Key</button>
        <button disabled={enabled} onClick={() => onLoadKey(key_save)} className='load key'>Load Key</button>
      </div>
    </div>
  )
}
