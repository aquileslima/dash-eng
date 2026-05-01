const API_BASE = import.meta.env.VITE_API_URL || 'https://eng.dash.arlprime.com';

// Dados fictícios para modo de desenvolvimento (sem backend)
const MOCK_DATA = {
  kpis: {
    active_cards: 47,
    delayed_cards: 8,
    delivered_this_week: 12,
  },
  projects: [
    { id: 'abc123def456', name: 'Planta Elétrica - Ed. Central', status: 'active' },
    { id: 'bcd234efg567', name: 'HVAC - Torre Norte', status: 'active' },
    { id: 'cde345fgh678', name: 'Estrutural - Galpão Sul', status: 'active' },
    { id: 'def456ghi789', name: 'Hidráulico - Residencial Parque', status: 'active' },
    { id: 'efg567hij890', name: 'SPDA - Cobertura Central', status: 'active' },
    { id: 'fgh678ijk901', name: 'Cabeamento - Data Center', status: 'active' },
    { id: 'ghi789jkl012', name: 'Climatização - Pavimento 3', status: 'active' },
    { id: 'hij890klm123', name: 'Subestação - Bloco B', status: 'active' },
  ],
  members: [
    { id: 'm1', full_name: 'Carlos Mendes',   username: 'cmendes' },
    { id: 'm2', full_name: 'Ana Lima',         username: 'alima' },
    { id: 'm3', full_name: 'Paulo Ferreira',   username: 'pferreira' },
    { id: 'm4', full_name: 'Juliana Santos',   username: 'jsantos' },
    { id: 'm5', full_name: 'Roberto Costa',    username: 'rcosta' },
    { id: 'm6', full_name: 'Fernanda Rocha',   username: 'frocha' },
    { id: 'm7', full_name: 'Diego Alves',      username: 'dalves' },
    { id: 'm8', full_name: 'Mariana Oliveira', username: 'moliveira' },
  ],
  productivity: [
    { full_name: 'Carlos Mendes',   delivered_count: 9 },
    { full_name: 'Ana Lima',         delivered_count: 7 },
    { full_name: 'Paulo Ferreira',   delivered_count: 5 },
    { full_name: 'Juliana Santos',   delivered_count: 12 },
    { full_name: 'Roberto Costa',    delivered_count: 3 },
    { full_name: 'Fernanda Rocha',   delivered_count: 8 },
    { full_name: 'Diego Alves',      delivered_count: 6 },
    { full_name: 'Mariana Oliveira', delivered_count: 11 },
  ],
  activity: [
    { member: 'Juliana Santos', card: 'Cálculo de Carga - Bloco A', project: 'Planta Elétrica - Ed. Central', list: 'Em Revisão', elapsed_h: 2.5 },
    { member: 'Carlos Mendes', card: 'Dimensionamento SPDA', project: 'SPDA - Cobertura Central', list: 'Fazendo', elapsed_h: 4.1 },
    { member: 'Mariana Oliveira', card: 'Relatório de Inspeção', project: 'HVAC - Torre Norte', list: 'Fazendo', elapsed_h: 1.2 },
    { member: 'Ana Lima', card: 'Memorial Descritivo', project: 'Hidráulico - Residencial Parque', list: 'Aprovação', elapsed_h: 6.8 },
    { member: 'Fernanda Rocha', card: 'Planta de Aterramento', project: 'Subestação - Bloco B', list: 'Fazendo', elapsed_h: 0.8 },
    { member: 'Diego Alves', card: 'Diagrama Unifilar', project: 'Cabeamento - Data Center', list: 'Em Revisão', elapsed_h: 3.3 },
  ],
};

const USE_MOCK = import.meta.env.VITE_API_URL === 'http://localhost:8000' || !import.meta.env.VITE_API_URL;

function delay(ms = 400) {
  return new Promise(r => setTimeout(r, ms));
}

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function mockFetch(key) {
  await delay(300 + Math.random() * 200);
  return MOCK_DATA[key];
}

export const api = {
  getGlobalKpis:       () => USE_MOCK ? mockFetch('kpis')         : apiFetch('/api/kpis/global'),
  getProjects:         () => USE_MOCK ? mockFetch('projects')      : apiFetch('/api/projects'),
  getMembers:          () => USE_MOCK ? mockFetch('members')       : apiFetch('/api/members'),
  getMemberProductivity: () => USE_MOCK ? mockFetch('productivity') : apiFetch('/api/productivity/members'),
  getActivity:         () => USE_MOCK ? mockFetch('activity')      : apiFetch('/api/activity/current'),
};
