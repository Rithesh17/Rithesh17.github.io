---
title: REST APIs as Typed gRPC Services
description: A converter that turns any OpenAPI v3 specification into a typed gRPC service, proven out on two large real-world APIs.
category: Open Source
technologies: [Go, Protocol Buffers, gRPC, OpenAPI, Code Generation]
githubUrl: https://github.com/accretional/openapi2proto
date: 2026-05-20
status: Active
featured: true
wide: true
timelineHash: proj-rest-to-grpc
---

# REST APIs as Typed gRPC Services

## The Idea

==Any REST API described by an OpenAPI spec can become a typed gRPC service==, generated rather than hand-written.

A lot of what we want to connect to already exists as a REST API with an OpenAPI spec. Rather than write a one-off client every time, this tool reads the spec and generates protobuf definitions and gRPC services from it, with each generated RPC implemented as a call to the underlying REST endpoint. Once that's done, the external API can be reflected, composed, and called with the exact same tooling as everything else in the stack.

## Making It Survive Real Specs

==Handling real-world specs is the hard part==, not the happy path.

The gap between a converter that works on a clean textbook example and one that survives a spec nobody hand-curated is where most of the effort went: schemas that combine types in unusual ways, freeform objects, response codes outside the common cases, parameter naming that doesn't match convention. I also added support for a newer OpenAPI version the underlying parser didn't handle natively. None of it is glamorous, but it's what separates a demo from a tool you can point at an API you don't control and trust the output.

## Putting It to Work

==I used the converter to wrap two large, real-world APIs==, one from a major AI provider and one from a major infrastructure provider.

Both come out the other side as full typed gRPC services covering the entire surface of the underlying REST API, each with its own test suite that exercises the live endpoints. Both regenerate straight from the upstream spec through the same converter, so an improvement made once benefits every generated service built with it, not just the one it was written for.
