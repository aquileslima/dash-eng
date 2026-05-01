import { motion } from 'framer-motion';

export function KpiCard({ title, value, subtitle, icon: Icon, trend, color = 'brand' }) {
  const colorMap = {
    brand:   { text: 'text-brand-400',    glow: 'shadow-brand-500/20',    bg: 'bg-brand-500/10' },
    danger:  { text: 'text-red-400',      glow: 'shadow-red-500/20',      bg: 'bg-red-500/10' },
    success: { text: 'text-emerald-400',  glow: 'shadow-emerald-500/20',  bg: 'bg-emerald-500/10' },
    warning: { text: 'text-amber-400',    glow: 'shadow-amber-500/20',    bg: 'bg-amber-500/10' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 flex flex-col gap-4 hover:border-surface-600/60 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-surface-200">{title}</p>
        {Icon && (
          <div className={`p-2 rounded-xl ${c.bg}`}>
            <Icon className={`w-5 h-5 ${c.text}`} />
          </div>
        )}
      </div>

      <div>
        <p className={`text-4xl font-bold tabular-nums ${c.text}`}>{value ?? '—'}</p>
        {subtitle && <p className="text-xs text-surface-200 mt-1">{subtitle}</p>}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 text-xs">
          <span className={trend >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
          <span className="text-surface-200">vs. semana anterior</span>
        </div>
      )}
    </motion.div>
  );
}
