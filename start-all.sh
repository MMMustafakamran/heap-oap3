#!/usr/bin/env bash
# HARNESS: starts every OpenAIAgents-Angular server on its harness ports (never 3000/8000).
#   8291 OpenAI Agents agent server (backend/agent_server.py: the quickstart's agent_server.py lines,
#        completed by HARNESS; doc: 8000). One AG-UI endpoint per agent at /<name> (default, subagents).
#   8290 Copilot Runtime (frontend/server.ts; doc: 8200), /threads mount with CopilotKit Intelligence
#   4290 ng serve (doc: 4200)
#   4291 ng serve for frontend-headless/ (Headless UI page only: its verbatim code fails to compile
#        with today's packages, isolated so the other pages can film)
# Keys: backend/.env (OPENAI_API_KEY, see backend/.env.example), frontend/.env.intelligence (CPK_INTELLIGENCE_API_KEY).
cd "$(dirname "$0")"
mkdir -p logs
# CHANGED: every server runs in a real terminal (.qa/tools/ptyrun.cjs): logs/<name>.log as before,
# plus logs/<name>.log.pty, the raw terminal the recorder shows on a failed take.
PTYRUN="node $(pwd)/.qa/tools/ptyrun.cjs"

(cd backend && $PTYRUN ../logs/backend-8291.log --name "uv run python agent_server.py" -- uv run --env-file .env python agent_server.py) &
echo "waiting for the agent server on :8291 ..."
for _ in $(seq 1 90); do
  curl -sf http://localhost:8291/health > /dev/null 2>&1 && break
  sleep 2
done

cd frontend
($PTYRUN ../logs/runtime-8290.log --name "npx tsx server.ts" -- npx tsx server.ts) &
($PTYRUN ../logs/angular-4290.log --name "npm start" -- npm start) &
(cd ../frontend-headless && $PTYRUN ../logs/angular-headless-4291.log --name "npm start" -- npm start) & # HARNESS: isolated Headless UI app
wait
