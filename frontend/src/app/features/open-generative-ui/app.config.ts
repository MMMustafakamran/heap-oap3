// src/app/app.config.ts on the Open Generative UI page, verbatim except the runtime URL.
// https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/open-generative-ui
// HARNESS: mounted as the providers of the open-generative-ui/demo route (app.routes.ts), not the
// app root, so the other pages' agents don't all get the sandbox tool.
import { ApplicationConfig } from "@angular/core";
import {
  provideCopilotKit,
  type SandboxFunction,
} from "@copilotkit/angular";
import { z } from "zod";

const dashboardFilterParameters = z.object({ filter: z.string() });

const setDashboardFilter: SandboxFunction = {
  name: "setDashboardFilter",
  description: "Set the active dashboard filter",
  parameters: dashboardFilterParameters,
  handler: async (args) => {
    const { filter } = dashboardFilterParameters.parse(args);
    sessionStorage.setItem("dashboard-filter", filter);
    return { applied: filter };
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideCopilotKit({
      runtimeUrl: "http://localhost:8290/api/copilotkit", // HARNESS: doc says "/api/copilotkit" (relative, ng serve has no proxy); runtime on 8290
      openGenerativeUI: {
        sandboxFunctions: [setDashboardFilter],
      },
    }),
  ],
};
