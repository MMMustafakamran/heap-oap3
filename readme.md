# OpenAIAgents-Angular: CopilotKit Angular docs, tested with a OpenAI Agents agent

Doc QA harness for https://docs.copilotkit.ai/angular/openai-agents-python. Each sidebar page has a route that
holds the page's code as published (doc snippets verbatim) and a `<route>/demo` that runs it. Lines added
only to reach a page are marked `HARNESS`. Open doc defects: [FINDINGS.md](FINDINGS.md). Page list and
status: [assignment.json](assignment.json).

## Layout

| Folder | What |
|---|---|
| `frontend/` | Angular 22 app (`ng serve` on 4290), Copilot Runtime `server.ts` (8290), auth runtime, `doc-verbatim/` (snippets kept as published that don't build) |
| `backend/` | OpenAI Agents agent server `agent_server.py` (8291; the quickstart fragment completed by HARNESS), `_common.py` (quickstart), `demo_agents/` (Sub-agents page) |
| `autorecorder/` | Playwright recorder for the clips (`npm run record -- <page-id>`) |
| `doc-snapshot/` | Snapshot of the doc pages, sidebar and links (drift check: `npm run drift`) |

## Run it

1. `cp backend/.env.example backend/.env` and set `GEMINI_API_KEY` (or point `GOOGLE_GEMINI_BASE_URL` at the
   pool and put `GEMINI_POOL_KEYS` / `GEMINI_POOL_OPENAI_KEY` in `backend/pool.env`).
2. `cd frontend && npm install`, `cd autorecorder && npm install`, `cd backend && uv sync`.
3. `bash start-all.sh` starts the pool, both agent servers, the runtime and `ng serve`.
4. Open http://localhost:4290. Record one page: `npm run record -- <page-id>`.

Ports are never 3000 / 8000 so the harness can run beside other apps.
