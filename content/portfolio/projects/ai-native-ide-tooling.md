---
title: Prompt and Workflow Tooling for an AI-Native IDE
description: The file-backed prompt and workflow system, and the deployment and auth integration, inside a container-based remote IDE built for working with coding agents.
category: AI
technologies: [TypeScript, VS Code Extension API, Go, gRPC]
date: 2025-09-01
status: Active
timelineHash: proj-ai-native-ide-tooling
---

# Prompt and Workflow Tooling for an AI-Native IDE

## The Idea

==Prompts, presets, and workflows live as files==, not database rows, so they move with the project and work with ordinary version control.

This is the client side of a container-based remote IDE built for developing with AI agents. Prompts and reusable configurations are stored as plain files in the workspace and kept in sync with the UI through file watchers, so editing a prompt in the editor or in the interface produces the same result either way.

## Making Sensitive Actions Safe

==Some actions needed a real verification step==, not just a button click.

I moved sensitive operations behind a backend service with a proper verification flow, so actions that touch real infrastructure or credentials go through an explicit check rather than firing directly from the client.

## Connecting to the Hosting Backend

==The extension needed to talk to the platform's hosting and source-control backend== without leaking internal details across that boundary.

I wired the identity and access pieces needed for the IDE to create repositories, clone them, and know which user and container it's acting on behalf of, passing that context safely between services.
