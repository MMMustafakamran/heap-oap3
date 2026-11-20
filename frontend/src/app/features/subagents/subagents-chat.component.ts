/**
 * HARNESS: Sub-agents demo host. The page's Angular snippet is a fragment of a Showcase class
 * (`readDelegations`, `subAgentRendererConfig`, `SubAgentName`, `this.agentId`, `this.feature` are never
 * defined; kept verbatim in doc-verbatim/multi-agent-subagents/), so this delegation log is written by the
 * harness: it reads the `delegations` slot of the "subagents" agent's state, the slot the page's verbatim
 * subagents.py writes (backend/demo_agents/subagents.py, served by backend/agent_server.py on 8291 at /subagents).
 */
import { Component, computed } from '@angular/core';
import { CopilotChat, injectAgentStore } from '@copilotkit/angular';

type Delegation = { id: string; sub_agent: string; task: string; status: string; result: string };

@Component({
  selector: 'app-subagents-chat',
  imports: [CopilotChat],
  template: `
    <div style="display: flex; height: 100%">
      <section style="width: 22rem; padding: 1rem; border-right: 1px solid #e2e8f0; overflow: auto">
        <h3 style="font-weight: 600">Delegation log</h3>
        @for (d of delegations(); track d.id) {
          <article class="delegation" style="margin-top: 0.75rem">
            <p style="font-weight: 600">{{ d.sub_agent }} · {{ d.status }}</p>
            <p style="color: #475569; font-size: 0.85rem">{{ d.task }}</p>
          </article>
        } @empty {
          <p style="color: #64748b">No delegations yet.</p>
        }
      </section>
      <div style="flex: 1; min-width: 0"><copilot-chat agentId="subagents" /></div>
    </div>
  `,
})
export class SubagentsChatComponent {
  private readonly agentStore = injectAgentStore('subagents');
  protected readonly delegations = computed( // HARNESS: the delegation log the page never shows (readDelegations is undefined)
    () => ((this.agentStore().state() as { delegations?: Delegation[] } | undefined)?.delegations ?? []),
  );
}
