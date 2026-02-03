---
title: Senior Machine Learning Scientist
company: Goldman Sachs
location: Bengaluru, India
startDate: 2023-01-01
endDate: 2023-07-13
type: Full-time
technologies: [Python, Provenir, Redis, Machine Learning, A/B Testing, CI/CD, Monitoring]
timelineHash: exp-goldman-sachs-senior-ml
featured: true
description: Led ML initiatives for real-time loan processing, handling 1.2M+ requests/month. Built A/B testing frameworks and optimized systems to reduce latency by 15%.
---

# Senior Machine Learning Scientist at Goldman Sachs

Bengaluru, India  

*January 2023 – July 2023*

At Goldman Sachs, I led machine learning initiatives focused on real-time loan processing systems. The role combined technical leadership with hands-on development, working on systems that needed to be both fast and reliable under high load.

## Real-Time Loan Processing Pipeline

I designed and implemented a real-time loan application processing pipeline using Provenir that handled over 1.2 million requests per month with zero downtime. The system integrated Redis caching, retry mechanisms, and round-robin load balancing to ensure fault tolerance and low latency.

The scale was the main challenge here. With that volume of requests, even small inefficiencies compound quickly. I spent significant time profiling and optimizing the pipeline, identifying bottlenecks in data access patterns and model inference. The Redis caching layer was crucial—it reduced database load and cut response times for common queries.

The retry mechanisms needed to be smart about when to retry and when to fail fast. Not every error is worth retrying, and some failures indicate problems that need immediate attention rather than automatic retries. I built in circuit breakers and exponential backoff to handle transient failures without overwhelming the system.

## Team Leadership

I led a team of machine learning engineers across the full model lifecycle, from feature engineering through training, CI/CD, deployment, and monitoring. The goal was to improve both team productivity and model deployment velocity.

One of the biggest improvements came from standardizing our deployment process. Before, each model deployment was a custom process with its own quirks. I introduced a consistent CI/CD pipeline that automated testing, validation, and deployment, which cut down on errors and made the team more confident about shipping changes.

## Performance Optimization

I optimized backend services and model serving layers, reducing average latency by 15%. This involved profiling the entire request path, identifying bottlenecks, and making targeted improvements. Some were straightforward—better caching, more efficient data structures. Others required rethinking how we structured the computation to reduce unnecessary work.

The monitoring infrastructure was key here. Without good observability, it's hard to know where the time is actually being spent. I set up detailed metrics and tracing so we could see exactly where requests were spending time and prioritize optimizations accordingly.

## A/B Testing Framework

I introduced A/B testing frameworks and feature flags that enabled gradual rollout of models. This improved stakeholder confidence and enabled data-driven decision making for model deployments.

Before this, model deployments were all-or-nothing. If a new model had issues, it affected all users immediately. The A/B testing framework let us roll out changes gradually, monitor performance, and roll back if needed. This made the team more willing to experiment and iterate, which ultimately led to better models.

The framework also provided concrete data about model performance. Instead of guessing whether a new model was better, we could measure it directly with real traffic. This changed how we made decisions about which models to deploy and when.
