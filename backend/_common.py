# HARNESS: the quickstart's _common.py (docs.copilotkit.ai/angular/openai-agents-python, "Connect the
# selected agent backend") shows only the functions below. It never shows an import, SLUG,
# _FORWARDED_PREFIXES or get_forwarded_headers (FINDINGS.md #1). Lines marked HARNESS are added.
import os  # HARNESS

import httpx  # HARNESS
from agents import set_default_openai_client, set_tracing_disabled  # HARNESS
from openai import AsyncOpenAI  # HARNESS

SLUG = "openai-agents-python"  # HARNESS: never defined on the page
_FORWARDED_PREFIXES = ("x-aimock-",)  # HARNESS: never defined on the page


def get_forwarded_headers() -> dict[str, str]:  # HARNESS: never defined on the page (no mock server here)
    return {}


# --- doc: _common.py ---
async def _forward_request_headers(request: httpx.Request) -> None:
    """Copies the current request's mock/diagnostic headers onto a model call.

    ``x-aimock-context`` is fixed to this package's slug so aimock picks this
    package's fixtures whatever the inbound request carried. The rest is
    forwarded only when present, so ordinary demo traffic is never forced
    into strict mode.
    """
    for key, value in get_forwarded_headers().items():
        if key.startswith(_FORWARDED_PREFIXES):
            request.headers[key] = value
    request.headers["x-aimock-context"] = SLUG


_CLIENT: AsyncOpenAI | None = None


def openai_client() -> AsyncOpenAI:
    """The process-wide client every model call goes through."""
    global _CLIENT
    if _CLIENT is None:
        _CLIENT = AsyncOpenAI(
            http_client=httpx.AsyncClient(
                timeout=httpx.Timeout(120.0, connect=10.0),
                event_hooks={"request": [_forward_request_headers]},
            )
        )
    return _CLIENT


def configure_sdk() -> None:
    """Points the Agents SDK at ``openai_client()``. Call once at startup.

    Tracing is off unless OPENAI_AGENTS_TRACING=1: traces go to the OpenAI
    platform, which the mock key and the aimock base URL cannot reach.
    """
    set_default_openai_client(openai_client(), use_for_tracing=False)
    if os.environ.get("OPENAI_AGENTS_TRACING") != "1":
        set_tracing_disabled(True)


async def close_client() -> None:
    global _CLIENT
    client, _CLIENT = _CLIENT, None
    if client is not None:
        await client.close()
# --- end doc ---
