// human in the loop : ticket approval start
/**
 * "Handle an interrupt from the store", verbatim.
 * https://docs.copilotkit.ai/angular/openai-agents-python/human-in-the-loop/headless
 *
 * Verbatim, agent id "ticketing" included. HARNESS: no page registers a "ticketing" agent or shows a
 * backend that emits an interrupt; frontend/server.ts maps "ticketing" to the quickstart agent.
 */

import { Component } from '@angular/core';
import { injectAgentStore } from '@copilotkit/angular';

@Component({
  selector: 'app-ticket-approval',
  template: `
    @let interrupts = store().interruptController;

    @if (interrupts.hasInterrupt()) {
      <section>
        <p>{{ interrupts.interrupt()?.message }}</p>
        <button type="button" (click)="interrupts.resolve({ approved: true })">
          Approve
        </button>
        <button type="button" (click)="interrupts.cancel()">Reject</button>
      </section>
    }
  `,
})
export class TicketApprovalComponent {
  protected readonly store = injectAgentStore('ticketing');
}
// human in the loop : ticket approval end
