import React, { useEffect, useState } from 'react'
import { listByCreator } from './api'
import CreateForm from './components/CreateForm'
import RequestList from './components/RequestList'
import SimulateCard from './components/SimulateCard'

function newGuid() { return crypto.randomUUID() }

export default function App() {
  const [creatorId, setCreatorId] = useState<string>(() => localStorage.getItem('creatorId') || '')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { localStorage.setItem('creatorId', creatorId) }, [creatorId])

  const refresh = async () => {
    if (!creatorId) return setItems([])
    setLoading(true)
    try { setItems(await listByCreator(creatorId)) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { refresh() }, [creatorId])

  return (
    <div className="container">
      <div className="header">
        <div className="brand"><span className="dot"></span> LastLink Anticipation</div>
      </div>

      <div className="grid">
        <div className="card">
          <h3 style={{marginTop:0}}>Creator</h3>
          <div className="row">
            <div>
              <label>Creator ID (GUID)</label>
              <input value={creatorId} onChange={e => setCreatorId(e.target.value)} placeholder="00000000-0000-0000-0000-000000000000" />
            </div>
          </div>
          <div className="actions">
            <button className="btn secondary" onClick={() => setCreatorId(newGuid())}>Gerar GUID</button>
            <button className="btn" onClick={refresh} disabled={!creatorId || loading} title="Buscar solicitações do creator atual">
              {loading ? 'Atualizando…' : 'Ver antecipações desse ID'}
            </button>
          </div>
        </div>

        <SimulateCard />
      </div>

      <CreateForm creatorId={creatorId} onCreated={refresh} />
      <RequestList items={items} onRefresh={refresh} />

      <footer>
      </footer>
    </div>
  )
}
