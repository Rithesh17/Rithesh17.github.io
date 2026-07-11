---
title: Statue Static Site Generator
description: Accretional's open source static site generator, built on SvelteKit and Markdown. This portfolio is built with it.
category: Open Source
technologies: [Svelte, SvelteKit, TypeScript, Markdown, Tailwind CSS]
githubUrl: https://github.com/accretional/statue
date: 2026-02-10
status: Active
timelineHash: proj-statue-ssg
---

# Statue Static Site Generator

## The Idea

==Statue turns a folder of Markdown into a full site==, with theming, navigation, and search handled for you.

It's built on SvelteKit and Tailwind, ships as an npm package, and is meant for a one-line setup: point it at a content folder and get a themed, searchable site out the other side. It's open source, and it's what generated the page you're reading right now.

## What I Worked On

==My contribution was on the component and navigation side==, plus a companion tool for developing components in isolation.

I added navigation and theming improvements to the main generator, along with better handling of how components are displayed. Alongside that I built a separate lab for previewing and testing individual components against different themes and fixtures, without needing to stand up a full site just to see whether a component looks right.
