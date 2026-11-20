/**
 * Chrome-free demo routes. Each one mounts exactly the feature its doc route
 * documents, with nothing but a thin back-bar above it, so a demo can be
 * screen-recorded on its own.
 *
 * All demos share the application-root CopilotKit provider, so a conversation
 * started in one demo continues in another — the Quickstart, Frontend tools,
 * A2UI, and Headless demos all drive the `default` agent and therefore show the
 * same conversation through four different interfaces.
 */
import { Component } from '@angular/core';

import { DemoFrame } from '../components/demo-frame';
import { HitlChatComponent } from '../features/hitl/hitl-chat.component';
import { QuickstartChat } from '../features/quickstart/quickstart-chat';
import { SharedStateChatComponent } from '../features/shared-state/shared-state-chat.component';

@Component({
  selector: 'app-quickstart-demo',
  imports: [DemoFrame, QuickstartChat],
  template: `<app-demo-frame backTo="/quickstart"
    ><app-quickstart-chat
  /></app-demo-frame>`,
})
export class QuickstartDemo {}



@Component({
  selector: 'app-hitl-demo',
  imports: [DemoFrame, HitlChatComponent],
  template: `<app-demo-frame backTo="/human-in-the-loop"
    ><app-hitl-chat
  /></app-demo-frame>`,
})
export class HitlDemo {}

@Component({
  selector: 'app-shared-state-demo',
  imports: [DemoFrame, SharedStateChatComponent],
  template: `<app-demo-frame backTo="/shared-state"
    ><app-shared-state-chat
  /></app-demo-frame>`,
})
export class SharedStateDemo {}

// HARNESS: demo routes for the pages added on 2026-11-09 (assignment.json).
import { SubagentsChatComponent } from '../features/subagents/subagents-chat.component';
import { OrderSearchComponent } from '../features/webmcp/order-search.component';
import { CopilotChat } from '@copilotkit/angular';


@Component({
  selector: 'app-subagents-demo',
  imports: [DemoFrame, SubagentsChatComponent],
  template: `<app-demo-frame backTo="/multi-agent-subagents" heading="Sub-Agents"><app-subagents-chat /></app-demo-frame>`,
})
export class SubagentsDemo {}












// HARNESS: demo routes for the Shared State / HITL / interrupt / WebMCP / Sub-agents pages (OpenAI Agents doc layout, 2026-11-18).
import { AgentReadonlyChatComponent } from '../features/shared-state/agent-readonly-chat.component';
import { UseInterruptChatComponent } from '../features/hitl/use-interrupt-chat.component';
import { HeadlessInterruptsChatComponent } from '../features/hitl/headless-interrupts-chat.component';
import { WebmcpChatComponent } from '../features/webmcp/webmcp-chat.component';

@Component({
  selector: 'app-agent-readonly-demo',
  imports: [DemoFrame, AgentReadonlyChatComponent],
  template: `<app-demo-frame backTo="/agent-readonly" heading="Agent Read-Only Context"><app-agent-readonly-chat /></app-demo-frame>`,
})
export class AgentReadonlyDemo {}

@Component({
  selector: 'app-use-interrupt-demo',
  imports: [DemoFrame, UseInterruptChatComponent],
  template: `<app-demo-frame backTo="/use-interrupt" heading="Pausing the Agent for Input"><app-use-interrupt-chat /></app-demo-frame>`,
})
export class UseInterruptDemo {}

@Component({
  selector: 'app-headless-interrupts-demo',
  imports: [DemoFrame, HeadlessInterruptsChatComponent],
  template: `<app-demo-frame backTo="/headless-interrupts" heading="Headless Interrupts"><app-headless-interrupts-chat /></app-demo-frame>`,
})
export class HeadlessInterruptsDemo {}

@Component({
  selector: 'app-webmcp-chat-demo',
  imports: [DemoFrame, WebmcpChatComponent],
  template: `<app-demo-frame backTo="/webmcp" heading="WebMCP"><app-webmcp-chat /></app-demo-frame>`,
})
export class WebmcpChatDemo {}
