/**
 * Open Generative UI demo: a plain chat under the page's provider (open-generative-ui/app.config.ts,
 * route providers). https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/open-generative-ui
 */
import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

@Component({
  selector: 'app-open-gen-ui-chat',
  imports: [CopilotChat],
  template: `<div style="height: 100%"><copilot-chat /></div>`,
})
export class OpenGenUiChatComponent {}
