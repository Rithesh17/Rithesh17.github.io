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
description: Built LSTM-based time series models for loan repayment forecasting, achieving 12% improvement in delinquency prediction. Developed COVID-19 impact analysis models.
---

# Machine Learning Scientist at Goldman Sachs

Bengaluru, India  

*August 2020 – December 2022*

I joined Goldman Sachs right out of undergrad, working on machine learning models for loan repayment forecasting and risk analysis. This was my first experience building models that had real business impact, and it taught me a lot about the gap between academic ML and production systems.

## Loan Repayment Forecasting

I built and deployed LSTM-based time series models to forecast loan repayment behavior. The challenge was capturing patterns in payment history that could predict future delinquency. I engineered features around payment gaps, transaction timing, and credit usage patterns—things like how consistent someone's payment schedule is, or whether they tend to pay early or late.

The models achieved a 12% improvement in delinquency prediction accuracy compared to the previous approach. That might not sound huge, but in a lending context, even small improvements in prediction accuracy translate to significant business value. Better predictions mean better risk management, which means the company can make more informed lending decisions.

The feature engineering was crucial here. Raw transaction data doesn't tell you much—you need to extract meaningful patterns. I spent a lot of time exploring the data, looking for signals that correlated with repayment behavior. Some were obvious (missed payments), others less so (patterns in payment timing, for example).

## Performance Optimization

I used internal benchmarking and profiling tools based on NumPy to identify inference bottlenecks. The models needed to make predictions quickly—loan applications can't wait around for slow inference. I worked with the infrastructure team to optimize the deployment pipeline, focusing on reducing latency without sacrificing accuracy.

This was my first real exposure to production ML systems. In research, you care about accuracy. In production, you care about accuracy, latency, cost, and reliability. Learning to balance all of those was a valuable experience.

## COVID-19 Impact Analysis

I developed simulation models to analyze how COVID-19 affected lending risk. This was interesting because we were working with both real and synthetic datasets—the pandemic created a situation where historical data wasn't necessarily predictive of future behavior. The models needed to account for economic disruption, policy changes, and shifts in consumer behavior.

The insights from these models informed policy changes that contributed to a 10% increase in new customer signups. The key was understanding not just what the models predicted, but why, and how those predictions could inform business decisions. It wasn't enough to build accurate models—they needed to provide actionable insights.

This project also taught me about the importance of communicating model results to non-technical stakeholders. The models were complex, but the insights needed to be clear and actionable. Learning to translate technical results into business recommendations was a skill I developed here.
