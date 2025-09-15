export type Anticipation = {
  id: string
  creatorId: string
  valorSolicitado: number
  valorLiquido: number
  dataSolicitacao: string
  status: number | string
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000'

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init
  })
  if (!res.ok) {
    let message = res.statusText
    try { const body = await res.json(); if ((body as any)?.message) message = (body as any).message } catch {}
    throw new Error(`${res.status} ${message}`)
  }
  return res.json()
}

export async function listByCreator(creatorId: string) {
  return http<Anticipation[]>(`/api/v1/anticipations?creator_id=${encodeURIComponent(creatorId)}`)
}
export async function createAnticipation(input: { creatorId: string; valorSolicitado: number; dataSolicitacao: string }) {
  return http<Anticipation>('/api/v1/anticipations', { method: 'POST', body: JSON.stringify(input) })
}
export async function approve(id: string) { return http<Anticipation>(`/api/v1/anticipations/${id}/approve`, { method: 'POST' }) }
export async function reject(id: string) { return http<Anticipation>(`/api/v1/anticipations/${id}/reject`, { method: 'POST' }) }
export async function simulate(valorSolicitado: number) {
  return http<{ valor_bruto: number; taxa: number; valor_liquido: number; status: string }>(`/api/v1/anticipations/simulate?valor_solicitado=${valorSolicitado}`)
}
export function formatMoney(n: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n) }
export function statusBadge(status: number | string) {
  const s = typeof status === 'string' ? status.toLowerCase() : status
  if (s === 0 || s === 'pending') return { className: 'badge status-pending', label: 'Pendente' }
  if (s === 1 || s === 'approved') return { className: 'badge status-approved', label: 'Aprovada' }
  if (s === 2 || s === 'rejected') return { className: 'badge status-rejected', label: 'Recusada' }
  return { className: 'badge', label: String(status) }
}
