import { useEffect, useState } from 'react'

type Transfer = {
  id: string;
  source_name?: string;
  pickup_time?: string;
  status?: string;
  driver_name?: string;
}

export default function AdminPage(){
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('becken_token') : null

  useEffect(()=>{ fetchTransfers() },[])

  async function fetchTransfers(){
    const res = await fetch('/api/transfers',{headers: {'Authorization': 'Bearer '+token}})
    const data = await res.json()
    setTransfers(data)
  }

  async function setStatus(id:string, status:string){
    await fetch('/api/transfers/'+id+'/status',{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({status})})
    fetchTransfers()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="sidebar">
        <h3 className="text-xl font-bold mb-4">Becken Admin</h3>
        <nav className="space-y-2">
          <a href="/admin" className="block p-2 rounded hover:bg-gray-100">Dashboard</a>
          <a href="/admin/drivers" className="block p-2 rounded hover:bg-gray-100">Kierowcy</a>
          <a href="/admin/vehicles" className="block p-2 rounded hover:bg-gray-100">Pojazdy</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <header className="header mb-6">
          <h1 className="text-2xl font-semibold">Panel Administratora</h1>
          <div>
            <button className="btn" onClick={()=>{ localStorage.removeItem('becken_token'); location.href='/auth/login' }}>Wyloguj</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <p className="text-sm text-gray-500">Łącznie transferów</p>
            <p className="text-2xl font-bold">{transfers.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Wykonane</p>
            <p className="text-2xl font-bold text-green-600">{transfers.filter(t=>t.status==='Wykonane').length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">No-show</p>
            <p className="text-2xl font-bold text-red-600">{transfers.filter(t=>t.status==='No-show').length}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Transfery</h2>
          <table className="table w-full">
            <thead>
              <tr><th>ID</th><th>Kierowca</th><th>Źródło</th><th>Pickup</th><th>Status</th><th>Akcja</th></tr>
            </thead>
            <tbody>
              {transfers.map(t=>(
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">{t.driver_name}</td>
                  <td className="p-3">{t.source_name}</td>
                  <td className="p-3">{t.pickup_time}</td>
                  <td className="p-3">{t.status}</td>
                  <td className="p-3">
                    <button className="btn mr-2" onClick={()=>setStatus(t.id,'Wykonane')}>Wykonane</button>
                    <button className="btn mr-2" onClick={()=>setStatus(t.id,'No-show')}>No-show</button>
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
