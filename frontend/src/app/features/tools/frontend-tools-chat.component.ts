/**
 * Frontend Tools demo: `registerFrontendTool(createBackgroundTool(background))`, as the page says,
 * from a component; the agent's `change_background` call sets the gradient behind the chat.
 * https://docs.copilotkit.ai/angular/openai-agents-python/frontend-tools
 */
import { Component, signal } from '@angular/core'; // HARNESS: the page never shows the host component
import { CopilotChat, registerFrontendTool } from '@copilotkit/angular'; // HARNESS: no imports on the page

import { DEFAULT_BACKGROUND, createBackgroundTool } from './tool-feature-model';

@Component({
  selector: 'app-frontend-tools-chat',
  imports: [CopilotChat],
  template: `
    <div
      data-testid="background-host"
      style="height: 100%; padding: 0.75rem; transition: background 400ms ease"
      [style.background]="background()"
    >
      <div style="height: 100%; background: white; border-radius: 0.75rem; overflow: hidden">
        <copilot-chat />
      </div>
    </div>
  `,
})
export class FrontendToolsChatComponent {
  /** Written by the agent through the change_background handler. HARNESS: the page's writable signal. */
  protected readonly background = signal(DEFAULT_BACKGROUND);

  constructor() {
    // frontend tools : register a browser tool start
    registerFrontendTool(createBackgroundTool(this.background));
    // frontend tools : register a browser tool end
  }
}
