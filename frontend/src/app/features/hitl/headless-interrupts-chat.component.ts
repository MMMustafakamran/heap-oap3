/**
 * HARNESS: Headless Interrupts demo. The page's TicketApprovalComponent (verbatim, agent "ticketing")
 * above a chat on the same agent. The page shows no chat and no backend; "ticketing" is the harness
 * interrupt agent registered in frontend/server.ts.
 * https://docs.copilotkit.ai/angular/openai-agents-python/human-in-the-loop/headless
 */
import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

import { TicketApprovalComponent } from './ticket-approval.component';

@Component({
  selector: 'app-headless-interrupts-chat',
  imports: [CopilotChat, TicketApprovalComponent],
  template: `
    <div style="display: flex; flex-direction: column; height: 100%">
      <div style="padding: 0.75rem 1rem"><app-ticket-approval /></div>
      <div style="flex: 1; min-height: 0"><copilot-chat agentId="ticketing" /></div>
    </div>
  `,
})
export class HeadlessInterruptsChatComponent {}
