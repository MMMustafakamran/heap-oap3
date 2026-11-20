/**
 * HARNESS: demo hosts for Frontend Tools and the Generative UI pages (2026-11-18). Each mounts only
 * the code of its own doc page. MCP Apps and Open Generative UI get the page's own
 * `provideCopilotKit` from their route `providers` (app.routes.ts).
 */
import { Component } from '@angular/core';

import { DemoFrame } from '../components/demo-frame';
import { A2uiChatComponent } from '../features/a2ui/a2ui-chat.component';
import { ToolBasedChatComponent } from '../features/gen-ui-tool-based/tool-based-chat.component';
import { ToolRenderingChatComponent } from '../features/gen-ui-tool-rendering/tool-rendering-chat.component';
import { McpAppsChatComponent } from '../features/mcp-apps/mcp-apps-chat.component';
import { OpenGenUiChatComponent } from '../features/open-generative-ui/open-gen-ui-chat.component';
import { FrontendToolsChatComponent } from '../features/tools/frontend-tools-chat.component';

@Component({
  selector: 'app-frontend-tools-demo',
  imports: [DemoFrame, FrontendToolsChatComponent],
  template: `<app-demo-frame backTo="/" heading="Frontend Tools"><app-frontend-tools-chat /></app-demo-frame>`,
})
export class FrontendToolsDemo {}

@Component({
  selector: 'app-gen-ui-tool-based-demo',
  imports: [DemoFrame, ToolBasedChatComponent],
  template: `<app-demo-frame backTo="/" heading="Components as Tools"><app-tool-based-chat /></app-demo-frame>`,
})
export class GenUiToolBasedDemo {}

@Component({
  selector: 'app-gen-ui-tool-rendering-demo',
  imports: [DemoFrame, ToolRenderingChatComponent],
  template: `<app-demo-frame backTo="/" heading="Tool Call Rendering"><app-tool-rendering-chat /></app-demo-frame>`,
})
export class GenUiToolRenderingDemo {}

@Component({
  selector: 'app-a2ui-page-demo',
  imports: [DemoFrame, A2uiChatComponent],
  template: `<app-demo-frame backTo="/" heading="A2UI"><app-a2ui-chat /></app-demo-frame>`,
})
export class A2uiPageDemo {}

@Component({
  selector: 'app-mcp-apps-demo',
  imports: [DemoFrame, McpAppsChatComponent],
  template: `<app-demo-frame backTo="/" heading="MCP Apps"><app-mcp-apps-chat /></app-demo-frame>`,
})
export class McpAppsDemo {}

@Component({
  selector: 'app-open-generative-ui-demo',
  imports: [DemoFrame, OpenGenUiChatComponent],
  template: `<app-demo-frame backTo="/" heading="Open Generative UI"><app-open-gen-ui-chat /></app-demo-frame>`,
})
export class OpenGenerativeUiDemo {}
