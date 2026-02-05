---
title: CT Denoising and Explainability using OT-CycleGAN
description: Adapted OT-CycleGAN for denoising ultra-low-dose CT scans with explainability features using Grad-CAM and attention visualizations
date: 2025-06-01
status: completed
category: Research
technologies: [Python, PyTorch, OT-CycleGAN, Grad-CAM, Computer Vision, Medical Imaging]
thumbnail: /projects/ct-denoising.jpg
timelineHash: proj-ct-denoising
---

# CT Denoising and Explainability using OT-CycleGAN

## The Challenge

This research project came out of a practical problem in medical imaging: ultra-low-dose CT scans reduce radiation exposure for patients, but the resulting images are noisy and harder to interpret. I wanted to see if we could improve image quality while keeping the model's decisions interpretable for clinicians.

## The Solution

I adapted OT-CycleGAN (Optimal Transport CycleGAN) for this task, training it on the IEEE COVID-19 dataset. The optimal transport component helps stabilize training compared to standard CycleGAN, which was important when working with medical data where we need consistent, reliable results.

## Explainability Features

The denoising itself is only half the story though. In medical applications, clinicians need to understand why the model made certain decisions. I integrated Grad-CAM visualizations and attention-based mechanisms to show which parts of the image the model focuses on when making predictions. This helps build trust—clinicians can see that the model is looking at the right anatomical structures rather than just noise or artifacts.

## Evaluation

Evaluating the results required both quantitative metrics (PSNR and SSIM) and qualitative assessment. The quantitative metrics show improvement, but the qualitative evaluation is what matters for clinical use. I worked with radiologists to review the denoised images and ensure we weren't introducing artifacts or losing important diagnostic information.

## Impact

The explainability features turned out to be as important as the denoising quality. When clinicians can see attention maps and understand what the model is focusing on, they're more willing to use it in practice. It's not enough to just improve image quality—the system needs to be interpretable enough that medical professionals can trust it.

## Current Work

This is still an active project. I'm continuing to refine both the denoising quality and the explainability features, working on making the attention visualizations more intuitive and ensuring the model maintains diagnostic accuracy while improving image quality.
