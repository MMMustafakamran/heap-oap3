# Angular

> Connect an Angular app to Copilot Runtime with CopilotKit.

This guide takes an Angular app to a working chat UI backed by [Copilot Runtime](/angular/openai-agents-python/backend/copilot-runtime). When you select an agent backend in the sidebar, the backend step below changes with it. Without a selection, the guide uses CopilotKit's `BuiltInAgent`.

The runtime runs on your server, keeps model credentials out of the browser, and exposes the `default` agent that `CopilotChat` uses automatically.

<OpsPlatformCTA
  variant="inline"
  title="Take your Angular copilot from local to production"
  body="Add threads, inspection, and cloud-hosted or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
  surface="docs:angular/quickstart:production"
/>

## Start with your coding agent [#start-with-your-coding-agent]

Use this prompt to connect your Angular app to Copilot Runtime with the selected agent backend, then verify a working conversation. You can also follow the manual steps below.

<PageAgentPrompt />

## Prerequisites [#prerequisites]

- An OpenAI API key (or another model provider supported by [Model Selection](/model-selection))
- Angular 22
- Node.js 22

## Getting started [#getting-started]

<Steps>
    <Step>
        ### Create your Angular app [#create-your-angular-app]

        If you don't have one already, pin the CLI to the supported major:

        ```bash
        npx @angular/cli@22 new my-copilot-app
        cd my-copilot-app
        ```
    </Step>
    <Step>
        ### Install CopilotKit [#install-copilotkit]

        `@copilotkit/angular` gives you Angular components, directives, and services for CopilotKit. It supports zoneless applications. Install it with `@angular/cdk`, and install `@copilotkit/runtime` for your local Copilot Runtime server:

        <Tabs groupId="package-manager" items={['npm', 'pnpm', 'yarn']}>
            <Tab value="npm">
                ```bash
                npm install @copilotkit/angular @angular/cdk @copilotkit/runtime
                npm install -D tsx typescript @types/node
                ```
            </Tab>
            <Tab value="pnpm">
                ```bash
                pnpm add @copilotkit/angular @angular/cdk @copilotkit/runtime
                pnpm add -D tsx typescript @types/node
                ```
            </Tab>
            <Tab value="yarn">
                ```bash
                yarn add @copilotkit/angular @angular/cdk @copilotkit/runtime
                yarn add -D tsx typescript @types/node
                ```
            </Tab>
        </Tabs>

        <Callout type="info" title="Match @angular/cdk to your Angular version">
          `@angular/cdk` must share your Angular major version. Most package managers resolve this for you, but if you hit a peer-dependency error, pin it explicitly (for example `@angular/cdk@^22`).
        </Callout>
    </Step>
    <Step>
      ### Connect the selected agent backend [#connect-the-selected-agent-backend]

      An OpenAI Agents SDK agent is a plain `Agent` from `agents`: a name,
      instructions, a model and its tools. The AG-UI adapter, `ag_ui_openai_agents`,
      wraps it in an `OpenAIAgentsAgent`. The wrapper turns each AG-UI request into
      a streamed SDK run and streams the SDK's events back as AG-UI events.

      The model calls go through the SDK's default OpenAI client, so the usual
      `OPENAI_API_KEY` and `OPENAI_BASE_URL` apply. The showcase registers one
      `AsyncOpenAI` client for the whole process. It points that client at aimock
      and copies the test headers of the current request onto every model call:

      ~~~~python title="_common.py"
      async def _forward_request_headers(request: httpx.Request) -> None:
          """Copies the current request's mock/diagnostic headers onto a model call.

          ``x-aimock-context`` is fixed to this package's slug so aimock picks this
          package's fixtures whatever the inbound request carried. The rest is
          forwarded only when present, so ordinary demo traffic is never forced
          into strict mode.
          """
          for key, value in get_forwarded_headers().items():
              if key.startswith(_FORWARDED_PREFIXES):
                  request.headers[key] = value
          request.headers["x-aimock-context"] = SLUG


      _CLIENT: AsyncOpenAI | None = None


      def openai_client() -> AsyncOpenAI:
          """The process-wide client every model call goes through."""
          global _CLIENT
          if _CLIENT is None:
              _CLIENT = AsyncOpenAI(
                  http_client=httpx.AsyncClient(
                      timeout=httpx.Timeout(120.0, connect=10.0),
                      event_hooks={"request": [_forward_request_headers]},
                  )
              )
          return _CLIENT


      def configure_sdk() -> None:
          """Points the Agents SDK at ``openai_client()``. Call once at startup.

          Tracing is off unless OPENAI_AGENTS_TRACING=1: traces go to the OpenAI
          platform, which the mock key and the aimock base URL cannot reach.
          """
          set_default_openai_client(openai_client(), use_for_tracing=False)
          if os.environ.get("OPENAI_AGENTS_TRACING") != "1":
              set_tracing_disabled(True)


      async def close_client() -> None:
          global _CLIENT
          client, _CLIENT = _CLIENT, None
          if client is not None:
              await client.close()


      ~~~~

      Nothing about CopilotKit is configured on the agent itself. On every run the
      wrapper:

      - adds the tools the page registered to a per-request copy of the agent, as
        tools the browser answers;
      - appends the page's `useAgentContext` entries to the instructions;
      - makes the run's AG-UI state readable and writable through `shared_state()`.

      The shared `Agent` is never changed, so one agent can serve many requests at
      once.

      `add_openai_agents_fastapi_endpoint` mounts one wrapped agent as an AG-UI
      endpoint on a FastAPI app. The showcase keeps its `OpenAIAgentsAgent`s in a
      `{name: agent}` mapping and mounts each one at `/<name>`:

      ~~~~python title="agent_server.py"
      app = FastAPI(title="OpenAI Agents SDK Agent Server", lifespan=lifespan)
      for name, agent in AGENTS.items():
          add_openai_agents_fastapi_endpoint(app, agent, f"/{name}", include_health=False)
      ~~~~

      Then point Copilot Runtime at `http://localhost:8000/<agent name>`.

      <Accordions>
        <Accordion title="Install the SDK">
          ```bash
          pip install ag-ui-openai-agents openai-agents
          ```
        </Accordion>
      </Accordions>

      <Callout type="info" title="Expose the selected backend through Copilot Runtime">
        Configure Copilot Runtime to register this backend as the `default`
        agent at `/api/copilotkit`. Continue with the selected backend's
        [Copilot Runtime guide](/angular/openai-agents-python/backend/copilot-runtime) for its runtime
        adapter, credentials, and server command. Do not replace it with the
        `BuiltInAgent` server from the standalone Angular path.
      </Callout>
    </Step>
    <Step>
        ### Import the styles [#import-the-styles]

        Add the package stylesheet to your global styles. It's self-contained, so the chat renders without any other CSS.

        ```css title="src/styles.css"
        @import "@copilotkit/angular/styles.css"; /* [!code highlight] */
        ```
    </Step>
    <Step>
        ### Connect to Copilot Runtime [#connect-to-copilot-runtime]

        Point `provideCopilotKit` at the runtime endpoint. The chat uses the agent that your runtime registers as `default`.

        ```ts title="src/app/app.config.ts"
        import { ApplicationConfig } from "@angular/core";
        import { provideCopilotKit } from "@copilotkit/angular"; // [!code highlight]

        export const appConfig: ApplicationConfig = {
          providers: [
            // [!code highlight:3]
            provideCopilotKit({
              runtimeUrl: "http://localhost:8200/api/copilotkit",
            }),
          ],
        };
        ```
    </Step>
    <Step>
        ### Add the chat UI [#add-the-chat-ui]

        Import the `CopilotChat` component into your root component and drop it into the template.

        ```ts title="src/app/app.ts"
        import { Component } from "@angular/core";
        import { CopilotChat } from "@copilotkit/angular"; // [!code highlight]

        @Component({
          selector: "app-root",
          imports: [CopilotChat], // [!code highlight]
          template: `
            <!-- [!code highlight:3] -->
            <div style="height: 100vh">
              <copilot-chat />
            </div>
          `,
        })
        export class App {}
        ```

    </Step>
    <Step>
      ### Run the backend, runtime, and Angular app [#run-the-backend-runtime-and-angular-app]

      Start the selected agent backend and Copilot Runtime with the commands
      from its runtime guide. Confirm
      `http://localhost:8200/api/copilotkit/info` reports the `default`
      agent, then start Angular:

      ```bash
      npm start
      ```

      Open the Angular CLI URL (usually `http://localhost:4200`) and send a
      message. The request now follows the selected path end to end:
      Angular → Copilot Runtime → your selected agent backend.
    </Step>
    <Step>
        ### Open Inspector and confirm setup [#open-inspector-and-confirm-setup]

        On localhost, click the Inspector button in the corner of the app.

        1. Open **Inspect**, then **Agent**. Your agent is listed.
        2. Send a chat message. Open **Inspect**, then **AG-UI Events**. Events are moving.
        3. Open **Rich Threads**. The list is unlocked (Intelligence is on), or locked with **Copy setup prompt** (Intelligence is off).

        More detail: [Inspector](/angular/openai-agents-python/inspector).
    </Step>

</Steps>

## Next steps [#next-steps]

1. [Prebuilt Components](/angular/prebuilt-components): choose a chat surface, then follow the sidebar to frontend tools, generative UI, human-in-the-loop, shared state, threads, attachments, and headless UI.
2. [Runtime and backend docs](/angular/openai-agents-python/backend/copilot-runtime): configure the server, secure requests, and deploy without leaving the selected Angular surface.

Later:

- [CopilotKit Intelligence](/angular/openai-agents-python/intelligence/overview): add threads, inspection, and cloud-hosted or self-hosted operations.
- [Angular API reference](/reference/angular): use components, signals, tools, context, and runtime services.
- [Production and lifecycle](/reference/angular/production-lifecycle): handle cleanup, errors, server rendering, hydration, zoneless Angular, and browser-only features.
