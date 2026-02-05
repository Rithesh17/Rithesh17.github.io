---
title: AI Engineering Intern
company: Accretional
location: San Francisco, CA
startDate: 2024-06-20
endDate: 2024-08-31
type: Internship
technologies: [Python, TypeScript, Svelte, LLMs, Mistral, LLaMA, LoRA, PEFT, FAISS, AWS Lambda, Google Cloud Functions, RAG]
timelineHash: exp-accretional-ai-intern
featured: true
description: Built core features for Brilliant, an AI coding assistant. Worked on RAG pipelines, LLM fine-tuning, and the extension's prompt and deployment systems.
---

# AI Engineering Intern at Accretional

I interned at Accretional during the summer, working on Brilliant, an AI-driven coding assistant that generates APIs from natural language and deploys them to the cloud. The internship split between ==research on making LLM outputs reliable, and hands-on development of the VS Code extension==.

## Retrieval-Augmented Generation

I ==built a RAG pipeline using FAISS (combining Flat L2 and HNSW indices)== that retrieves relevant documentation and code examples before the model generates anything. This reduced hallucinations by grounding outputs in real examples rather than training data alone.

The core problem with LLMs generating code is hallucination: they invent API structures that don't exist, use outdated patterns, or confidently produce code that doesn't work. The hybrid index approach let us balance precision and recall, using exact matches when available and approximate similarity when not.

Getting the retrieval parameters right took iteration. Too strict and you miss useful examples; too loose and context fills with noise.

## LLM internals and fine-tuning

I studied the ==internals of open-source LLMs (Mistral, LLaMA) and applied LoRA/PEFT fine-tuning== to adapt models for code generation without full retraining. This informed prompt design and improved generation quality on specific tasks.

Looking at attention patterns and understanding what different layers specialize in shaped how we designed prompts and what we could expect models to handle. Targeted fine-tuning turned out to be faster and more effective than we expected.

## Building the extension

I rebuilt the prompt and preset system in Brilliant's VS Code extension and built the deployment flow that lets users deploy generated APIs to AWS Lambda or Google Cloud Functions directly from the conversation.

The previous implementation had system prompts, platform modes, and runtime configs tangled together. The new architecture separated these concerns, making the system extensible.

The deployment flow handles terminal commands, directory context, and state tracking. Supporting both Lambda and GCF meant abstracting over their different CLIs. It was my first substantial TypeScript codebase and first time with Svelte. By summer's end I'd touched most core systems, which led to the full-time role.
