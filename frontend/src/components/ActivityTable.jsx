import { motion } from 'framer-motion';
import { Clock, User, Layers } from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const row = {
  hidden: { opacity: 0, x: -10 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

function ElapsedBadge({ hours }) {
  const h = parseFloat(hours);
  let color = 'badge-success';
  if (h > 8)       color = 'badge-danger';
  else if (h > 4)  color = 'badge-warning';

  const label = h >= 1
    ? `${h.toFixed(1)}h`
    : `${Math.round(h * 60)}min`;

  return <span className={`badge ${color}`}><Clock className="w-3 h-3" />{label}</span>;
}

export function ActivityTable({ activities }) {
  if (!activities?.length) {
    return (
      <div className="glass-card p-8 flex items-center justify-center text-sm" style={{ color: 'var(--color-surface-200)' }}>
        Nenhuma atividade em andamento.
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid color-mix(in srgb, var(--color-surface-700) 50%, transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity />
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-surface-100)', margin: 0 }}>
            Atividade em Tempo Real
          </h3>
          <span style={{
            marginLeft: 'auto',
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            background: 'color-mix(in srgb, #10b981 15%, transparent)',
            color: '#6ee7b7',
            border: '1px solid color-mix(in srgb, #10b981 25%, transparent)',
          }}>
            {activities.length} ativos
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-surface-200)', borderBottom: '1px solid color-mix(in srgb, var(--color-surface-700) 30%, transparent)' }}>
              <th style={{ textAlign: 'left', padding: '0.625rem 1.5rem' }}>Engenheiro</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 1.5rem' }}>Cartão</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 1.5rem' }}>Projeto</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 1.5rem' }}>Lista</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 1.5rem' }}>Tempo</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a, i) => (
              <motion.tr
                key={i}
                variants={row}
                style={{ borderBottom: '1px solid color-mix(in srgb, var(--color-surface-700) 20%, transparent)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--color-surface-700) 30%, transparent)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      width: '2rem', height: '2rem', borderRadius: '50%',
                      background: `hsl(${(a.member.charCodeAt(0) * 17) % 360} 60% 45%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                      {a.member.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-surface-50)', whiteSpace: 'nowrap' }}>{a.member}</span>
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-surface-100)', fontFamily: 'var(--font-mono)' }}>{a.card}</span>
                </td>
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-surface-200)' }}>{a.project}</span>
                </td>
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-brand-300)', fontWeight: 500 }}>{a.list}</span>
                </td>
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <ElapsedBadge hours={a.elapsed_h} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// Ícone inline para evitar import extra
function Activity() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-brand-400)' }}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
