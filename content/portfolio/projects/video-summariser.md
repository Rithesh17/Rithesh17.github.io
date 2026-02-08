---
title: Academic Lecture Video Summariser
description: LLM and RAG-based system for summarizing long-form academic videos
date: 2024-06-01
status: completed
category: AI
technologies: [Python, LLMs, RAG, Video Processing, NLP, Summarization]
thumbnail: /projects/video-summariser.jpg
githubUrl: https://github.com/Rithesh17/Video-Summariser
timelineHash: proj-video-summariser
---

# Academic Lecture Video Summariser

## The Motivation

I built this system after spending too many hours trying to find specific concepts in hour-long lecture recordings. The problem was straightforward: academic videos are dense with information, but reviewing them is time-consuming. I wanted something that could extract the key points and structure them into readable summaries.

## How It Works

The approach combines video processing, transcription, and retrieval-augmented generation. First, the system extracts audio and generates transcripts from the video content. Then it uses RAG to pull relevant context from different parts of the lecture before feeding everything to a language model for summarization. This two-step process helps maintain accuracy—the model isn't just generating from memory, it's actively retrieving and referencing the source material.

## Key Insights

What I found interesting was how the retrieval step improved summary quality. Early versions that went straight to summarization would sometimes miss important details or misrepresent concepts. By adding the retrieval layer, the system can pull in relevant context from across the entire video, even when concepts are introduced early and referenced later.

## Results

The system successfully handles various video formats and lengths. The summaries preserve academic terminology and maintain the logical flow of the original content, making them useful for review rather than just being condensed versions. The retrieval step significantly improved summary quality by pulling context from across the entire video.
