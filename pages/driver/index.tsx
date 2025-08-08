import { useEffect, useState } from 'react'

type Transfer = {
  id: string;
  source_name?: string;
  pickup_time?: string;
  status?: string;
}

export default function DriverPage(){
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('becken_token') : null

  useEffect(()=>{ fetchTransfers() },[])

  async function fetchTransfers(){
    const res = await fetch('/api/transfers',{headers: {'Authorization': 'Bearer '+token}})
    const data = await res.json()
    // filter for driver in backend but simple here
    setTransfers(data)
  }

  async function setStatus(id:string, status:string){
    await fetch('/api/transfers/'+id+'/status',{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({status})})
    fetchTransfers()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="sidebar">
        <h3 className="text-xl font-bold mb-4">Becken Kierowca</h3>
        <nav className="space-y-2">
          <a href="/driver" className="block p-2 rounded hover:bg-gray-100">Dashboard</a>
          <a href="/driver/history" className="block p-2 rounded hover:bg-gray-100">Historia</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <header className="header mb-6">
          <h1 className="text-2xl font-semibold">Panel Kierowcy</h1>
          <div>
            <button className="btn" onClick={()=>{ localStorage.removeItem('becken_token'); location.href='/auth/login' }}>Wyloguj</button>
          </div>
        </header>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-3">Nadchodzące transfery</h2>
          <table className="table w-full">
            <thead><tr><th>ID</th><th>Źródło</th><th>Pickup</th><th>Status</th><th>Akcja</th></tr></thead>
            <tbody>
              {transfers.map(t=>(
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">{t.source_name}</td>
                  <td className="p-3">{t.pickup_time}</td>
                  <td className="p-3">{t.status}</td>
                  <td className="p-3">
                    <button className="btn mr-2" onClick={()=>setStatus(t.id,'Wykonane')}>✅</button>
                    <button className="btn mr-2" onClick={()=>setStatus(t.id,'No-show')}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}
