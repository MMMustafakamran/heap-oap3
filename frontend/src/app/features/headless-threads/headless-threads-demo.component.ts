/**
 * HARNESS host for the Headless Threads page
 * (https://docs.copilotkit.ai/angular/openai-agents-python/headless-threads).
 * The page gives `<copilot-chat agentId="support" [threadId]="selectedThreadId()" />` with no
 * component around it and never defines `selectedThreadId`; this host supplies that signal
 * (HARNESS) and mounts the verbatim ThreadListComponent (features/threads/thread-list.component.ts)
 * beside it.
 */
import { Component, inject, signal } from '@angular/core';
import { CopilotChat, CopilotKit } from '@copilotkit/angular';

import { ThreadListComponent } from '../threads/thread-list.component';

@Component({
  selector: 'app-headless-threads-demo',
  imports: [CopilotChat, ThreadListComponent],
  template: `
    <div style="display: flex; height: 100%">
      <aside style="width: 18rem; padding: 1rem; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.5rem">
        <app-thread-list />
      </aside>
      <div style="flex: 1; min-width: 0">
        <!-- headless threads : resume a specific thread (verbatim) -->
        <copilot-chat agentId="support" [threadId]="selectedThreadId()" />
      </div>
    </div>
  `,
})
export class HeadlessThreadsDemoComponent {
  readonly selectedThreadId = signal<string | undefined>(undefined); // HARNESS: never defined on the page
  constructor() {
    // HARNESS: the page never says threads need a CopilotKit Intelligence runtime; frontend/server.ts serves one under /threads.
    inject(CopilotKit).updateRuntime({ runtimeUrl: 'http://localhost:8290/threads/api/copilotkit' });
  }
}
