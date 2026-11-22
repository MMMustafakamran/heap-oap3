// HARNESS: own Angular app for the Headless UI page only. Its verbatim code fails `ng serve`
// (TS2739 AbstractAgent, @copilotkit/angular 0.6.0 pins @ag-ui/client 1.0.2 while @copilotkit/core
// 1.90.0 uses 1.0.5; FINDINGS.md Headless UI entry), which stopped the whole main frontend from
// compiling. Isolated so the other pages can film; nothing here is patched.
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCopilotKit } from '@copilotkit/angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // quickstart : connect to copilot runtime start
    provideCopilotKit({
      runtimeUrl: 'http://localhost:8290/api/copilotkit', // HARNESS: doc says :8200, runtime runs on 8290 (workspace port plan)
    }),
    // quickstart : connect to copilot runtime end
  ],
};
