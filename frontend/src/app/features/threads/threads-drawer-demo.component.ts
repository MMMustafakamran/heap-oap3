/** HARNESS host: the Threads Drawer page's verbatim ConversationsComponent, full height. */
import { Component, inject } from '@angular/core';
import { CopilotKit } from '@copilotkit/angular';

import { ConversationsComponent } from './conversations.component';

@Component({
  selector: 'app-threads-drawer-demo',
  imports: [ConversationsComponent],
  template: `<div style="display: flex; height: 100%"><app-conversations /></div>`,
})
export class ThreadsDrawerDemoComponent {
  constructor() {
    // HARNESS: the page never says threads need a CopilotKit Intelligence runtime; frontend/server.ts serves one under /threads.
    inject(CopilotKit).updateRuntime({ runtimeUrl: 'http://localhost:8290/threads/api/copilotkit' });
  }
}
