# Virlo for Vellum

The official [Virlo](https://virlo.ai) plugin for [Vellum](https://www.vellum.ai/) assistants. Gives your always-on personal AI real-time short-form social intelligence: ask *"what's going viral in my niche right now, and why?"* and get back Virlo's weighted virality score, rising-creator outliers, winning content formats, and AI trend analysis across TikTok, YouTube Shorts, and Instagram Reels.

## What it does

Built on Virlo's forward-facing surfaces:

- **Content Research Agents** (`/v1/agents`) - the unified research engine. One resource, two modes:
  - *one-shot* (`is_recurring: false`) - niche search: *"what's viral in London TikTok fitness right now?"*
  - *recurring* (`is_recurring: true`) - monitoring: *"keep watching this niche and tell me weekly."*
- **Satellite** - creator, sound & video deep-dives: *"tell me about this creator / why did this video pop?"*
- **Trends** - regional (global/us/gb/au), momentum-ranked trend detection, including a free `emerging` feed for "what's about to take off."

## Plugin structure

This is a **thin skill layer over Virlo's existing REST API** - it does not re-implement the API or proxy requests:

```
integrations/vellum/
  package.json              Plugin manifest (name, version, peerDependencies)
  hooks/
    init.ts                 Validates API key, sets VIRLO_API_KEY env var
    shutdown.ts             Cleans up env var on teardown
  skills/
    virlo/
      SKILL.md              The assistant skill: how to use Virlo's API
      agent-playbook.md     How to interpret results (weighted score, formats, trends)
      examples/             Worked end-to-end flows
      prompts/              Golden prompts (acceptance criteria for QA)
```

## How it works

1. The **init hook** reads the user's `api_key` from plugin config and exposes it as `VIRLO_API_KEY` in the process environment.
2. The **SKILL.md** teaches the assistant how to call Virlo's REST API via curl, handle async research runs, interpret the weighted virality score, and manage billing.
3. The assistant uses its existing `bash` tool to make curl requests to `https://api.virlo.ai/v1/` with the Bearer token from `${VIRLO_API_KEY}`.

## Setup (for end users)

1. Create a Virlo account at [dev.virlo.ai/dashboard](https://dev.virlo.ai/dashboard).
2. Generate an API key (starts with `virlo_tkn_`).
3. Add a prepaid balance (minimum $10 - pay-as-you-go, no subscription, never expires) at [dev.virlo.ai/dashboard/billing](https://dev.virlo.ai/dashboard/billing).
4. Add your API key to the Virlo plugin config in Vellum.

## Billing model

**Bring-your-own-key. Tiering lives in Virlo.** Free vs. paid gating, credits, and rate limits are all enforced server-side by the Virlo API - the plugin never gates features, it just relays what the user's key is allowed to do. Users pay Virlo directly from their own prepaid balance.

- Reading results is **free**; creating research costs credits (1 credit = $0.01).
- One-shot agent: $0.50, recurring agent: free to create + $0.50/run, Satellite: $0.50, Data Intelligence add-on: +$1.00.
- The API returns `402` when a user is out of credits - the assistant surfaces this and links to billing.

## Async behavior

Content Research Agent runs (one-shot and recurring) take **~15-20 minutes** (up to 45 with Meta ads). The plugin polls until `finalized: true` or subscribes to the `content_research_agent.run.completed` webhook, then notifies the user - it never blocks them synchronously. This is a natural fit for Vellum's always-on model.

## Links

- [Virlo API docs](https://dev.virlo.ai/docs)
- [Full API reference](https://dev.virlo.ai/llms-full.txt)
- [Agent playbook](https://dev.virlo.ai/agent-playbook.txt)
- [Dashboard](https://dev.virlo.ai/dashboard)

MIT (c) Virlo
