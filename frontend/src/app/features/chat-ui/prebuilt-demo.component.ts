/**
 * HARNESS host for the Prebuilt Components page
 * (https://docs.copilotkit.ai/angular/openai-agents-python/prebuilt-components): the page's inline
 * chat (support-chat.component.ts) and its popup + sidebar component (popup-sidebar.component.ts,
 * the page's `AppComponent`), both verbatim, mounted together as the page shows them.
 */
import { Component } from '@angular/core';

import { PopupSidebarComponent } from './popup-sidebar.component';
import { SupportChatComponent } from './support-chat.component';

@Component({
  selector: 'app-prebuilt-demo',
  imports: [SupportChatComponent, PopupSidebarComponent],
  template: `
    <div style="padding: 1rem; height: 100%"><app-support-chat /></div>
    <app-popup-sidebar />
  `,
})
export class PrebuiltDemoComponent {}
