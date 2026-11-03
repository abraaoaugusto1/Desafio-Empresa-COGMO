import { useEffect, useState } from 'react'
import { getSeries, getStations, getSummary } from './api'
import type { Metric, SeriesResponse, Station, SummaryResponse } from './types'
import {LineChart,  Line,  XAxis,  YAxis,  CartesianGrid,  Tooltip,  ResponsiveContainer,} from 'recharts'

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Sem horário disponível'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Horário inválido'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(date) + ' (horário de Brasília)'
}

function formatValue(value: number | null | undefined, digits = 2): string {
  if (value == null || !Number.isFinite(value)) return '—'
  return value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export default function App() {
  const [stations, setStations] = useState<Station[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [series, setSeries] = useState<SeriesResponse | null>(null)
  const [metric, setMetric] = useState<Metric>('level')
  const [hours, setHours] = useState(24)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let current = true
    getStations()
      .then((result) => {
        if (!current) return
        setStations(result.stations)
        if (result.stations.length === 0) setLoading(false)
        setSelectedId(result.stations[0]?.id || '')
      })
      .catch((reason: unknown) => {
        if (current) {
          setError(reason instanceof Error ? reason.message : 'Erro ao carregar estações.')
          setLoading(false)
        }
      })
    return () => { current = false }
  }, [retryCount])

  useEffect(() => {
    if (!selectedId) {
      setLoading(stations.length === 0)
      return
    }
    let current = true
    setLoading(true)
    setError('')
    Promise.all([
      getSummary(selectedId),
      getSeries(selectedId, metric, hours),
    ])
      .then(([nextSummary, nextSeries]) => {
        if (!current) return
        setSummary(nextSummary)
        setSeries(nextSeries)
      })
      .catch((reason: unknown) => {
        if (current) setError(reason instanceof Error ? reason.message : 'Erro ao carregar os dados.')
      })
      .finally(() => {
        if (current) setLoading(false)
      })
    return () => { current = false }
  }, [selectedId, metric, hours, retryCount])

  const selected = stations.find((station) => station.id === selectedId)
  const level = summary?.latest.level_m
  const rain = summary?.latest.rain_mm_h

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Monitoramento didático, início">
          <span className="brand-mark" aria-hidden="true">≈</span>
          <span>vigia<span className="brand-dot">.</span></span>
        </a>
        <span className="course-label">DESAFIO DE FORMAÇÃO · COGMO TECHNOLOGY</span>
      </header>

      <section className="intro">
        <p className="eyebrow">MONITORAMENTO HIDROLÓGICO · DEMONSTRAÇÃO</p>
        <h1>Acompanhe as estações</h1>
        <p className="intro-copy">Níveis e chuva em um só lugar, com o horário e a origem de cada leitura.</p>
        <div className="simulation-banner" role="note">
          Amostra inteiramente simulada. Estações e valores fictícios; não usar como alerta.
        </div>
      </section>

      <section className="toolbar" aria-label="Filtros do painel">
        <label htmlFor="station-select">Estação</label>
        <select id="station-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          {stations.map((station) => (
            <option value={station.id} key={station.id}>{station.name} · {station.municipality}</option>
          ))}
        </select>
        <span className="river-name">{selected ? selected.river : 'Carregando estação…'}</span>
      </section>

      <section className="metrics" aria-label="Leituras mais recentes">
        <article className="metric-card">
          <div className="metric-heading"><span>NÍVEL DO RIO</span><span className="unit">m</span></div>
          <strong>{formatValue(level)}</strong>
          <p>Última leitura: {formatDate(summary?.latest.level_observed_at)}</p>
        </article>
        <article className="metric-card rain-card">
          <div className="metric-heading"><span>CHUVA</span><span className="unit">mm/h</span></div>
          <strong>{formatValue(rain, 1)}</strong>
          <p>Última leitura: {formatDate(summary?.latest.rain_observed_at)}</p>
        </article>
      </section>

      <section className="history-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">HISTÓRICO</p>
            <h2>{metric === 'level' ? 'Nível do rio' : 'Chuva por hora'}</h2>
          </div>
          <div className="history-controls">
            <div className="metric-tabs" aria-label="Métrica do gráfico">
              <button type="button" aria-pressed={metric === 'level'} onClick={() => setMetric('level')}>Nível</button>
              <button type="button" aria-pressed={metric === 'rain'} onClick={() => setMetric('rain')}>Chuva</button>
            </div>
            <label className="range-label">Período
              <select value={hours} onChange={(event) => setHours(Number(event.target.value))}>
                <option value={12}>12 horas</option>
                <option value={24}>24 horas</option>
                <option value={48}>48 horas</option>
              </select>
            </label>
          </div>
        </div>

        {loading && <p className="status-message" role="status">Carregando leituras…</p>}
        {error && (
          <div className="error-box" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => {
              setError('')
              setLoading(true)
              setRetryCount((count) => count + 1)
            }}>Tentar novamente</button>
          </div>
        )}
        {!loading && !error && series?.points.length === 0 && (
          <p className="empty-state">Não há leituras para esse período. Escolha outra janela ou estação.</p>
        )}
        {!loading && !error && Boolean(series?.points.length) && (
          <div style={{ width: '100%', height: 300, marginTop: 16 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={series?.points}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dce7ee" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Sao_Paulo',
            })
          }}
          minTickGap={40}
        />
        <YAxis
          unit={series?.unit === 'm' ? ' m' : ' mm/h'}
          domain={['auto', 'auto']}
          width={70}
        />
        <Tooltip
          labelFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Sao_Paulo',
            }) + ' (horário de Brasília)'
          }}
          formatter={(value: number) => [
            value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            series?.metric === 'level' ? 'Nível' : 'Chuva',
          ]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#207ca2"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
          </div>
        )}
        <div className="panel-footer">
          <span>Atualização simulada: {formatDate(summary?.latest.level_observed_at)}</span>
          {selected && <span>{selected.name} · {selected.river}</span>}
        </div>
      </section>

      <footer className="footer">
        <span>Projeto educacional proposto pela Cogmo Technology.</span>
        <span>Valores ilustrativos · sem finalidade operacional</span>
      </footer>
    </main>
  )
}
