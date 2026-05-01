import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Activity, Users } from 'lucide-react';

import { Sidebar }          from './components/Sidebar';
import { KpiCard }          from './components/KpiCard';
import { ProductivityChart } from './components/ProductivityChart';
import { ProjectsTable }    from './components/ProjectsTable';
import { ActivityTable }    from './components/ActivityTable';
import { api }              from './api';

/* ── Utilitários de estilo ──────────────────────────────────── */
const S = {
  page:      { flex: '1', overflowY: 'auto', padding: '2rem' },
  title:     { fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 },
  subtitle:  { fontSize: '0.875rem', color: 'var(--color-surface-200)', marginTop: '0.25rem' },
  loading:   { color: 'var(--color-surface-200)', fontSize: '0.875rem' },
  error:     { color: '#f87171', fontSize: '0.875rem' },
  grid3:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' },
  space6:    { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  space8:    { display: 'flex', flexDirection: 'column', gap: '2rem' },
  header:    { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
};

function PageWrapper({ children }) {
  return (
    <motion.div
      key="page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      style={S.page}
    >
      {children}
    </motion.div>
  );
}

/* ── Tela: Visão Geral ──────────────────────────────────────── */
function DashboardPage() {
  const [kpis,         setKpis]         = useState(null);
  const [productivity, setProductivity] = useState([]);
  const [activity,     setActivity]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    Promise.all([
      api.getGlobalKpis(),
      api.getMemberProductivity(),
      api.getActivity(),
    ])
      .then(([k, p, a]) => { setKpis(k); setProductivity(p); setActivity(a); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={S.loading}>Carregando dados...</div>;
  if (error)   return <div style={S.error}>Erro ao carregar: {error}</div>;

  return (
    <div style={S.space8}>
      {/* Header */}
      <div>
        <h1 style={S.title}>Visão Geral</h1>
        <p style={S.subtitle}>Dashboard de produtividade da engenharia · Atualizado em tempo real</p>
      </div>

      {/* KPIs */}
      <div style={S.grid3}>
        <KpiCard
          title="Cartões Ativos"
          value={kpis?.active_cards}
          subtitle="Em andamento agora"
          icon={Activity}
          color="brand"
        />
        <KpiCard
          title="Atrasados"
          value={kpis?.delayed_cards}
          subtitle="Com prazo vencido"
          icon={AlertTriangle}
          color="danger"
        />
        <KpiCard
          title="Entregues esta semana"
          value={kpis?.delivered_this_week}
          subtitle="Entradas em lista de emissão"
          icon={CheckCircle2}
          color="success"
        />
      </div>

      {/* Atividade em Tempo Real */}
      {activity.length > 0 && <ActivityTable activities={activity} />}

      {/* Gráfico de Produtividade */}
      {productivity.length > 0 && (
        <ProductivityChart
          data={productivity}
          title="Produtividade por Engenheiro — Últimos 30 dias"
        />
      )}
    </div>
  );
}

/* ── Tela: Projetos ─────────────────────────────────────────── */
function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    api.getProjects().then(setProjects).finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={S.loading}>Carregando projetos...</div>;

  return (
    <div style={S.space6}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Projetos</h1>
          <p style={S.subtitle}>{projects.length} quadros sincronizados com o Trello</p>
        </div>
        <input
          style={{
            background: 'color-mix(in srgb, var(--color-surface-800) 60%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-surface-700) 50%, transparent)',
            borderRadius: '0.75rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            color: 'var(--color-surface-50)',
            outline: 'none',
            width: '16rem',
          }}
          placeholder="Buscar projeto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <ProjectsTable projects={filtered} />
    </div>
  );
}

/* ── Tela: Equipe ───────────────────────────────────────────── */
function TeamPage() {
  const [members,      setMembers]      = useState([]);
  const [productivity, setProductivity] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([api.getMembers(), api.getMemberProductivity()])
      .then(([m, p]) => { setMembers(m); setProductivity(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={S.loading}>Carregando equipe...</div>;

  const prodMap = Object.fromEntries(productivity.map(p => [p.full_name, p.delivered_count]));
  const maxDeliveries = Math.max(...Object.values(prodMap), 1);

  return (
    <div style={S.space6}>
      <div>
        <h1 style={S.title}>Equipe</h1>
        <p style={S.subtitle}>{members.length} engenheiros · Desempenho nos últimos 30 dias</p>
      </div>

      {/* Gráfico */}
      {productivity.length > 0 && (
        <ProductivityChart
          data={productivity}
          title="Entregas por Engenheiro — Últimos 30 dias"
        />
      )}

      {/* Tabela de membros */}
      <motion.div
        className="glass-card"
        style={{ overflow: 'hidden' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-surface-200)', borderBottom: '1px solid color-mix(in srgb, var(--color-surface-700) 50%, transparent)' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>Engenheiro</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>Username</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>Entregas (30d)</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => {
              const deliveries = prodMap[m.full_name] ?? 0;
              const pct = Math.min(100, (deliveries / maxDeliveries) * 100);
              return (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid color-mix(in srgb, var(--color-surface-700) 20%, transparent)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--color-surface-700) 30%, transparent)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.875rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '2rem', height: '2rem', borderRadius: '50%',
                        background: `hsl(${(m.full_name.charCodeAt(0) * 17) % 360} 60% 45%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700, color: 'white',
                      }}>
                        {m.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-surface-50)' }}>{m.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-surface-200)', fontFamily: 'var(--font-mono)' }}>
                    @{m.username}
                  </td>
                  <td style={{ padding: '0.875rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-brand-300)', width: '1.5rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        {deliveries}
                      </span>
                      <div style={{ flex: 1, background: 'color-mix(in srgb, var(--color-surface-700) 50%, transparent)', borderRadius: '9999px', height: '6px', maxWidth: '120px' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: i * 0.05 + 0.3, duration: 0.6, ease: 'easeOut' }}
                          style={{ background: 'var(--color-brand-500)', borderRadius: '9999px', height: '100%' }}
                        />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/* ── App Root ───────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState('dashboard');

  const pageMap = {
    dashboard: <DashboardPage />,
    projects:  <ProjectsPage />,
    team:      <TeamPage />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar current={page} onChange={setPage} />
      <AnimatePresence mode="wait">
        <PageWrapper key={page}>
          {pageMap[page]}
        </PageWrapper>
      </AnimatePresence>
    </div>
  );
}
