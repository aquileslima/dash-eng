import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

TRELLO_API_KEY = os.getenv("TRELLO_API_KEY")
TRELLO_API_TOKEN = os.getenv("TRELLO_API_TOKEN")

def test_trello_connection():
    if not TRELLO_API_KEY or not TRELLO_API_TOKEN:
        print("❌ ERRO: Chaves do Trello não encontradas no .env")
        return False

    url = "https://api.trello.com/1/members/me/boards"
    
    query = {
        'key': TRELLO_API_KEY,
        'token': TRELLO_API_TOKEN,
        'fields': 'name,url,idOrganization'
    }

    try:
        print("Iniciando teste de conexao (Handshake) com a API do Trello...")
        response = requests.get(url, params=query)
        
        if response.status_code == 200:
            all_boards = response.json()
            # Ignorar quadros onde idOrganization é None (geralmente quadros pessoais)
            team_boards = [b for b in all_boards if b.get('idOrganization') is not None]
            personal_boards_count = len(all_boards) - len(team_boards)
            
            print(f"SUCESSO: Conexao estabelecida com sucesso!")
            print(f"Conta Trello acessada.")
            print(f"Encontrados {len(all_boards)} quadros no total ({personal_boards_count} pessoais ignorados).")
            print(f"Total de quadros de Equipe/Organizacao válidos: {len(team_boards)}")
            print("\nPrimeiros 5 quadros de Equipe encontrados:")
            for board in team_boards[:5]:
                print(f"  - {board['name']} (OrgID: {board.get('idOrganization')})")
            return True
        elif response.status_code == 401:
            print(f"ERRO 401: Credenciais invalidas (Chave ou Token incorretos).")
        else:
            print(f"ERRO: Falha na conexao. Codigo de status: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"ERRO CRITICO: Falha na requisicao: {str(e)}")
        
    return False

if __name__ == "__main__":
    test_trello_connection()
