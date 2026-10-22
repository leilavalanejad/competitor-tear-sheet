# Company Tear Sheet web app

A company research interface for the Competitor Tear Sheet project. Search by company name, optionally add a website to disambiguate, and read a source-linked brief covering business model, pricing, product surface, competitors, strengths, exposure and what to watch.

## Current state

The private site includes a manually researched Stripe example, section navigation, device-local saved briefs, Markdown export and print-to-PDF. The live research endpoint is implemented but **requires `OPENAI_API_KEY` in Sites runtime secrets**. New-company research is unavailable until that connection is configured. The example is explicitly labeled and never substituted for a requested company.

## Research service

The server calls the OpenAI Responses API with web search required, then parses a structured report. It rejects incomplete responses, absent searches, empty reports, duplicate source IDs, unresolved references and source URLs absent from returned search evidence. These are structural checks, not proof that a source supports a claim; users should inspect material claims. Financial periods and pricing basis are requested in the research instructions. Analysis is labeled separately from facts. Thin or missing research is listed as open questions.

Configure `OPENAI_API_KEY` through Sites runtime secrets, never in the browser or repository. Optional `OPENAI_MODEL` defaults to `gpt-5-mini`. Configure and redeploy before testing a live company. Live calls incur API and web-search usage charges. No key is bundled or inferred from a ChatGPT subscription.

This site starts owner-private. Keep it private while using an owner-funded API key; changing access requires revisiting authentication, quotas and abuse controls. Saved briefs stay in the current browser's local storage, with a maximum of 30. They do not sync across devices. The hosted research service does not persist reports, and provider response storage is disabled.

## Development and validation

Use the Sites setup and build helpers described in the parent project's deployment workflow. After installing dependencies:

```sh
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types --test lib/report.test.ts
```

The UI has desktop and mobile layouts. Browser checks cover rendering, section navigation, saved briefs and the API-not-configured error path. Live research cannot be verified without the runtime API connection. The original research skill and Python builder remain in the repository root.
