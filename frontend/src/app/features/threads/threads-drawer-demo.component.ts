/** HARNESS host: the Threads Drawer page's verbatim ConversationsComponent, full height. */
import { Component, inject } from '@angular/core';
import { CopilotKit } from '@copilotkit/angular';

import { ConversationsComponent } from './conversations.component';

@Component({
  selector: 'app-threads-drawer-demo',
  imports: [ConversationsComponent],
  // HARNESS: the page's template has no layout; the host is a flex row so the chat sits beside the drawer, not below the fold
  template: `<div class="drawer-host" style="display: flex; height: 100%"><app-conversations style="display: flex; flex: 1; min-width: 0; height: 100%" /></div>`,
  styles: [`:host ::ng-deep .drawer-host copilot-chat { flex: 1; min-width: 0; }`],
})
export class ThreadsDrawerDemoComponent {
  constructor() {
    // HARNESS: the page never says threads need a CopilotKit Intelligence runtime; frontend/server.ts serves one under /threads.
    inject(CopilotKit).updateRuntime({ runtimeUrl: 'http://localhost:8290/threads/api/copilotkit' });
  }
}
