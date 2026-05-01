from fastapi import APIRouter, Depends, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor
import os

router = APIRouter(prefix="/api", tags=["Dashboard"])

def get_db():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    try:
        yield conn
    finally:
        conn.close()

@router.get("/projects")
def get_projects(conn = Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT id, name, status FROM projects ORDER BY name;")
    return cursor.fetchall()

@router.get("/members")
def get_members(conn = Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT id, full_name, username FROM members ORDER BY full_name;")
    return cursor.fetchall()

@router.get("/kpis/global")
def get_global_kpis(conn = Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Total de cartões ativos (não arquivados/concluídos)
    cursor.execute("""
        SELECT COUNT(c.id) as total_active 
        FROM cards c
        JOIN lists l ON c.current_list_id = l.id
        WHERE l.name NOT ILIKE '%emitido%' AND l.name NOT ILIKE '%concluído%' AND l.name NOT ILIKE '%done%'
    """)
    active_cards = cursor.fetchone()['total_active']

    # Total de cartões atrasados
    cursor.execute("""
        SELECT COUNT(c.id) as total_delayed 
        FROM cards c
        JOIN lists l ON c.current_list_id = l.id
        WHERE c.due_date < NOW() AND l.name NOT ILIKE '%emitido%' AND l.name NOT ILIKE '%concluído%' AND l.name NOT ILIKE '%done%'
    """)
    delayed_cards = cursor.fetchone()['total_delayed']

    # Entregues nesta semana
    cursor.execute("""
        SELECT COUNT(DISTINCT ch.card_id) as total_delivered_week
        FROM card_history ch
        JOIN lists l ON ch.list_id = l.id
        WHERE (l.name ILIKE '%emitido%' OR l.name ILIKE '%concluído%' OR l.name ILIKE '%done%')
        AND ch.entered_at >= date_trunc('week', NOW())
    """)
    delivered_week = cursor.fetchone()['total_delivered_week']

    return {
        "active_cards": active_cards,
        "delayed_cards": delayed_cards,
        "delivered_this_week": delivered_week
    }

@router.get("/productivity/members")
def get_member_productivity(conn = Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Conta quantos cartões cada membro entregou no último mês
    query = """
        SELECT m.full_name, COUNT(DISTINCT ch.card_id) as delivered_count
        FROM card_history ch
        JOIN lists l ON ch.list_id = l.id
        JOIN card_assignments ca ON ch.card_id = ca.card_id
        JOIN members m ON ca.member_id = m.id
        WHERE (l.name ILIKE '%emitido%' OR l.name ILIKE '%concluído%' OR l.name ILIKE '%done%')
        AND ch.entered_at >= NOW() - INTERVAL '30 days'
        GROUP BY m.full_name
        ORDER BY delivered_count DESC
    """
    cursor.execute(query)
    return cursor.fetchall()

@router.get("/activity/current")
def get_current_activity(conn = Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = """
        SELECT 
            m.full_name                  AS member,
            c.name                       AS card,
            p.name                       AS project,
            l.name                       AS list,
            EXTRACT(EPOCH FROM (NOW() - ch.entered_at)) / 3600.0  AS elapsed_h
        FROM card_history ch
        JOIN cards c    ON ch.card_id   = c.id
        JOIN lists l    ON ch.list_id   = l.id
        JOIN projects p ON c.project_id = p.id
        JOIN card_assignments ca ON c.id = ca.card_id
        JOIN members m  ON ca.member_id = m.id
        WHERE ch.exited_at IS NULL
          AND l.name NOT ILIKE '%emitido%'
          AND l.name NOT ILIKE '%concluído%'
          AND l.name NOT ILIKE '%done%'
          AND l.name NOT ILIKE '%backlog%'
          AND l.name NOT ILIKE '%a fazer%'
        ORDER BY elapsed_h DESC
        LIMIT 20;
    """
    cursor.execute(query)
    rows = cursor.fetchall()

    # Converte Decimal para float para serialização JSON
    return [
        {**dict(r), "elapsed_h": float(r["elapsed_h"])}
        for r in rows
    ]
