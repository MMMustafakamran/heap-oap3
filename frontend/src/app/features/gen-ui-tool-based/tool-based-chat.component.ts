/**
 * Components as Tools demo. The page's `registerComponent` snippet, verbatim, in a component
 * constructor (an injection context).
 * https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/tool-based
 */
import { Component } from '@angular/core'; // HARNESS: the page shows the call without a host component
import { CopilotChat, registerComponent } from '@copilotkit/angular'; // HARNESS: the snippet has no imports
import { z } from 'zod'; // HARNESS: the snippet has no imports

import { IncidentCardComponent } from './incident-card.component';

@Component({
  selector: 'app-tool-based-chat',
  imports: [CopilotChat],
  template: `<div style="height: 100%"><copilot-chat /></div>`,
})
export class ToolBasedChatComponent {
  constructor() {
    // components as tools : register component start
    registerComponent({
      name: "show_incident",
      description: "Show one incident from the incident table.",
      parameters: z.object({
        id: z.string().describe("The incident id, such as INC-4711"),
        severity: z.string().describe("One of sev1, sev2, sev3"),
      }),
      component: IncidentCardComponent,
    });
    // components as tools : register component end
  }
}
