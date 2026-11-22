# Findings: OpenAIAgents-Angular (OpenAI Agents SDK Python agent + CopilotKit Angular)
Open doc defects only. Numbers are stable IDs (code cites `FINDINGS.md #N`); gaps are removed findings.
Stack: `@copilotkit/angular` 0.6.0, `@copilotkit/runtime` 1.90.0 (`@copilotkit/core` 1.90.0), `@ag-ui/client` 1.0.5, `@angular/core` 22.1.x, agent: `ag-ui-openai-agents` 0.1.0, `openai-agents` 0.25.0, `fastapi`/`uvicorn` on Python 3.13 (uv), model gpt-4.1-mini; Node 26.7.0, npm 11, Windows 11 Pro. Docs: https://docs.copilotkit.ai/angular/openai-agents-python (snapshot 2026-11-20). Evidence: CI run 44708218250 (2026-11-20, scope=all); #14 CI run 45067665138 + local probe 2/2 (2026-11-23).

## Dev blockers (seen with `ng serve` and normal use of the page)

### [Quickstart](https://docs.copilotkit.ai/angular/openai-agents-python)
**#1 The OpenAI Agents backend is a fragment and no Angular runtime server is shown.**
- **Doc:** "Connect the selected agent backend" says "An OpenAI Agents SDK agent is a plain `Agent` from `agents`" but never shows one. `_common.py` is the showcase's aimock header-forwarding client: no imports (`os`, `httpx`, `AsyncOpenAI`, `set_default_openai_client`, `set_tracing_disabled`) and `SLUG`, `_FORWARDED_PREFIXES`, `get_forwarded_headers` are never defined. `agent_server.py` is `FastAPI(..., lifespan=lifespan)` + `for name, agent in AGENTS.items(): add_openai_agents_fastapi_endpoint(...)`; `AGENTS` and `lifespan` are never defined, no `OpenAIAgentsAgent` is built, and no command starts it. The runtime step is only a callout; the linked Copilot Runtime guide shows only Next.js routes and sends Node/Express readers back to the quickstart.
- **Result:** the backend as published fails at import (`NameError`); no working Angular app can be built from the page without writing the agent, registry, lifespan and runtime yourself.
- **Confirmed by harness:** a HARNESS `Agent` wrapped in `OpenAIAgentsAgent` as `default`, `AGENTS`, `lifespan` (the doc's `configure_sdk`/`close_client`), the missing imports/constants in `backend/_common.py`, and `frontend/server.ts` (`CopilotRuntime` + `createCopilotNodeListener` + `HttpAgent` to `http://localhost:8291/default`) make the chat answer (probe 2026-11-20: "Yes, I'm connected! Here's a quick fun fact about kites…").

### [Tool Call Rendering](https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/tool-rendering)
**#5 The weather tool fetches an endpoint the page never provides.**
- **Doc:** ``fetch(`/api/weather?city=${encodeURIComponent(city)}`)`` and "The weather card shows \"Loading weather for Paris\", then the city and the tool result."
- **Result:** the card shows the city, but the tool result is the Angular app's own `index.html` (`<!doctype html> <html lang="en">…`), and the agent says "I couldn't retrieve the current weather for Paris". No `/api/weather` route is shown or linked.

### [A2UI](https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/a2ui)
**#6 The catalog the page requires is never defined.**
- **Doc:** "A catalog is required: without one, A2UI stays off even when the runtime enables it", then `catalog: productCatalog,`; the catalog snippets also use `dynamicString`, `AcmeBadge`, `PanelComponent` with no imports.
- **Result:** the verbatim files don't type-check (`Cannot find name 'productCatalog'`, `logs/doc-typecheck.log`). Without them: `[CopilotKit] The runtime enables A2UI, but no a2ui.catalog is configured, so A2UI stays off.` and the agent answers in text.

### [MCP Apps](https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/mcp-apps)
**#7 No MCP server or runtime setup is given.**
- **Doc:** only `provideMCPApps()` from `@copilotkit/angular/mcp-apps`; "MCP resource and tool requests travel through the selected AG-UI agent."
- **Result:** the page names no MCP server and shows no runtime `mcpApps` config; the agent replies "I can't open or launch an interactive app… no MCP app-launching tool is available".

### [Open Generative UI](https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/open-generative-ui)
**#8 No sandboxed UI renders with the page's setup.**
- **Doc:** `provideCopilotKit({ …, openGenerativeUI: { sandboxFunctions: [setDashboardFilter] } })`.
- **Result:** no sandbox iframe ever appears (3/3, also with the config at the app root); the agent writes plain HTML `<button>`s into its chat message instead (rendered static, "This chat may display the controls as static HTML"), so clicking does nothing and nothing is written to `sessionStorage`. The page shows no other step (e.g. the runtime's `openGenerativeUI` option).

### [Shared State](https://docs.copilotkit.ai/angular/openai-agents-python/shared-state)
**#9 The agent never sees state written with `agent.setState`.**
- **Doc:** "Click **Mark high priority**, then ask the agent for the current priority. It answers \"high\"."
- **Result:** the panel shows `Priority: high`; the agent replies "There is no priority currently set. Would you like me to help you set or check a specific priority?" (CI run 44708218250). The page shows only the Angular side; the adapter exposes state "through `shared_state()`", which only a backend tool can call, and no page shows one.

### [Pausing the Agent for Input](https://docs.copilotkit.ai/angular/openai-agents-python/human-in-the-loop/useInterrupt)
**#11 No backend that pauses is shown, and the interrupt payload is undocumented.**
- **Doc:** "When the backend agent pauses for input" and `injectInterrupt<ReviewRequest>("default")`.
- **Result:** the quickstart's `default` agent never interrupts, so nothing appears.

### [Headless UI](https://docs.copilotkit.ai/angular/openai-agents-python/custom-look-and-feel/headless-ui)
**#14 The page's headless chat does not compile with `ng serve` on today's packages.**
- **Doc:** `await this.copilotKit.core.runAgent({ agent });` (agent from `injectAgentStore("default")`), with the quickstart's `npm install @copilotkit/angular @angular/cdk @copilotkit/runtime`.
- **Error:** `TS2739: Type 'AbstractAgent' is missing the following properties from type 'AbstractAgent': _threadId, _maxEnforcedEntries, maxEnforcedEntries` at the `runAgent` line; `ng serve` never serves the app.
- Cause: `@copilotkit/angular` 0.6.0 pins `@ag-ui/client` 1.0.2, while `@copilotkit/core` (`^1.79.1`, now 1.90.0) uses `@ag-ui/client` 1.0.5. Reproduced with the doc's install alone in an empty folder. Worked on 2026-11-20 (`@copilotkit/core` 1.85.0).
- HARNESS: the page runs in its own app (`frontend-headless/`, :4291, unpatched) because the compile error took the whole frontend down.

### [Headless Interrupts](https://docs.copilotkit.ai/angular/openai-agents-python/human-in-the-loop/headless)
**#12 The `ticketing` agent is never shown or registered.**
- **Doc:** "When the backend agent emits an AG-UI interrupt" and `injectAgentStore("ticketing")`.
- **Result:** no `ticketing` agent exists and no interrupting backend is given; nothing appears.
- HARNESS: `ticketing` is mapped to the quickstart agent so the page loads; it never interrupts.

### [Sub-agents](https://docs.copilotkit.ai/angular/openai-agents-python/multi-agent/subagents)
**#13 The Angular delegation log is a fragment; the only full frontend is React.**
- **Doc:** the Angular snippet calls `readDelegations(this.agentStore().state())` and `registerRenderToolCall(subAgentRendererConfig(name))` inside a class fragment; the Code tab ("OpenAI Agents SDK (Python): Sub-Agents live demo") has `page.tsx`, `delegation-log.tsx` and a Next.js `route.ts` only.
- **Result:** `readDelegations`, `subAgentRendererConfig`, `SubAgentName`, `this.agentId`, `this.feature` are never defined; the snippet doesn't compile as given, so the page's main feature (the live delegation log) can't be built in Angular without writing it yourself.
- **Confirmed by harness:** the verbatim `subagents.py` (with a HARNESS `demo_agents/_common.py` and a HARNESS `/subagents` mount) plus a HARNESS delegation log in `subagents-chat.component.ts` (CI run 44708218250).

## Minor notes

- Voice (was #2): the "Voice backend setup" link opens the generic /voice page, whose backend is a Next.js route only; `@copilotkit/voice` has no install step, and its `openai` 5 peer-requires zod 3 (ERESOLVE next to zod 4, needs `--legacy-peer-deps`).
- Threads Drawer (was #3): works (lists threads) on an Intelligence runtime, which the page never mentions; the sample template has no layout, so the chat renders below the drawer.
- Quickstart: `HttpAgent` comes from `@ag-ui/client`, which the install step never adds.
- Prebuilt Components: the page's `AppComponent` mounts `copilot-popup` and `copilot-sidebar` together; both launchers sit on the same spot, so "Click the popup launcher button" opens the sidebar.
- Prebuilt Components, Headless Threads: `agentId="support"` is used without saying it must be registered in the runtime.
- Frontend Tools: no imports; `BackgroundToolArgs` and `resolveGradient` are never defined.
- Components as Tools: no imports and no host component; the card has no styles ("INC-4711sev1").
- Human-in-the-loop: the page never says where `ApprovalToolsService` is provided.
- WebMCP: `searchOrders` is never defined (TS2304).
- Authentication: `readSessionToken()` and `verifySession()` are never defined.
- MCP Apps, Open Generative UI: `runtimeUrl: "/api/copilotkit"` assumes a same-origin runtime the Angular setup doesn't have.
- Sub-agents: `demo_agents._common` (`MODEL`, `chat_settings`) is never shown, and the agent is never registered or served.
- Headless Threads: the page never says the list needs a CopilotKit Intelligence runtime or where its key goes; `selectedThreadId` is never defined.
- Agent Read-Only Context: no backend step shown; works anyway (the adapter adds the context to the instructions; the agent named Ada, Europe/London, record-42).
- Sub-agents: links to `/angular/openai-agents-python/shared-state/streaming`, which is a 404.
- "Next steps" links drop `/openai-agents-python` (e.g. `/angular/prebuilt-components`).

## Build-only
