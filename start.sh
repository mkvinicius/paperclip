#!/usr/bin/env bash
# Inicia o Paperclip completo: backend + frontend

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[start]${NC} $1"; }
warn() { echo -e "${YELLOW}[start]${NC} $1"; }

# Cleanup ao sair (Ctrl+C ou erro)
cleanup() {
  warn "Encerrando processos..."
  kill "$SERVER_PID" "$UI_PID" 2>/dev/null || true
  wait "$SERVER_PID" "$UI_PID" 2>/dev/null || true
  warn "Encerrado."
}

# Verificar dependências
if ! command -v pnpm &>/dev/null; then
  echo "Erro: pnpm não encontrado. Execute: npm install -g pnpm" >&2
  exit 1
fi

# Rodar migrations antes de subir
if [ -f ".env" ] || [ -f "packages/db/.env" ]; then
  log "Aplicando migrations do banco..."
  pnpm db:migrate 2>/dev/null || warn "Migrations já aplicadas ou banco não configurado."
fi

log "Subindo servidor backend..."
pnpm dev:server &
SERVER_PID=$!

log "Subindo frontend..."
pnpm dev:ui &
UI_PID=$!

trap cleanup EXIT INT TERM

log ""
log "Paperclip rodando:"
log "  Backend: http://localhost:3100"
log "  Frontend: http://localhost:5173"
log "  CMV:     http://localhost:5173/cmv"
log ""
log "Pressione Ctrl+C para encerrar."

# Aguarda qualquer processo terminar
wait -n "$SERVER_PID" "$UI_PID" 2>/dev/null || true
