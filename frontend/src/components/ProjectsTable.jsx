import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const row = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function ProjectsTable({ projects, members }) {
  if (!projects?.length) {
    return (
      <div className="glass-card p-8 flex items-center justify-center text-surface-200 text-sm">
        Nenhum projeto encontrado.
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
      <div className="px-6 py-4 border-b border-surface-700/50">
        <h3 className="text-sm font-semibold text-surface-100">Todos os Projetos</h3>
        <p className="text-xs text-surface-200 mt-0.5">{projects.length} projetos sincronizados</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-medium text-surface-200 uppercase tracking-wider">
              <th className="text-left px-6 py-3">Projeto</th>
              <th className="text-left px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700/30">
            {projects.map((p) => (
              <motion.tr
                key={p.id}
                variants={row}
                className="group hover:bg-surface-700/30 transition-colors duration-150"
              >
                <td className="px-6 py-3.5">
                  <p className="text-sm font-medium text-surface-50 group-hover:text-brand-300 transition-colors">{p.name}</p>
                  <p className="text-xs text-surface-200 font-mono mt-0.5">{p.id.slice(0, 8)}…</p>
                </td>
                <td className="px-6 py-3.5">
                  <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-info'}`}>
                    {p.status === 'active' ? 'Ativo' : p.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
