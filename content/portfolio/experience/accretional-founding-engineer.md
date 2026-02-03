---
title: Founding Engineer
company: Accretional
location: San Francisco, CA
startDate: 2025-08-11
endDate: present
type: Full-time
technologies: [TypeScript, SvelteKit, Go, SQLite, Cloudflare, Docker, AWS, Git]
timelineHash: exp-accretional-founding-engineer
featured: true
description: Building Splendor, an AI-native developer platform. Owned publishing infrastructure, deployment pipelines, authorization controls, and semantic retrieval systems.
---

# Founding Engineer at Accretional

San Francisco, CA 

*August 2025 – Present*

Accretional is building Splendor, an AI-native developer platform that combines a cloud IDE, AI workflows, and one-click publishing to production domains. As a founding engineer, I've had the opportunity to own entire systems from design to deployment.

## Publishing and Domain Infrastructure

I end-to-end owned the publishing and domain infrastructure for Splendor. This involved integrating directly with domain registrar APIs to provision domains, automating Cloudflare DNS configuration, and deploying projects to live production endpoints. The challenge was making this seamless for users—they should be able to publish and have their project live on a custom domain without thinking about the underlying complexity.

The integration required working with multiple APIs and handling edge cases around domain availability, DNS propagation, and SSL certificate provisioning. I built retry mechanisms and monitoring to ensure reliability, since a failed deployment shouldn't leave users in a broken state.

## Project-to-Domain Deployment Pipeline

I designed and implemented the project-to-domain deployment pipeline that operates primarily from git repositories. The system supports static site hosting with container-based services as a first-class extension. This meant building a flexible architecture that could handle different project types while maintaining a consistent deployment experience.

The pipeline needed to be fast, reliable, and handle failures gracefully. I implemented container-based builds that could run in parallel, with proper caching to speed up subsequent deployments. The system also needed to handle rollbacks and version management, so users could revert if something went wrong.

## Authorization Controls

I built platform-wide authorization controls that enforce domain ownership and publishing permissions. This was critical for a multi-tenant system where users need to be able to deploy to their own domains but not interfere with others. The controls ensure only verified users can deploy, modify, or reassign domains across the platform.

## Semantic Retrieval

I extended the core Collector control plane with semantic retrieval capabilities. This involved integrating SQLite-based vector search, designing a custom indexing schema, and selecting a cgo-backed SQLite stack after benchmarking against pure Go alternatives. The semantic search powers AI-assisted development features in the cloud IDE, allowing the system to find relevant code context quickly.

The decision to use SQLite with cgo was a trade-off. Pure Go alternatives were simpler to deploy but didn't match the performance we needed. The cgo approach required more careful build configuration but gave us the speed necessary for real-time code search.

## AI Execution Workflows

I developed dynamic AI execution workflows in Brilliant that integrate multiple LLM provider APIs into backend execution paths. These workflows power AI-assisted development inside the cloud IDE, allowing users to leverage AI for code generation, refactoring, and problem-solving without leaving their development environment.

The challenge here was building a system flexible enough to support different LLM providers while maintaining consistent behavior. I designed an abstraction layer that handles provider-specific differences, retries, rate limiting, and error handling.

## UI Development

I contributed TypeScript and Svelte UI updates across Brilliant and Statue, supporting publishing flows, workflow execution, and end-to-end user interactions. The UI work required close collaboration with the design team to ensure the technical implementation matched the intended user experience while maintaining performance and accessibility.
