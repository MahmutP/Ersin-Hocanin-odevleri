import { useState } from 'react'
import './App.css'

//Maksimum insan, minumum ai.
//  - Gemini (Pro)
// Bu sefer zorlandığım kısım dışında sizin önceden yazdığınız kodları temel
// ederek yazdım. Biraz daha derinlemesine inceleyip daha iyi anlayabilirim.
// Lakin loginSuccess tamamen yapay zeka fikriyle yazdım. Yeni bir şey öğrendim.
function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setError('');
  }
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setError('');
  }
  const clickReset = () => {
    setEmail('');
    setPassword('');
    setError('');
  }
  const clickSubmit = () => {
    if (email === '' || password === '') {
      setError('Lütfen e-posta ve parola giriniz');
    } else if (email === 'ornek@xyz.com' && password === '12345') {
      setLoginSuccess(true);
      setError('');
    } else {
      setError('E-posta veya parola hatalı');
    }
  }

  if (loginSuccess) {
    return (
      <div>Giriş Başarılı</div>
    )
  }

  return (
    <>
      <title>React 11 Subat Odevleri</title>
      <div>
        <label>E-Posta: </label>
        <input type="email" placeholder='E-Posta giriniz' onChange={handleChangeEmail} value={email} />
      </div>
      <div>
        <label>Parola: </label>
        <input type="password" placeholder='Parola giriniz' onChange={handleChangePassword} value={password} />
      </div>
      <div>{error}</div>
      <button onClick={clickSubmit}>Giriş Yap</button>
      <button onClick={clickReset}>Temizle</button>
    </>
  )
}

export default App
