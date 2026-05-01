import { useState } from 'react';
import { LayoutDashboard, FolderKanban, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'projects',  label: 'Projetos',    icon: FolderKanban },
  { id: 'team',      label: 'Equipe',      icon: Users },
];

export function Sidebar({ current, onChange }) {
  return (
    <aside className="w-64 h-screen flex flex-col bg-surface-900/80 backdrop-blur-md border-r border-surface-700/50 flex-shrink-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-surface-700/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 glow-brand flex items-center justify-center">
            <span className="text-white text-sm font-bold">AE</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Dash-Eng</p>
            <p className="text-xs text-surface-200">ARL Prime</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`sidebar-item w-full ${current === id ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {current === id && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-surface-700/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-xs text-surface-200">Webhooks ativos</span>
        </div>
      </div>
    </aside>
  );
}
