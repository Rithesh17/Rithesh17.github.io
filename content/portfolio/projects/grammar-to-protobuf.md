---
title: Formal Grammars as Protocol Buffers
description: Supporting a new format normally means hand-writing a parser and renderer and keeping them in sync forever. This compiler generates the whole type system from the grammar itself, so parsing and rendering fall out for free across 10+ formats, up to the ARM64 instruction set.
category: Open Source
technologies: [Go, Protocol Buffers, gRPC, EBNF, Compilers, Headless Chrome]
githubUrl: https://github.com/accretional/proto-css
date: 2026-06-15
status: Active
featured: true
timelineHash: proj-grammar-to-protobuf
---

# Formal Grammars as Protocol Buffers

## The Idea

==A format described once as a grammar becomes a working type system==, with parsing and rendering falling out for free instead of being written by hand.

The usual way to support a new file format or language is to write a parser for it, then a renderer, then keep both in sync as the format evolves. I wanted a different approach: describe the format once as a formal grammar, compile that grammar into a protobuf schema, and let parsing and rendering be pure reflection over the generated types. No per-format parsing code, no drift between the grammar and the implementation, because they're the same artifact.

## Proving It Works

==I built the family of formats that sits on top of this engine==, and the range is the point.

Stylesheets, markup, wire protocols, config languages, container build files, and even a machine instruction set all went through the same pipeline: a grammar goes in, a working parse-and-render service comes out. Each one is its own project, but they all share one compiler and one mental model, which is the real test of whether the pattern generalizes or was a lucky fit for the first format I tried it on.

For the visual formats, I also built galleries that walk the grammar to generate every value it allows, render it in a real headless browser, and screenshot the result, so correctness isn't just asserted by a test, you can see the output rendering correctly. For the instruction-set work, verification went as far as decoding real instructions on actual Apple Silicon hardware and checking the result matches.

## Why It Matters

==Every format in this set becomes something a program can hold, transform, and move over gRPC== the same way it handles any other typed value.

Once a stylesheet or a machine instruction is a proto message, the same tooling can store it, diff it, validate it against its own grammar, and connect it to anything else in the stack. That's the actual payoff: not that any single format got a parser, but that a dozen very different formats now speak the same language as everything else the platform touches.
