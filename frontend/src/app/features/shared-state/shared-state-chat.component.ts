// shared state : shared state chat start
/**
 * HARNESS: Shared State demo host. The page's WorkspaceComponent (verbatim) beside one chat on the
 * same "default" agent (the page says to scope the store to the chat's agent id, shows no chat).
 * https://docs.copilotkit.ai/angular/openai-agents-python/shared-state
 */

import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

import { WorkspaceComponent } from './workspace.component';

@Component({
  selector: 'app-shared-state-chat',
  imports: [CopilotChat, WorkspaceComponent],
  template: `
    <div style="display: flex; height: 100%; gap: 1rem">
      <div style="width: 20rem; overflow-y: auto; padding: 1rem">
        <app-workspace />
      </div>
      <div style="flex: 1; min-width: 0">
        <copilot-chat />
      </div>
    </div>
  `,
})
export class SharedStateChatComponent {}
// shared state : shared state chat end
