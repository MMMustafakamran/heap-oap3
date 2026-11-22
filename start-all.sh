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

(cd backend && uv run --env-file .env python agent_server.py > ../logs/backend-8291.log 2>&1) &
echo "waiting for the agent server on :8291 ..."
for _ in $(seq 1 90); do
  curl -sf http://localhost:8291/health > /dev/null 2>&1 && break
  sleep 2
done

cd frontend
(npx tsx server.ts > ../logs/runtime-8290.log 2>&1) &
(npm start > ../logs/angular-4290.log 2>&1) &
(cd ../frontend-headless && npm start > ../logs/angular-headless-4291.log 2>&1) & # HARNESS: isolated Headless UI app
wait
