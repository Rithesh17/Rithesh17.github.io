---
title: Machine Learning Research Intern
company: Sprinklr
location: Gurgaon, India
startDate: 2019-05-14
endDate: 2019-07-11
type: Internship
technologies: [Python, LSTM, Sentiment Analysis, Model Pruning, Quantization, NLP]
timelineHash: exp-sprinklr-ml-intern
featured: false
description: Built LSTM-based sentiment analysis pipelines for social media data. Applied model pruning and quantization to reduce model size by 60% while maintaining performance.
---

# Machine Learning Research Intern at Sprinklr

Gurgaon, India  

*May 2019 – July 2019*

This was my first industry internship, working on sentiment analysis for social media data. Sprinklr processes massive amounts of social media content, and understanding customer sentiment at scale was a core business need.

## Social Media Sentiment Analysis

I analyzed large-scale social media data from platforms including Twitter, Instagram, and Facebook to extract customer sentiment and product feedback. The volume was the main challenge—we were processing millions of posts, and the models needed to be fast enough to keep up.

I built sentiment analysis pipelines using LSTM-based architectures. The models scored product feedback and surfaced frequently occurring opinion keywords, which helped the product team understand what customers were saying about their brands.

Working with social media data is messy. People use slang, emojis, sarcasm, and context-dependent language. The models needed to handle all of that while still providing useful sentiment scores. I spent a lot of time on data preprocessing and feature engineering to extract meaningful signals from noisy text.

The keyword extraction was particularly useful. Instead of just getting a positive/negative score, the system could identify specific topics people were talking about. This gave product teams actionable insights—not just that sentiment was positive or negative, but what specifically people were commenting on.

## Model Optimization

I improved model accuracy through embedding optimization and hyperparameter tuning, then applied model pruning and quantization to reduce model size by 60% while maintaining performance. This enabled deployment in resource-constrained environments.

The optimization work was necessary because the models needed to run at scale. A model that's accurate but too slow or too large isn't useful in production. I learned to balance accuracy with efficiency, making trade-offs that made sense for the use case.

The pruning and quantization work was my first exposure to model compression techniques. It's interesting how much you can reduce model size without losing much accuracy, especially when you're targeting specific deployment constraints. The 60% reduction was significant—it meant the models could run on cheaper hardware or process more data with the same resources.

This internship taught me a lot about the practical side of ML. In school, you focus on getting the best accuracy. In industry, you need to balance accuracy, speed, cost, and maintainability. Learning to make those trade-offs was valuable experience.
