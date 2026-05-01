# Descobertas e Pesquisas

## Escopo do Projeto (Fase V - Visão)
- **Estrela Guia:** Dashboard moderno e interativo para análise de desempenho de equipe de engenharia (30 pessoas, 20 projetos).
- **Fonte da Verdade:** Trello (Quadros de Projetos).
- **Payload/Entrega:** Aplicação Web hospedada em VPS Hostinger usando Coolify.
- **Métricas Chave:** Atividades por pessoa, tempo na atividade, concorrência de atividades, atrasos, índice de produtividade, KPIs por tipo (etiquetas), KPIs por projeto, funil de emissão e atrasos globais/por projeto.
- **Estrutura de Quadros:** Assumiremos o padrão primário: PENDÊNCIAS, A PROGRAMAR, A FAZER, EM ELABORAÇÃO, EM VERIFICAÇÃO, EMITIDO, CONCLUÍDO.
- **Cálculo de Produtividade:** Cartões movidos para a lista "EMITIDO". Considerará etiquetas específicas (Ex: MD / RELATORIO, ATN, ATC, Fluxograma, Lista, Folha de Dados). A seleção dessas etiquetas **deve ser personalizável** na interface do Dashboard.
- **Histórico (Extração):** O sistema tentará extrair o histórico passado dos cartões no Trello (via logs de ação do Trello) para popular a base de dados retroativamente, além de rastrear em tempo real daqui para frente.

