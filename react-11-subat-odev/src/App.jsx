import { useState } from 'react'
import './App.css'

//Maksimum insan, minumum ai.
//  - Gemini (Pro)
// Bu sefer zorlandığım kısım dışında sizin önceden yazdığınız kodları temel
// ederek yazdım.
function App() {
  return (
    <>
      <title>React 11 Subat Odevleri</title>
      <div>
        <label>E-Posta: </label>
        <input type="email" placeholder='E-Posta giriniz' />
      </div>
      <div>
        <label>Parola: </label>
        <input type="password" placeholder='Parola giriniz' />
      </div>
      <button>Giriş Yap</button>
      <button>Temizle</button>
    </>
  )
}

export default App
