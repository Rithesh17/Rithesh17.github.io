---
title: Artificial Intelligence Engineering Intern
company: Accretional
location: San Francisco, CA
startDate: 2024-06-20
endDate: 2024-08-31
type: Internship
technologies: [Python, LLMs, Mistral, LLaMA, LoRA, PEFT, FAISS, AWS Lambda, Google Cloud Functions, RAG]
timelineHash: exp-accretional-ai-intern
featured: true
description: Led development of Brilliant, an AI platform that generates APIs from natural language using RAG. Implemented serverless deployment and hybrid semantic search.
---

# Artificial Intelligence Engineering Intern at Accretional

San Francisco, CA 

*June 2024 – August 2024*

I interned at Accretional during the summer, leading development on Brilliant, an AI-driven platform that automates API generation and deployment. The idea was ambitious: use large language models combined with RAG to generate working APIs from natural language descriptions, then deploy them serverlessly.

## Brilliant Platform Development

I led the development of Brilliant, which combines large language models with a Retrieval-Augmented Generation pipeline to generate APIs end-to-end. The system takes a description of what you want the API to do, retrieves relevant documentation and code examples, and generates working code that can be deployed.

The RAG component was crucial. Early versions that just used LLMs directly would hallucinate API structures or use outdated patterns. By retrieving relevant documentation and examples first, the system could generate code that actually worked with the target platforms.

The challenge was making this reliable enough for production use. Generated code needs to be correct, follow best practices, and integrate properly with deployment systems. I spent a lot of time on prompt engineering and retrieval tuning to improve the quality of generated code.

## Serverless Deployment

I designed systems supporting serverless deployment across both AWS Lambda and Google Cloud Functions. The goal was to make deployment seamless—users shouldn't need to think about infrastructure. The system handles packaging, configuration, and deployment automatically.

Supporting multiple cloud providers added complexity. Each has different requirements for packaging, environment variables, and function signatures. I built an abstraction layer that handles these differences while providing a consistent interface for the rest of the system.

## LLM Research and Optimization

I investigated the internals of open-source LLMs including Mistral and LLaMA, analyzing attention heads and feed-forward layer behaviors. This was exploratory work—understanding how these models work internally helps when you're trying to improve their performance on specific tasks.

I modified model configurations and applied LoRA and PEFT-based fine-tuning to improve generation quality and task alignment. The fine-tuning was targeted—we didn't need to retrain entire models, just adapt them for code generation tasks. This made the process faster and more cost-effective.

The analysis of attention patterns was particularly interesting. Different layers and heads seem to specialize in different aspects of code generation—some focus on syntax, others on logic, others on API patterns. Understanding this helped me design better prompts and retrieval strategies.

## Semantic Search Implementation

I implemented hybrid semantic search using FAISS, combining Flat L2 and HNSW indices to retrieve relevant documentation and code snippets. The hybrid approach gave us the best of both worlds—Flat L2 for exact matches, HNSW for approximate similarity search.

This reduced hallucinations by approximately 30%, which significantly improved output relevance and reliability. The key was finding the right balance between retrieval precision and recall. Too strict and you miss relevant examples, too loose and you get irrelevant noise that confuses the model.

The retrieval quality directly impacts code generation quality. If the system retrieves good examples, it generates good code. If it retrieves outdated or irrelevant examples, the generated code reflects that. I spent significant time tuning the retrieval parameters and improving the indexing strategy.
