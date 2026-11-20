/**
 * Tool Call Rendering demo. The page's `registerFrontendTool` snippet ("Pass the class as
 * `component` when the tool runs in the browser"), verbatim, in a component constructor.
 * The `registerRenderToolCall` snippet is the alternative for a server-side `getWeather`;
 * the two register the same tool name, so only the browser variant is mounted (the OpenAI Agents
 * agent has no getWeather tool, and the page shows no backend for one).
 * https://docs.copilotkit.ai/angular/openai-agents-python/generative-ui/tool-rendering
 */
import { Component } from '@angular/core'; // HARNESS: the page shows the call without a host component
import { CopilotChat, registerFrontendTool } from '@copilotkit/angular'; // HARNESS: the snippet has no imports
import { z } from 'zod'; // HARNESS: the snippet has no imports

import { WeatherCardComponent } from './weather-card.component';

@Component({
  selector: 'app-tool-rendering-chat',
  imports: [CopilotChat],
  template: `<div style="height: 100%"><copilot-chat /></div>`,
})
export class ToolRenderingChatComponent {
  constructor() {
    // tool rendering : register frontend tool with component start
    registerFrontendTool({
      name: "getWeather",
      description: "Get the current weather for a city",
      parameters: z.object({ city: z.string() }),
      component: WeatherCardComponent,
      handler: async ({ city }, { signal }) => {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
          signal,
        });
        return response.text();
      },
    });
    // tool rendering : register frontend tool with component end
  }
}
