/**
 * A2UI demo. The page's provider snippet passes `a2ui: { catalog: productCatalog, recovery }`, but
 * `productCatalog` is never defined, and the catalog snippets around it use identifiers the page
 * never defines either (`dynamicString`, `AcmeBadge`, `PanelComponent`, every import). Those files
 * are kept verbatim in frontend/doc-verbatim/a2ui/ (outside src/, so `ng serve` keeps building) and
 * type-checked during the take. HARNESS: this chat runs on the app-root provider, which has the
 * page's `recovery` options and no catalog (the one the page never gives), with the runtime's
 * `a2ui: {}` (frontend/server.ts).
 * https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/a2ui
 */
import { Component } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

@Component({
  selector: 'app-a2ui-chat',
  imports: [CopilotChat],
  template: `<div style="height: 100%"><copilot-chat /></div>`,
})
export class A2uiChatComponent {}
