# Constituição do Projeto (gemini.md)

## Regras Comportamentais
- **Protocolo Base:** V.L.A.E.G.
- **Arquitetura Base:** A.N.T. (3 Camadas: architecture/, Navegação, tools/)

## Invariantes Arquiteturais
- Nenhuma codificação em `tools/` até aprovação do Schema e Blueprint.
- Todas as credenciais vivem em `.env` e são testadas no 'Link'.
- Toda mudança lógica requer atualização prévia na camada `architecture/`.
- Intermediários locais usam `.tmp/`.

## Esquemas de Dados (Schemas)

O sistema precisará de um Banco de Dados relacional (PostgreSQL) para armazenar histórico e calcular tempos, pois o Trello não fornece tempo em lista facilmente de forma retroativa.

**Schema Principal (PostgreSQL proposto):**
- `projects`: id (Board ID), name, status.
- `members`: id (Member ID), full_name, username.
- `lists`: id (List ID), project_id, name, type (To Do, Doing, Done).
- `cards`: id (Card ID), project_id, name, current_list_id, due_date.
- `card_labels`: card_id, label_name.
- `card_assignments`: card_id, member_id.
- `card_history` (Métrica Chave): id, card_id, list_id, entered_at, exited_at. (Permite calcular "quanto tempo na atividade").

**Payload de Entrega:** Dashboard Web Next.js/React.

## Log de Manutenção
*(Aguardando Implantação)*
