import os
import requests
import psycopg2
from psycopg2.extras import Json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

TRELLO_API_KEY = os.getenv("TRELLO_API_KEY")
TRELLO_API_TOKEN = os.getenv("TRELLO_API_TOKEN")
DATABASE_URL = os.getenv("DATABASE_URL")

TRELLO_BASE_URL = "https://api.trello.com/1"

def get_trello_data(endpoint, params=None):
    if params is None:
        params = {}
    params.update({'key': TRELLO_API_KEY, 'token': TRELLO_API_TOKEN})
    response = requests.get(f"{TRELLO_BASE_URL}/{endpoint}", params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Erro na API Trello ({endpoint}): {response.status_code}")
        return None

def sync_all():
    if not DATABASE_URL:
        print("DATABASE_URL não configurada.")
        return

    print("🔌 Conectando ao Banco de Dados...")
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    print("📥 Buscando quadros do Trello...")
    boards = get_trello_data("members/me/boards", {'fields': 'name,idOrganization'})
    
    if not boards:
        print("Nenhum quadro retornado.")
        return

    team_boards = [b for b in boards if b.get('idOrganization') is not None]
    print(f"Encontrados {len(team_boards)} quadros de equipe.")

    for board in team_boards:
        board_id = board['id']
        board_name = board['name']
        print(f"\n🔄 Sincronizando Quadro: {board_name}")

        # 1. Inserir/Atualizar Projeto
        cursor.execute(
            "INSERT INTO projects (id, name, status) VALUES (%s, %s, %s) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;",
            (board_id, board_name, 'active')
        )

        # 2. Buscar Membros do Quadro
        members = get_trello_data(f"boards/{board_id}/members", {'fields': 'fullName,username'})
        for mem in (members or []):
            cursor.execute(
                "INSERT INTO members (id, full_name, username) VALUES (%s, %s, %s) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, username = EXCLUDED.username;",
                (mem['id'], mem.get('fullName'), mem.get('username'))
            )

        # 3. Buscar Listas do Quadro
        lists = get_trello_data(f"boards/{board_id}/lists", {'fields': 'name'})
        for lst in (lists or []):
            cursor.execute(
                "INSERT INTO lists (id, project_id, name, type) VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;",
                (lst['id'], board_id, lst['name'], 'Standard')
            )

        # 4. Buscar Cartões
        cards = get_trello_data(f"boards/{board_id}/cards", {'fields': 'name,idList,due,labels,idMembers'})
        valid_card_ids = {c['id'] for c in (cards or [])}
        
        for card in (cards or []):
            labels = [{'id': l['id'], 'name': l['name'], 'color': l['color']} for l in card.get('labels', [])]
            
            cursor.execute(
                "INSERT INTO cards (id, project_id, name, current_list_id, due_date, labels) VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, current_list_id = EXCLUDED.current_list_id, due_date = EXCLUDED.due_date, labels = EXCLUDED.labels;",
                (card['id'], board_id, card['name'], card.get('idList'), card.get('due'), Json(labels))
            )

            # Sincronizar atribuições
            cursor.execute("DELETE FROM card_assignments WHERE card_id = %s", (card['id'],))
            for mem_id in card.get('idMembers', []):
                cursor.execute(
                    "INSERT INTO card_assignments (card_id, member_id) VALUES (%s, %s) ON CONFLICT DO NOTHING;",
                    (card['id'], mem_id)
                )

        # 5. Sincronizar Histórico (Tentativa retroativa)
        # Atenção: Esta API tem limite. Traz as últimas ações de movimento.
        actions = get_trello_data(f"boards/{board_id}/actions", {'filter': 'updateCard:idList,createCard', 'limit': 1000})
        # Processar do mais antigo para o mais novo
        for action in reversed(actions or []):
            card_id = action.get('data', {}).get('card', {}).get('id')
            date_str = action.get('date')
            
            if not card_id or not date_str or card_id not in valid_card_ids:
                continue

            # Convert string to datetime
            dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")

            if action['type'] == 'createCard':
                list_id = action.get('data', {}).get('list', {}).get('id')
                if list_id:
                    cursor.execute(
                        "INSERT INTO card_history (card_id, list_id, entered_at) VALUES (%s, %s, %s)",
                        (card_id, list_id, dt)
                    )
            elif action['type'] == 'updateCard':
                list_after = action.get('data', {}).get('listAfter', {}).get('id')
                
                if list_after:
                    # Fechar a lista anterior (setar exited_at)
                    cursor.execute(
                        "UPDATE card_history SET exited_at = %s WHERE card_id = %s AND exited_at IS NULL",
                        (dt, card_id)
                    )
                    # Abrir a nova lista
                    cursor.execute(
                        "INSERT INTO card_history (card_id, list_id, entered_at) VALUES (%s, %s, %s)",
                        (card_id, list_after, dt)
                    )

        conn.commit()
        print(f"✅ Sincronização do quadro {board_name} concluída.")

    cursor.close()
    conn.close()
    print("🏁 Sincronização Geral Finalizada!")

if __name__ == "__main__":
    sync_all()
