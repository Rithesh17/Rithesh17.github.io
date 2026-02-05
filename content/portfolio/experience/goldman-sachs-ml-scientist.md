---
title: Machine Learning Scientist
company: Goldman Sachs
location: Bengaluru, India
startDate: 2020-07-27
endDate: 2022-12-31
type: Full-time
technologies: [Python, LSTM, NumPy, Time Series, Feature Engineering, Simulation Models]
timelineHash: exp-goldman-sachs-ml-scientist
featured: true
description: Built LSTM-based time series models for loan repayment forecasting. Developed COVID-19 impact analysis models for lending risk assessment.
---

# Machine Learning Scientist at Goldman Sachs

I joined Goldman Sachs right out of undergrad, during a pandemic, into a team building models that helped decide who gets loans. It was a crash course in what happens when ML models have real consequences.

## Predicting Repayment Behavior

My first project was forecasting loan repayments. The goal was simple: given someone's history, predict whether they'll pay on time. The execution was anything but.

I built LSTM models that learned patterns in payment sequences. But the model architecture mattered less than the features. Raw transaction data is just numbers and timestamps. The signal is in the patterns: how consistent is someone's payment timing? Do they pay early when they have money, or always at the last minute? What happens after they miss a payment?

I spent months exploring the data, building intuition about what behaviors actually predicted outcomes. Some features were obvious. Others emerged from staring at edge cases and asking why. The best features came from understanding the problem deeply, not from algorithmic tricks.

## The Production Gap

This was my first experience with production ML at scale. In school, you train a model and report accuracy. Here, models needed to make decisions fast enough to not slow down loan applications, reliable enough to run continuously, and accurate enough that the business could trust them.

I learned to profile inference pipelines, identify bottlenecks, and optimize for latency. I learned that a model isn't done when training finishes. Deployment, monitoring, and maintenance are where most of the work happens.

## When History Stops Predicting

Then COVID hit. Historical patterns stopped being reliable. People who'd never missed payments started missing them. People who always struggled suddenly had stimulus money.

I built simulation models to understand how the pandemic changed lending risk. The challenge was modeling something unprecedented: we couldn't just fit to historical data because history wasn't predictive anymore.

This project taught me to think about models as tools for understanding, not just prediction. The simulations helped the business make decisions during uncertainty. I learned to communicate model insights to non-technical stakeholders, translating technical results into actionable recommendations.

Two and a half years at Goldman gave me a foundation in production ML that I still draw on. I learned that real ML work is mostly about understanding problems, not just applying algorithms.
