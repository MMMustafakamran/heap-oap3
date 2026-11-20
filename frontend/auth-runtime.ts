/**
 * Authentication page: "Validate every runtime request" (verbatim block below).
 * https://docs.copilotkit.ai/angular/openai-agents-python/auth
 *
 * HARNESS: the page shows only the `createCopilotNodeListener(...)` call. `runtime` and
 * `verifySession` are not on the page. server.ts serves this listener under /auth on port 8290,
 * so it sees the page's own basePath "/api/copilotkit".
 */
import { CopilotRuntime } from "@copilotkit/runtime/v2"; // HARNESS
import { HttpAgent } from "@ag-ui/client"; // HARNESS
import { createCopilotNodeListener } from "@copilotkit/runtime/v2/node";

const agentUrl = process.env["AGENT_URL"] ?? "http://localhost:8291/default"; // HARNESS: OpenAI Agents agent server
const runtime = new CopilotRuntime({ agents: { default: new HttpAgent({ url: agentUrl }) } }); // HARNESS
// HARNESS: the page never defines verifySession; accept the Showcase's demo token only.
const verifySession = async (token: string) => (token === "demo-token-123" ? { userId: "demo" } : null);

// auth : validate every runtime request start
const listener = createCopilotNodeListener({
  runtime,
  basePath: "/api/copilotkit",
  cors: true,
  hooks: {
    onRequest: async ({ request }) => {
      const token = request.headers
        .get("authorization")
        ?.replace(/^Bearer\s+/i, "");
      const session = token ? await verifySession(token) : null;

      if (!session) {
        throw new Response("Unauthorized", { status: 401 });
      }
    },
  },
});
// auth : validate every runtime request end

export const authApp = listener; // HARNESS: mounted by server.ts under /auth
