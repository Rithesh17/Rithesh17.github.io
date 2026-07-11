---
title: Distributed Platform Backend
description: The storage, search, and hosting backend that runs Accretional's cloud platform, a protobuf data store with semantic search, and the pieces that put a container or a site online.
category: Infrastructure
technologies: [Go, Protocol Buffers, gRPC, SQLite, Cloudflare, Google Cloud Storage]
githubUrl: https://github.com/accretional/collector
date: 2026-01-15
status: Active
wide: true
timelineHash: proj-distributed-platform-backend
---

# Distributed Platform Backend

## The Idea

==This is the server side of the platform==: the pieces that store data, host user workloads, and connect them together.

The company's whole stack treats data and services as protobuf messages moving over gRPC, and this is where that principle becomes a real backend. It covers a protobuf data store with full-text and semantic search, the service that puts a user's container or site online under a real domain, and the shared plumbing that keeps every service in the platform observable and consistent.

## Data and Search

==I led the storage and search layer== of the platform's data store, a system for holding typed protobuf messages and finding them again.

It's built to back both plain CRUD operations and more semantic, agent-facing retrieval without maintaining two separate systems: the same store handles exact lookups and meaning-based search over the same underlying records.

## Hosting and Domains

==I was a primary author on the service that puts a user's site online==, from a raw container to a working domain.

That covers the domain registration path, the DNS automation that connects a domain to running infrastructure, and the publishing flow that gets a site's content into place with its caches invalidated on every update. It's the layer between "the code exists" and "a real person can visit the URL."

## Shared Building Blocks

==The smaller pieces tie the rest together==: a shared library of gRPC interceptors, and a service that renders live dashboards.

I contributed an interceptor library that other services in the platform reuse for consistent error handling, retries, and logging, and built a dashboard service that renders time-series metrics as SVG panels, reusing the grammar-as-protobuf rendering work described elsewhere on this page.
