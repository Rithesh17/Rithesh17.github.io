---
title: Founding Engineer - Infrastructure & Platform
company: Accretional
location: San Francisco, CA
startDate: 2025-08-11
endDate: present
type: Full-time
technologies: [Go, CGO, C++, OpenVINO, vLLM, gRPC, sqlite-vec, Python, Docker, Modal]
timelineHash: exp-accretional-founding-engineer
featured: true
description: Authored openvino-go (open-source Go/CGO inference library for Intel OpenVINO), built gRPC embedding and vLLM serving infrastructure, and engineered hybrid vector search for AI agents.
---

# Founding Engineer - Infrastructure & Platform at Accretional

## What is Accretional

Accretional is building a ==cloud platform for the next era of software development==, one where AI agents work alongside developers. The platform ties together Brilliant (a browser-based agentic IDE), Statue (a static site generator), Source (managed Git hosting), and the infrastructure that makes it all run.

As a founding engineer on a small team, I've ended up owning systems across every layer of the stack: from the inference library and data layer that AI agents query, to the publishing pipeline that puts sites on custom domains, to the workflow system that powers AI-assisted coding in the IDE.

## What founding engineer actually means

The title is an honour given to me as one of the engineers to have brought this ecosystem from the ground up. My focus is ==ML inference systems and platform infrastructure==, with a special emphasis on the AI agent stack.

What I didn't expect was how much I'd learn from working across the whole stack: database internals, API design, UI code, infrastructure. It gives you a feel for how systems fit together that you can't get any other way. You start seeing tradeoffs everywhere, understanding why decisions were made, developing opinions about how to make the next one better.

## Open-source inference library: openvino-go

I built ==openvino-go==, an open-source Go library for Intel OpenVINO Runtime. It's the foundation layer that powers all inference in the platform. There were no production-quality Go bindings for OpenVINO, so I wrote them from scratch.

The architecture has three layers: a C++ wrapper that talks directly to OpenVINO's native API, an internal CGO package that translates between C and Go types, and a public Go API that feels native to the language. Beyond basic wrapping, I implemented features that the reference implementation doesn't have. Async inference was the first priority: non-blocking StartAsync and Wait calls with context-aware cancellation, which benchmarked 40% faster than synchronous ONNX Runtime at equivalent throughput. Next came variable state, which wraps OpenVINO's VariableState API so recurrent models can carry context between inference calls. This matters when you're processing hierarchical structures where state flows across levels. I also added batch operation helpers and wrote detailed benchmarks against onnxruntime_go to verify the performance gains on Intel CPUs.

The library is ==open source under Accretional's GitHub== with 90%+ test coverage, automated CI, and OpenVINO 2025.x support. It's in production, processing real traffic through the embedding service.

## Core ML infrastructure for agents

The ==gRPC embedding service and vLLM-based LLM serving== are the two halves of the platform's AI stack. One supplies context through semantic vectors, the other supplies generation through completions.

The embedding service (rpcembed) takes protobuf messages and a type descriptor, builds a semantic string from each field's value, and batch-embeds them using openvino-go. This lets us embed arbitrary data structures at write time with meaning extracted from the protobuf schema, not just raw text. On the generation side, the vLLM manager spawns model servers on demand and routes OpenAI-compatible completion requests through a Go gRPC layer. Agents in Brilliant query the data layer for relevant code and docs, then call the LLM to produce or refine output. Building and operating both sides is what I mean by core ML infrastructure for agentic workflows.

## Teaching semantics to the data layer

I added ==hybrid vector and full-text search to Collector==, our gRPC data layer, enabling AI agents to find code by meaning rather than just exact keywords.

The migration involved integrating sqlite-vec for vector columns, building a store factory with a hybrid driver model, and implementing chunked tokenization with L2-normalized mean pooling for better embedding quality on long inputs. The final interface lets you query with any combination of semantic similarity, full-text scoring, JSON filters, and label matching. Benchmark results surprised us and changed our approach entirely. The hybrid model consistently outperformed pure vector search on code retrieval tasks, so we made it the default.

## Making deployment invisible

I built the ==end-to-end website publishing infrastructure==: domain registration, Cloudflare DNS, GCS storage, CDN caching, all triggered by a single click.

Behind that click is a chain that all has to work: checking domain availability, registering through the registrar API, setting up DNS records, configuring CDN rules, uploading files to storage, and purging stale caches. Each step can fail independently, and a failure at step four shouldn't leave things half-configured. I built retry logic with exponential backoff for transient failures and recovery paths for partial failures so the system can pick up where it left off. Users just see their site go live.

## Securing sensitive operations

I built a ==verification system for sensitive platform operations== using hCaptcha, signed time-limited tokens, and rotating secrets, and configured Envoy proxy to propagate user identity through to the container runtime.

The flow generates signed tokens for specific operations with limited validity windows. The backend runs on Google Cloud with rotating secrets so each deploy generates a new signing key, and leaked tokens are only valid until the next deployment. I also implemented Forgejo-aware git transport that injects per-user headers during clone and fetch for request isolation.

## The smaller pieces that add up

Beyond the major systems, I built ==developer tooling, deployment scripts, and frontend code== across the platform: a component lab for Statue that compiles Svelte components in isolation, build pipelines, workflow UI in Brilliant, and the glue that makes things feel cohesive.
