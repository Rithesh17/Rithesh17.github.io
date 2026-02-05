---
title: Founding Engineer
company: Accretional
location: San Francisco, CA
startDate: 2025-08-11
endDate: present
type: Full-time
technologies: [Go, gRPC, Protobuf, SQLite, Cloudflare, GCP, Docker, Envoy, TypeScript, SvelteKit]
timelineHash: exp-accretional-founding-engineer
featured: true
description: Building cloud infrastructure at Accretional. Working on systems across Petros (container runtime), Collector (data layer), Brilliant (agentic IDE), and Statue (static site generator).
---

# Founding Engineer at Accretional

## What is Accretional

Accretional is building a ==cloud platform for the next era of software development==, one where AI agents work alongside developers. The platform ties together Brilliant (a browser-based agentic IDE), Statue (a static site generator), Source (managed Git hosting), and the infrastructure that makes it all run.

As a founding engineer on a small team, I've ended up owning systems across every layer of the stack: from the data layer that AI agents query, to the publishing pipeline that puts sites on custom domains, to the workflow system that powers AI-assisted coding in the IDE.

## What founding engineer actually means

The title is more of an honour given to me as one of the engineers to have brought this ecosystem from ground up. My focus is ==Cloud Development and ML infrastructure==, with a special focus on AI agents.

What I didn't expect was how much I'd learn from working across the whole stack: database internals, API design, UI code, infrastructure. It gives you a feel for how systems fit together that you can't get any other way. You start seeing tradeoffs everywhere, understanding why decisions were made, developing opinions about how to make the next one better.

I can't believe I did so much in six months, and I can't wait to see where this goes.

## Making deployment invisible

I built the ==end-to-end website publishing infrastructure== that takes a user's project live on a custom domain with a single click. Integrating domain registration (Dynadot), DNS configuration (Cloudflare), static file hosting (GCS), and CDN caching with retry logic and failure recovery...

==A user clicks publish, picks a domain, and they can expect their site to be live right away!== (Well, maybe after a few minutes but no extra work). 

Behind that click is a chain that all has to work: checking domain availability, registering through the registrar API, setting up DNS records, configuring CDN rules, uploading files to storage, and purging stale caches. Each step can fail independently, and a failure at step four shouldn't leave things half-configured.

Getting them to work together reliably meant building retry logic with exponential backoff for transient failures, and recovery paths for partial failures so the system could pick up where it left off. The goal was to make infrastructure invisible. Users shouldn't think about DNS propagation or CDN configuration, just see their site live.

## Teaching semantics to the data layer

I added ==semantic search to Collector, our gRPC data layer==, enabling AI agents to find code by meaning than just exact keywords. We had to mitigate our SQLite driver to support native extensions, integrate sqlite-vec for vector operations, and build a hybrid search system that combines vector similarity with full-text scoring.

Collector is the data and service framework underneath the platform. It stores protobuf messages in SQLite with full-text search, JSON queries, and multi-tenant namespacing. It's what AI agents in Brilliant query when they need context.

The migration had surprising benchmark results that changed our approach entirely (I'll write that up separately). The final interface lets you query with any combination of semantic search, full-text search, JSON filters, and label matching, flexible enough for whatever an AI agent might need to look up.

## Rebuilding how workflows work

I ==rewrote Brilliant's workflow system into a clean architecture== with a dedicated handler, file-system persistence, and workspace watching. The prompts are now version-controllable, shareable, and editable outside the extension.

The previous system had workflow logic scattered across multiple files with tangled dependencies. If we had to add new features, we had to change code in five different places and hope nothing broke. The new architecture centers on a workflow handler that manages all operations, plus a workspace listener that watches file changes across open workspaces.

The key change was making prompts persist to disk. Now, ==prompts are saved as files that can be version-controlled and shared==. Creating a prompt writes a file; deleting removes it. This also enabled default workflows: starter prompts that ship with the extension for users to build on.

## Securing sensitive operations

I built a verification system for sensitive operations (token creation, private repo access) using hCaptcha, signed time-limited tokens, and rotating secrets. I also ==configured Envoy proxy to pass user identity== through to our container runtime.

Some operations need a human verification layer: creating access tokens, cloning private repositories, anything with credentials. The flow uses hCaptcha to confirm human intent, generates signed tokens for specific operations with limited validity, and integrates with Forgejo for scoped Git tokens that get cleaned up after use.

The backend runs on Google Cloud with rotating secrets where each deploy generates a new signing key, so leaked tokens are only valid until the next deployment. ==All of this is invisible to users. They just see their operation work with no hassle to login repeatedly==

## The smaller pieces that add up

Beyond the major systems, I built developer tooling, deployment scripts, and frontend code across the platform. This includes a ==component lab for Statue that compiles Svelte components in isolation== and generates previews across different themes and prop configurations.

I worked on publishing flows in Statue, workflow UI in Brilliant, and the glue that makes things feel cohesive. Fixed build issues, added documentation, connected user-facing pieces to the systems behind them.