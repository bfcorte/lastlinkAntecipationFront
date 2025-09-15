import React, { useState } from 'react'
import { createAnticipation, formatMoney, isoLocalNow } from '../api'

type Props = { creatorId: string; onCreated: () => void }

export default function CreateForm({ creatorId, onCreated }: Props) {
  const [valor, setValor] = useState<number>(250)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const dataSolicitacao = isoLocalNow() // <-- data/hora local do PC
      await createAnticipation({ creatorId, valorSolicitado: valor, dataSolicitacao })
      onCreated()
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h3 style={{ marginTop: 0 }}>Nova solicitação</h3>

      <div className="row">
        <div>
          <label>Valor solicitado</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={valor}
            onChange={e => setValor(Number(e.target.value))}
          />
          <small>
            Taxa de 5% → líquido estimado:{' '}
            <span className="kbd">{formatMoney(valor * 0.95)}</span>
          </small>
          <label>Data da solicitação</label>
          <div className="kbd">{new Date().toLocaleString()}</div>
        </div>
      </div>

      {error && <p style={{ color: '#f87171' }}>{error}</p>}
      <div className="actions">
        <button className="btn" type="submit" disabled={loading || !creatorId}>
          Criar
        </button>
      </div>
    </form>
  )
}
