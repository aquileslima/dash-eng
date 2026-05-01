import os
import requests
from dotenv import load_dotenv

load_dotenv()

TRELLO_API_KEY = os.getenv("TRELLO_API_KEY")
TRELLO_API_TOKEN = os.getenv("TRELLO_API_TOKEN")
WEBHOOK_URL = "https://eng.dash.arlprime.com/trello/webhook"
TRELLO_BASE_URL = "https://api.trello.com/1"

def get_boards():
    params = {'key': TRELLO_API_KEY, 'token': TRELLO_API_TOKEN, 'fields': 'id,name,idOrganization'}
    resp = requests.get(f"{TRELLO_BASE_URL}/members/me/boards", params=params)
    if resp.status_code == 200:
        # Filtra apenas os quadros que pertencem a alguma organização (Ignora pessoais)
        return [b for b in resp.json() if b.get('idOrganization') is not None]
    return []

def get_existing_webhooks():
    params = {'key': TRELLO_API_KEY, 'token': TRELLO_API_TOKEN}
    resp = requests.get(f"{TRELLO_BASE_URL}/tokens/{TRELLO_API_TOKEN}/webhooks", params=params)
    if resp.status_code == 200:
        return resp.json()
    return []

def register_webhook(board_id, board_name):
    payload = {
        'key': TRELLO_API_KEY,
        'token': TRELLO_API_TOKEN,
        'callbackURL': WEBHOOK_URL,
        'idModel': board_id,
        'description': f"Webhook Dash-Eng para {board_name}"
    }
    resp = requests.post(f"{TRELLO_BASE_URL}/webhooks", data=payload)
    if resp.status_code == 200:
        print(f"Webhook criado para: {board_name}")
    else:
        print(f"Erro ao criar webhook para {board_name}: {resp.text}")

def main():
    print("Buscando quadros da equipe...")
    boards = get_boards()
    
    print("Verificando webhooks ja existentes...")
    existing = get_existing_webhooks()
    existing_board_ids = {w['idModel'] for w in existing if w['callbackURL'] == WEBHOOK_URL}

    print(f"Iniciando registro de webhooks para {len(boards)} quadros...\n")
    
    for board in boards:
        if board['id'] in existing_board_ids:
            print(f"Webhook ja existe para: {board['name']}")
        else:
            register_webhook(board['id'], board['name'])

if __name__ == "__main__":
    main()
