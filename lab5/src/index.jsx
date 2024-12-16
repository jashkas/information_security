import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import Key from './components/Key'
import './index.css'
import CryptoJS from 'crypto-js'

export default function App() {


  const [keys, setKey] = React.useState({
    key: null,
    iv: null
  })

  const [text, setText] = React.useState("")
  const [outputText, setOutputText] = React.useState("")









  function generateKey(save_key) {
    function generateRandom(length) {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 16).toString(16);
      }
      return result;
    }

    const key = generateRandom(16); // 8 байт = 16 hex символов

    const keysLocal = { ...keys }
    keysLocal[save_key] = key
    setKey(keysLocal)

  }

  function onLoadKey(save_key) {
    const key = localStorage.getItem(save_key);
    if (key) {
      const keysLocal = { ...keys }
      keysLocal[save_key] = key
      setKey(keysLocal)
    }

  }

  function encrypt() {

    if (!keys.key || !keys.iv) {
      alert("Please enter valid 8-byte (16 hex characters) key and IV.");
      return;
    }

    try {
      const key = CryptoJS.enc.Hex.parse(keys.key);
      const iv = CryptoJS.enc.Hex.parse(keys.iv);
      const cipherText = CryptoJS.DES.encrypt(text, key, {
        mode: CryptoJS.mode.CBC,
        iv: iv
      });
      setOutputText(cipherText.ciphertext.toString());
    } catch (error) {
      console.error("Encryption error:", error);
      alert("Encryption failed. Check your key and IV.");
    }
  }
  function decrypt() {
    if (!keys.key || !keys.iv) {
      alert(
        "Please enter valid 8-byte (16 hex characters) key and IV, and ciphertext."
      );
      return;
    }

    try {
      const key = CryptoJS.enc.Hex.parse(keys.key);

      const iv = CryptoJS.enc.Hex.parse(keys.iv);

      const ciphertext = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(text),
        key: key,
        iv: iv,
        mode: CryptoJS.mode.CBC
      });

      const decrypted = CryptoJS.DES.decrypt(ciphertext, key, {
        mode: CryptoJS.mode.CBC,
        iv
      });
      setOutputText(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Decryption error:", error);
      alert("Decryption failed. Check your key, IV, and ciphertext.");
    }
  }








  return (
    <div className="container">
      <h1>DES Encryption/Decryption (CBC Mode)</h1>

      <Key label='Key (8-byte hex):' key_gen={keys.key} key_save={Object.keys(keys)[0]} onLoadKey={onLoadKey} onGenerate={generateKey} />
      <Key label='IV (8-byte hex):' key_gen={keys.iv} onLoadKey={onLoadKey} key_save={Object.keys(keys)[1]} onGenerate={generateKey} />


      <textarea placeholder="Enter text here" value={text} onChange={(e) => setText(e.target.value)}></textarea>
      <button onClick={encrypt}>Encrypt</button>
      <button onClick={decrypt}>Decrypt</button>
      <textarea placeholder="Output text" disabled value={outputText}></textarea>

    </div>
  )
}


ReactDOM.createRoot(document.getElementById('root'))
  .render(
    <StrictMode>
      <App />
    </StrictMode>
  )

