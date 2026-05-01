import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm">
        <p className="font-semibold text-white mb-1">{label}</p>
        <p className="text-brand-300">{payload[0].value} entregues</p>
      </div>
    );
  }
  return null;
};

export function ProductivityChart({ data, title }) {
  const max = Math.max(...(data || []).map(d => d.delivered_count || 0), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-semibold text-surface-100 mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3e" vertical={false} />
          <XAxis
            dataKey="full_name"
            tick={{ fill: '#9ca3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fill: '#9ca3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 36, 54, 0.6)' }} />
          <Bar dataKey="delivered_count" radius={[6, 6, 0, 0]}>
            {(data || []).map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.delivered_count === max
                    ? '#3b7de9'
                    : 'rgba(44, 88, 177, 0.75)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
