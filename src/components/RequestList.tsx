import React from 'react'
import { Anticipation, approve, reject, formatMoney, statusBadge } from '../api'

type Props = { items: Anticipation[]; onRefresh: () => void }

export default function RequestList({ items, onRefresh }: Props) {
  const onApprove = async (id: string) => { try { await approve(id); onRefresh() } catch (e) { alert((e as Error).message) } }
  const onReject  = async (id: string) => { try { await reject(id); onRefresh() } catch (e) { alert((e as Error).message) } }

  if (!items.length) return <div className="card">Nenhuma solicitação encontrada.</div>

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Solicitações</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Bruto</th>
            <th>Líquido</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(x => {
            const badge = statusBadge(x.status)
            return (
              <tr key={x.id}>
                <td>{new Date(x.dataSolicitacao).toLocaleString()}</td>
                <td>{formatMoney(x.valorSolicitado)}</td>
                <td>{formatMoney(x.valorLiquido)}</td>
                <td><span className={badge.className}>{badge.label}</span></td>
                <td className="actions">
                  <button className="btn secondary" onClick={() => onApprove(x.id)}>Aprovar</button>
                  <button className="btn secondary" onClick={() => onReject(x.id)}>Recusar</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
