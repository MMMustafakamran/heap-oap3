/**
 * HARNESS: WebMCP demo host: the page's OrderSearchComponent (registers searchOrders with webmcp on)
 * beside a chat on the default agent, so the same handler can be called by the CopilotKit agent.
 * https://docs.copilotkit.ai/angular/openai-agents-python/webmcp
 */
import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

import { OrderSearchComponent } from './order-search.component';

@Component({
  selector: 'app-webmcp-chat',
  imports: [CopilotChat, OrderSearchComponent],
  template: `<app-order-search /><div style="height: 100%"><copilot-chat /></div>`,
})
export class WebmcpChatComponent {}
