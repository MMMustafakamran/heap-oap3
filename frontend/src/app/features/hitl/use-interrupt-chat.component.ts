/**
 * HARNESS: Pausing the Agent for Input demo. The page's InterruptPanelComponent (verbatim) above a chat.
 * The page shows no backend that pauses; panel + chat use the quickstart `default` agent,
 * which is what the doc's injectInterrupt('default') watches.
 * https://docs.copilotkit.ai/angular/openai-agents-python/human-in-the-loop/useInterrupt
 */
import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

import { InterruptPanelComponent } from './interrupt-panel.component';

@Component({
  selector: 'app-use-interrupt-chat',
  imports: [CopilotChat, InterruptPanelComponent],
  template: `
    <div style="display: flex; flex-direction: column; height: 100%">
      <div style="padding: 0.75rem 1rem"><app-interrupt-panel /></div>
      <div style="flex: 1; min-height: 0"><copilot-chat /></div>
    </div>
  `,
})
export class UseInterruptChatComponent {}
