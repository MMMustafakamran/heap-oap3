/**
 * MCP Apps demo: a plain chat under the page's provider (mcp-apps/app.config.ts, route providers).
 * The page gives no MCP server, no runtime `mcpApps` config and no agent change, so nothing here
 * can return an app resource.
 * https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/mcp-apps
 */
import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

@Component({
  selector: 'app-mcp-apps-chat',
  imports: [CopilotChat],
  template: `<div style="height: 100%"><copilot-chat /></div>`,
})
export class McpAppsChatComponent {}
