/**
 * HARNESS: Copilot Runtime for this harness (the Angular quickstart never shows one for OpenAI Agents:
 * its runtime callout links a guide whose only server is a Next.js route; FINDINGS.md #1).
 * Shape: the Node listener from @copilotkit/runtime/v2/node (standalone Angular quickstart), with an
 * HttpAgent pointed at the OpenAI Agents agent server in ../backend (agent_server.py mounts each agent
 * at /<name>, the quickstart's "point Copilot Runtime at http://localhost:8000/<agent name>").
 * Ports: runtime 8290 (doc: 8200), agent 8291 (doc: 8000). Override with PORT / AGENT_URL.
 * `support` resolves to the same agent so doc snippets with agentId="support" run verbatim.
 */
// quickstart : copilot runtime
import { createServer } from "node:http";
import { CopilotKitIntelligence, CopilotRuntime } from "@copilotkit/runtime/v2";
import { createCopilotNodeListener } from "@copilotkit/runtime/v2/node";
import { HttpAgent } from "@ag-ui/client";
import { authApp } from "./auth-runtime"; // HARNESS: Authentication guide hook, served under /auth

const agentUrl =
  process.env["AGENT_URL"] ?? "http://localhost:8291/default"; // HARNESS: OpenAI Agents agent server, port 8291 (doc: 8000)

// quickstart : copilot runtime start
const runtime = new CopilotRuntime({
  agents: {
    // quickstart : connect selected agent backend
    default: new HttpAgent({ url: agentUrl }),
    // chat ui : support agent
    support: new HttpAgent({ url: agentUrl }),
    // HARNESS: the Headless Interrupts page injects "ticketing", which no page registers or shows; no
    // page gives an agent that interrupts, so it gets the quickstart agent (FINDINGS.md).
    ticketing: new HttpAgent({ url: agentUrl }),
    // HARNESS: Sub-agents page agent (backend/demo_agents/subagents.py, mounted at /subagents).
    subagents: new HttpAgent({ url: "http://localhost:8291/subagents" }),
  },
  // a2ui : enable a2ui middleware start
  a2ui: {},
  // a2ui : enable a2ui middleware end
});
// quickstart : copilot runtime end

const port = Number(process.env["PORT"] ?? 8290); // HARNESS: runtime port 8290 (doc uses 8200; workspace port plan)

// quickstart : create copilot node listener start
const copilotListener = createCopilotNodeListener({
  runtime,
  basePath: "/api/copilotkit",
  cors: true,
});
// HARNESS: threads pages (Threads Drawer, Headless Threads) need CopilotKit Intelligence; neither page
// says where its key goes. Mounted under /threads only when CPK_INTELLIGENCE_API_KEY is set (QA-RULES 9a).
try { process.loadEnvFile(".env.intelligence"); } catch {} // HARNESS: local key file (gitignored); CI passes the env var
const threadsListener = process.env["CPK_INTELLIGENCE_API_KEY"]
  ? createCopilotNodeListener({
      runtime: new CopilotRuntime({
        agents: { default: new HttpAgent({ url: agentUrl }), support: new HttpAgent({ url: agentUrl }) },
        intelligence: new CopilotKitIntelligence({ apiKey: process.env["CPK_INTELLIGENCE_API_KEY"]! }),
        identifyUser: async () => ({ id: "oap-angular-qa-user", name: "OAP Angular QA" }), // HARNESS: no auth here
      }),
      basePath: "/api/copilotkit",
      cors: true,
    })
  : null;
if (!threadsListener) console.warn("CPK_INTELLIGENCE_API_KEY not set: /threads runtime not mounted");

// HARNESS: /auth/* goes to the Authentication guide's hooked runtime (auth-runtime.ts).
createServer((req, res) => {
  if (threadsListener && req.url?.startsWith("/threads/")) {
    req.url = req.url.slice("/threads".length);
    threadsListener(req, res);
    return;
  }
  if (req.url?.startsWith("/auth/")) {
    req.url = req.url.slice("/auth".length);
    authApp(req, res);
    return;
  }
  copilotListener(req, res);
}).listen(port, () => {
  console.log(
    `Copilot Runtime listening at http://localhost:${port}/api/copilotkit`,
  );
  console.log(`OpenAI Agents agent: ${agentUrl}`);
});
// quickstart : create copilot node listener end
