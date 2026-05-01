import os
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def setup_database():
    if not DATABASE_URL:
        print("❌ ERRO: DATABASE_URL não encontrada no .env")
        return

    try:
        print("🔌 Conectando ao Banco de Dados PostgreSQL...")
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Criação das tabelas
        queries = [
            """
            CREATE TABLE IF NOT EXISTS projects (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                status VARCHAR(50)
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS members (
                id VARCHAR(100) PRIMARY KEY,
                full_name VARCHAR(255),
                username VARCHAR(100)
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS lists (
                id VARCHAR(100) PRIMARY KEY,
                project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50)
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS cards (
                id VARCHAR(100) PRIMARY KEY,
                project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                current_list_id VARCHAR(100) REFERENCES lists(id) ON DELETE SET NULL,
                due_date TIMESTAMP,
                labels JSONB
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS card_assignments (
                card_id VARCHAR(100) REFERENCES cards(id) ON DELETE CASCADE,
                member_id VARCHAR(100) REFERENCES members(id) ON DELETE CASCADE,
                PRIMARY KEY (card_id, member_id)
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS card_history (
                id SERIAL PRIMARY KEY,
                card_id VARCHAR(100) REFERENCES cards(id) ON DELETE CASCADE,
                list_id VARCHAR(100) REFERENCES lists(id) ON DELETE CASCADE,
                entered_at TIMESTAMP NOT NULL,
                exited_at TIMESTAMP
            );
            """
        ]

        print("🏗️ Criando tabelas do Schema (A.N.T Layer 1)...")
        for q in queries:
            cursor.execute(q)
        
        conn.commit()
        print("✅ SUCESSO: Todas as tabelas foram criadas/verificadas com sucesso!")

    except Exception as e:
        print(f"❌ ERRO CRÍTICO: Falha na criação das tabelas: {str(e)}")
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    setup_database()
