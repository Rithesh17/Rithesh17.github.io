---
title: "Semantifly: Local RAG for Coding Agents"
description: A command-line tool that gives AI coding agents local retrieval-augmented generation over your own code and data.
category: Open Source
technologies: [Go, Protocol Buffers, PostgreSQL, Embeddings, RAG]
githubUrl: https://github.com/accretional/semantifly
date: 2024-08-15
status: Completed
timelineHash: proj-semantifly
---

# Semantifly: Local RAG for Coding Agents

## The Idea

==Instead of a developer manually pasting context into a prompt, the agent asks for it==, and Semantifly is what answers that ask.

It's a CLI you point at your data sources, code repositories, cloud projects, databases, that pulls in the underlying content, embeds it, and stores it in a local vector database. From there, an agent can query, describe, or export exactly the context it needs instead of a human curating it by hand.

## What I Built

==I built out the subcommand layer and its storage backend== from an early, work-in-progress state.

That included the core add and delete operations with real test coverage, moving the internal caching over to protobuf for serialization, and the test infrastructure that runs the CLI end to end rather than just unit-testing individual functions.

## Why It Mattered

==This was early groundwork== for a pattern that shows up throughout the company's later work: giving agents their own retrieval layer instead of relying on a human to supply context.

The specific tool has since been superseded by newer infrastructure, but the underlying idea, that agents need their own way to find relevant context, carried straight through into the embedding and search services described elsewhere on this page.
