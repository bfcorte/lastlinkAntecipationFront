import React, { useState } from 'react'
import { simulate, formatMoney } from '../api'

export default function SimulateCard() {
  const [valor, setValor] = useState<number>(250)
  const [res, setRes] = useState<{ valor_bruto: number; taxa: number; valor_liquido: number; status: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSimulate = async () => {
    setError(null)
    try { const r = await simulate(valor); setRes(r) }
    catch (e: any) { setError(e.message) }
  }

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Simular</h3>
      <div className="row">
        <div>
          <label>Valor</label>
          <input type="number" min={0} step="0.01" value={valor} onChange={e => setValor(Number(e.target.value))} />
        </div>
      </div>
      {error && <p style={{color:'#f87171'}}>{error}</p>}
      <div className="actions">
        <button className="btn" onClick={onSimulate}>Simular</button>
        {res && <span className="kbd">Líquido: {formatMoney(res.valor_liquido)}</span>}
      </div>
    </div>
  )
}
