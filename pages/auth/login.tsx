import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const router = useRouter()

  const submit = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
      const data = await res.json()
      if(data.token){
        localStorage.setItem('becken_token', data.token)
        // determine role
        const payload = JSON.parse(atob(data.token.split('.')[1]))
        if(payload.role==='admin') router.push('/admin')
        else router.push('/driver')
      } else {
        alert(data.error || 'Błąd logowania')
      }
    } catch(err){
      alert('Błąd połączenia')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md card">
        <h2 className="text-2xl font-bold mb-4">Becken — Logowanie</h2>
        <form onSubmit={submit} className="space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded"/>
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Hasło" type="password" className="w-full p-2 border rounded"/>
          <div className="flex justify-between items-center">
            <button className="btn" disabled={loading}>{loading? 'Ładowanie...':'Zaloguj'}</button>
            <a className="text-sm text-gray-500" href="#">Reset hasła</a>
          </div>
        </form>
      </div>
    </div>
  )
}
