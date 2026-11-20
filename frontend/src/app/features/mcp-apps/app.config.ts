// src/app/app.config.ts on the MCP Apps page, verbatim except the runtime URL.
// https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/mcp-apps
// HARNESS: mounted as the providers of the mcp-apps/demo route (app.routes.ts), not the app root,
// so the other pages keep their own provider.
import { ApplicationConfig } from "@angular/core";
import { provideCopilotKit } from "@copilotkit/angular";
import { provideMCPApps } from "@copilotkit/angular/mcp-apps";

export const appConfig: ApplicationConfig = {
  providers: [
    provideCopilotKit({ runtimeUrl: "http://localhost:8290/api/copilotkit" }), // HARNESS: doc says "/api/copilotkit" (relative, ng serve has no proxy); runtime on 8290
    provideMCPApps(),
  ],
};
