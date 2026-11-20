# HARNESS: the Angular quickstart (docs.copilotkit.ai/angular/openai-agents-python, "Connect the selected
# agent backend") shows only the three agent_server.py lines marked "doc" below. It never shows an
# import, never defines an Agent, AGENTS or lifespan, and never says how to start the server
# (FINDINGS.md #1). Everything else is HARNESS.
import os  # HARNESS
from contextlib import asynccontextmanager  # HARNESS

from ag_ui_openai_agents import OpenAIAgentsAgent, add_openai_agents_fastapi_endpoint  # HARNESS
from agents import Agent  # HARNESS
from fastapi import FastAPI  # HARNESS

import _common  # HARNESS: the quickstart's _common.py
from demo_agents.subagents import subagents_agent  # HARNESS: Sub-agents page agent (verbatim file)


@asynccontextmanager
async def lifespan(app: FastAPI):  # HARNESS: never defined on the page; uses the doc's _common helpers
    _common.configure_sdk()
    yield
    await _common.close_client()


# HARNESS: the page says "a plain Agent from agents: a name, instructions, a model and its tools" but
# shows none. One neutral chat agent, registered as `default` (the name Copilot Runtime and CopilotChat use).
AGENTS = {  # HARNESS
    "default": OpenAIAgentsAgent(
        Agent(
            name="assistant",
            instructions="You are a helpful assistant embedded in a CopilotKit app.",
            model="gpt-4.1-mini",
        )
    ),
    "subagents": OpenAIAgentsAgent(subagents_agent),  # HARNESS: Sub-agents page; the page never registers it
}

app = FastAPI(title="OpenAI Agents SDK Agent Server", lifespan=lifespan)  # doc
for name, agent in AGENTS.items():  # doc
    add_openai_agents_fastapi_endpoint(app, agent, f"/{name}", include_health=False)  # doc


@app.get("/health")  # HARNESS: readiness check for start-all.sh / CI
async def health() -> dict[str, str]:
    return {"status": "ok"}


if __name__ == "__main__":  # HARNESS: the page never says how to start it; port 8291 (doc: 8000)
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8291")))
