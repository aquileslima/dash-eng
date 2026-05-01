# POP - Banco de Dados Trello (A.N.T Layer 1)

## Objetivo
Definir a estrutura e as regras de inserção de dados no PostgreSQL provisionado para o Dashboard de Engenharia.

## Fonte da Verdade
- Os dados nascem no Trello (API GET e Webhooks).
- O PostgreSQL armazena cópias e **histórico de movimentação**.

## Schema
- **projects**: `id` (PK, string, ID do Quadro), `name`, `status`.
- **members**: `id` (PK, string, ID Trello), `full_name`, `username`.
- **lists**: `id` (PK, string, ID Lista Trello), `project_id` (FK), `name`, `type` (To Do, Doing, Done).
- **cards**: `id` (PK, string, ID Cartão), `project_id` (FK), `name`, `current_list_id` (FK), `due_date`, `labels` (JSON).
- **card_assignments**: `card_id` (FK), `member_id` (FK).
- **card_history**: `id` (PK, auto-increment), `card_id` (FK), `list_id` (FK), `entered_at` (Timestamp), `exited_at` (Timestamp, nullable).

## Regras Lógicas de Histórico (Métrica Chave)
1. **Entrada:** Quando um cartão entra numa lista, criamos uma nova entrada em `card_history` com `entered_at = NOW()` e `exited_at = NULL`.
2. **Saída:** Quando um cartão muda de lista, a entrada ativa daquela lista anterior ganha `exited_at = NOW()`.
3. **Cálculo de Tempo:** O tempo na atividade é a diferença entre `exited_at` e `entered_at`. Se `exited_at` for nulo, subtrai-se de `NOW()`.

## Segurança
- O Banco só é acessível na rede interna do Coolify (`tzv2hpxhsxnjkp65t8dqj680:5432`).
- Nenhuma query `DROP TABLE` deve ser executada por usuários do frontend.
