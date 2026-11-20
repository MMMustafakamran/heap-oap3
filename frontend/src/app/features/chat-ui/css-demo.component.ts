/**
 * HARNESS host for CSS Customization
 * (https://docs.copilotkit.ai/angular/openai-agents-python/custom-look-and-feel/css): the page says
 * "Put a scope class on your feature host"; the host is the Prebuilt Components inline chat
 * (support-chat.component.ts) and the scope class is the page's `.support-chat`. The CSS block is
 * verbatim in src/styles.css.
 */
import { Component } from '@angular/core';

import { SupportChatComponent } from './support-chat.component';

@Component({
  selector: 'app-css-demo',
  imports: [SupportChatComponent],
  template: `<div class="support-chat" style="padding: 1rem; height: 100%"><app-support-chat /></div>`,
})
export class CssDemoComponent {}
