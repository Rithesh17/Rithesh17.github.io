---
title: Local AI Toolkit for Apple Silicon
description: A command-line tool that brings Apple's on-device vision, audio, speech, and language models together into one composable toolkit.
category: AI
technologies: [Objective-C, Apple Vision, AVFoundation, Speech, Core Image, Swift]
githubUrl: https://github.com/accretional/macos-vision
date: 2026-04-10
status: Active
featured: true
timelineHash: proj-macos-vision
---

# Local AI Toolkit for Apple Silicon

## The Idea

==A single CLI wraps every local AI framework Apple ships==, callable the same consistent way.

Apple's on-device frameworks, Vision, AVFoundation, Speech, Sound Analysis, Natural Language, Core Image, each solve one problem well, but using more than one together usually means writing separate glue code for each. This tool exposes them as one consistent set of subcommands: recognize text and objects, detect faces and pose, transcribe speech and classify sound, tag and embed natural language, filter images, capture from the screen or camera, and more.

## Built to Compose

==The design goal was Unix-style composition==, not a single monolithic app.

Every subcommand reads from stdin and writes to stdout in a predictable format, so they chain the way small Unix tools do: capture video, pipe it through a detector, pipe that into a renderer, and watch the result play back live. That composability is what makes it a toolkit instead of a demo of any one Apple API, and it's the piece that took the most iteration to get right.

## Why Local Matters

==Running inference on-device== keeps latency low and data private, with no server in the loop.

For a lot of everyday AI tasks, reading text off a screen, recognizing who's in a photo, transcribing a voice memo, there's no real need to round-trip to the cloud. Apple Silicon is fast enough to do it locally, and this tool makes that capability available from the command line instead of locked inside individual apps.
