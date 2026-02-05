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
description: Led ML initiatives for real-time loan processing. Built A/B testing frameworks and optimized system performance at scale.
---

# Senior Machine Learning Scientist at Goldman Sachs

After two years as an individual contributor, I moved into a leadership role. The technical problems were familiar, but now I was responsible for a team and a system, not just my own work.

## Running at Scale

I inherited ownership of a real-time loan processing pipeline. Over a million requests per month, and each one was someone waiting to know if they could get a loan. The system couldn't be slow, and it couldn't go down.

I spent the first weeks understanding the system deeply. Where did requests spend their time? What failed, and why? What would happen if traffic doubled? The answers shaped everything that followed.

The architecture I built used Redis for caching, circuit breakers for fault tolerance, and careful retry logic that knew when to persist and when to fail fast. The goal wasn't just performance, it was resilience. Systems that work under normal conditions are easy. Systems that degrade gracefully under stress are hard.

## Leading a Team

Leading engineers was different from being one. My job shifted from writing code to creating conditions where good code gets written. I focused on removing friction: standardizing deployment processes, automating the tedious parts, building shared understanding of how our systems worked.

The biggest change was introducing consistent CI/CD. Before, each deployment was a custom adventure. After, deployments were boring and predictable. That predictability let the team move faster with more confidence.

## Experimentation Infrastructure

I built A/B testing frameworks that let us deploy models gradually. This sounds like a technical project, but it was really about changing how the team made decisions.

Before, shipping a new model was a leap of faith. After, it was an experiment. We could test changes on a subset of traffic, measure the results, and decide based on data. The team became more willing to try things because failure was no longer catastrophic.

This period taught me that technical leadership is mostly about systems: systems for deploying code, systems for making decisions, systems for learning from mistakes. The technology matters, but the processes around it matter more.

I left Goldman in July to pursue graduate studies, taking with me lessons about building reliable systems and effective teams.
