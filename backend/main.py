from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import psycopg2
from datetime import datetime
from dotenv import load_dotenv

from .api import router as api_router

load_dotenv()

app = FastAPI(title="Dash-Eng API")

# Configuração de CORS para permitir que o Frontend (Vite) acesse a API localmente
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, defina o domínio exato
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API do Dashboard de Engenharia (A.N.T Layer 2) está rodando."}

@app.head("/trello/webhook")
def trello_webhook_head():
    # O Trello faz uma requisição HEAD para verificar se a URL é válida na criação do webhook
    return {}

@app.post("/trello/webhook")
async def trello_webhook(request: Request):
    payload = await request.json()
    action = payload.get("action", {})
    action_type = action.get("type")
    
    if action_type == "updateCard":
        data = action.get("data", {})
        if "listAfter" in data and "listBefore" in data:
            card_id = data["card"]["id"]
            list_after_id = data["listAfter"]["id"]
            dt = datetime.strptime(action["date"], "%Y-%m-%dT%H:%M:%S.%fZ")
            
            conn = get_db_connection()
            cursor = conn.cursor()
            try:
                # Fecha o tempo na lista anterior
                cursor.execute(
                    "UPDATE card_history SET exited_at = %s WHERE card_id = %s AND exited_at IS NULL",
                    (dt, card_id)
                )
                # Abre nova contagem de tempo na lista nova
                cursor.execute(
                    "INSERT INTO card_history (card_id, list_id, entered_at) VALUES (%s, %s, %s)",
                    (card_id, list_after_id, dt)
                )
                # Atualiza o cartao
                cursor.execute(
                    "UPDATE cards SET current_list_id = %s WHERE id = %s",
                    (list_after_id, card_id)
                )
                conn.commit()
            except Exception as e:
                conn.rollback()
                print(f"Erro no webhook updateCard: {e}")
            finally:
                cursor.close()
                conn.close()

    return {"status": "received"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
