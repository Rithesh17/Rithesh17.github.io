---
title: Machine Learning Scientist
company: Goldman Sachs
location: Bengaluru, India
startDate: 2020-07-27
endDate: 2022-12-31
type: Full-time
technologies: [Python, PyTorch, LSTM, Model Quantization, Inference Optimization, NumPy, Time Series, CI/CD, A/B Testing]
timelineHash: exp-goldman-sachs-ml-scientist
featured: true
description: Optimized ML inference pipelines from 200ms to 80ms through quantization and caching. Built LSTM forecasting models and production systems handling 1M+ requests/month at 99.9% uptime.
---

# Machine Learning Scientist at Goldman Sachs

I joined Goldman Sachs right out of undergrad, during a pandemic, into a team building models that helped decide who gets loans. Three years of production ML gave me a foundation in what it actually takes to deploy models reliably at scale.

## Inference optimization and production ML

My first real lesson was the ==gap between training accuracy and production performance==. Models needed to make decisions fast enough not to slow loan applications, reliable enough to run continuously, and accurate enough that the business could trust them.

I profiled inference pipelines, identified bottlenecks, and reduced prediction latency from 200ms to 80ms through model quantization and output caching. I also implemented circuit breakers that kept the pipeline running at 99.9% uptime while handling over a million requests a month. I introduced CI/CD processes across the ML team and built an A/B testing framework that reduced deployment time by 70% and made model rollouts data-driven rather than risky. This was my first experience seeing how much production ML work happens after training ends, and it changed how I think about building models.

## Forecasting loan repayment

My main modelling project was ==building LSTM models to predict loan repayment behavior== from sequential payment history.

Raw transaction data is just numbers and timestamps. The real signal is in the patterns: how consistent is payment timing, what happens after a missed payment, how does behavior shift over time. I spent months in the data building intuition about what behaviors actually predicted outcomes. Some features were obvious; others only appeared after staring at edge cases and asking why. The best features came from understanding the problem deeply, not from algorithmic tricks, and the resulting models achieved a 15% improvement in prediction accuracy over the baseline.

## Research under uncertainty

Then COVID hit. ==Historical patterns stopped being reliable== overnight. People who had never missed payments started missing them. People who always struggled suddenly had stimulus money.

I built simulation models to understand how the pandemic was reshaping lending risk. We couldn't just fit to historical data because history wasn't predictive anymore. The goal was to give the business something to reason with during genuine uncertainty, not to produce a model that looked good on a metric. This project taught me to think about ML as a tool for understanding, not just prediction, and it was the first time I had to translate deeply uncertain model outputs into decisions that real people would act on.
