// human in the loop : hitl chat start
/**
 * HITL Overview demo: the decision tool (ApprovalToolsService, verbatim) rendered in the chat's
 * tool-call flow. Injecting ApprovalToolsService is what constructs it, and construction performs
 * the `registerHumanInTheLoop` call. HARNESS: the page never shows where the service is provided.
 * https://docs.copilotkit.ai/angular/openai-agents-python/human-in-the-loop
 */

import { Component, inject } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

import { ApprovalToolsService } from './approval-tools.service';

@Component({
  selector: 'app-hitl-chat',
  imports: [CopilotChat],
  providers: [ApprovalToolsService], // HARNESS: the page says "register from the component or service", shows no providers
  template: `
    <div style="height: 100%">
      <copilot-chat />
    </div>
  `,
})
export class HitlChatComponent {
  private readonly approvalTools = inject(ApprovalToolsService); // HARNESS
}
// human in the loop : hitl chat end
