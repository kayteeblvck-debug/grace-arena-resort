#!/usr/bin/env bash
# Runs the backend and frontend dev servers together. Ctrl-C stops both.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cleanup() {
  trap - INT TERM EXIT
  kill 0 2>/dev/null || true
}
trap cleanup INT TERM EXIT

if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "==> Installing frontend dependencies"
  (cd "$ROOT/frontend" && npm install)
fi

echo "==> Backend  http://localhost:8080/api"
(cd "$ROOT/backend" && ./gradlew bootRun --console=plain) &

echo "==> Frontend http://localhost:5173"
(cd "$ROOT/frontend" && npm run dev) &

wait
