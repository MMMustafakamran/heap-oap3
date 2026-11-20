/**
 * HARNESS: Agent Read-Only Context demo host. The page's two components (verbatim) beside one chat.
 * https://docs.copilotkit.ai/angular/openai-agents-python/shared-state/agent-readonly
 */
import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

import { AccountContextComponent } from './account-context.component';
import { SelectionContextComponent } from './selection-context.component';

@Component({
  selector: 'app-agent-readonly-chat',
  imports: [CopilotChat, AccountContextComponent, SelectionContextComponent],
  template: `
    <div style="display: flex; height: 100%; gap: 1rem">
      <div style="width: 20rem; overflow-y: auto; padding: 1rem">
        <app-account-context />
        <app-selection-context />
      </div>
      <div style="flex: 1; min-width: 0">
        <copilot-chat />
      </div>
    </div>
  `,
})
export class AgentReadonlyChatComponent {}
