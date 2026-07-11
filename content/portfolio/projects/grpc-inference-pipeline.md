---
title: gRPC Embedding & LLM Serving Pipeline
description: Production gRPC infrastructure for text embeddings (rpcembed) and vLLM-based LLM serving, forming the AI inference stack that powers semantic search and RAG for agents at Accretional.
date: 2026-02-15
status: Active
category: Inference
technologies: [Go, gRPC, vLLM, OpenVINO, Python, Docker, Modal, Protobuf]
featured: true
timelineHash: proj-grpc-inference-pipeline
---

# gRPC Embedding & LLM Serving Pipeline

## What this is

==rpcembed and vllm-service== are the two gRPC services that form Accretional's AI inference stack. One produces semantic vectors for retrieval, the other routes completions to the right LLM backend.

These aren't toy projects. They're in production, processing real agent requests, and were built to work as composable building blocks across the platform.

## Embedding service: rpcembed

rpcembed is a ==production EmbeddingService over gRPC==, backed by openvino-go, that handles text and protobuf-aware embeddings using HuggingFace-style model IDs.

The interesting capability is ProtoEmbed. You send a collection of serialized protobuf messages and a type descriptor, and the service builds a semantic string from each field's value and batch-embeds them. This is what lets Collector embed arbitrary structured data at write time rather than just raw text strings. For long inputs, the service chunks the text, refines tokenization and pooling, and applies L2 normalization before aggregating chunk embeddings so the final vector is representative of the whole document. The output feeds directly into the hybrid vector and full-text retrieval system in Collector.

## LLM serving: vllm-service

vllm-service is a ==Go gRPC manager for vLLM inference processes== that creates named model servers, routes OpenAI-compatible completion requests, and handles Docker and Modal GPU deployment.

When a request arrives for a model, the manager either routes it to an existing vLLM server or spawns one with a configurable startup timeout. The routing layer presents a gRPC interface that mirrors OpenAI's completion contract, so existing clients slot in without changes. I also wrote Dockerfiles targeting both local GPU rigs and Modal for cloud GPU deployment, so the same setup works in development and production.

## Together in production

The two services form a coherent inference layer. ==rpcembed supplies context== through vectors that Collector retrieves at query time, and ==vllm-service supplies generation== through completions that agents and the IDE call. When an agent in Brilliant needs to produce code, it queries the data layer for relevant context, then calls the LLM with that context loaded in. The entire loop runs on infrastructure I built and operate.
