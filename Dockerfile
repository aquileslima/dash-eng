FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia os diretórios necessários
COPY tools/ ./tools/
COPY backend/ ./backend/
COPY .env .

EXPOSE 8000

# O comando padrão roda a API. Os scripts de tools serão executados via Coolify ou Docker exec.
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
