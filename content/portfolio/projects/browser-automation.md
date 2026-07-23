---
title: Browser Automation over gRPC
description: Selector-based automation shatters the moment a page changes. This exposes the Chrome DevTools Protocol as a gRPC service and adds a vision-guided agent that acts on what a page actually looks like, so automation survives pages never built to be scripted.
category: Automation
technologies: [Go, gRPC, Chrome DevTools Protocol, Vision Models]
githubUrl: https://github.com/accretional/chromerpc
date: 2026-05-05
status: Active
featured: true
timelineHash: proj-browser-automation
---

# Browser Automation over gRPC

## The Idea

==A real browser becomes a service any other part of the stack can call==, not just a tool you drive by hand.

The Chrome DevTools Protocol is powerful but low-level and awkward to call from other services. This project wraps it as gRPC, so taking a screenshot, printing a PDF, or running a sequence of clicks and keystrokes is just another RPC call, composable with the rest of the infrastructure the same way any other service is.

## From Scripted to Agent-Driven

==On top of that sits a vision-guided agent== that plans its next move from what's actually on screen.

Instead of relying on CSS selectors that break the moment a page changes, the agent looks at a screenshot, decides what to click or type based on the current page state, and acts. That makes automation resilient to pages that were never designed to be scripted against, which describes most of the web.

## Where It's Used

==This same layer powers the visual verification== behind the grammar-to-protobuf work.

Every one of those format galleries gets checked by actually rendering it in a real browser and capturing what it looks like, and that verification pipeline runs on top of this browser automation service.
