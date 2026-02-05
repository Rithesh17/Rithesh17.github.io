<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: experience = data?.experience || [];
  $: siteConfig = data?.siteConfig;
  $: companies = [...new Set(experience.map((e: any) => e.company).filter(Boolean))] as string[];
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Experience', url: '/portfolio/experience' }
  ];

  let cardElements: HTMLElement[] = [];
  let svgPaths: string[] = [];
  let containerRef: HTMLElement;

  // Format date to show just month and year (e.g., "Jan 2024")
  function formatDate(dateValue: string | Date | null | undefined): string {
    if (!dateValue) return 'Present';
    try {
      // Handle if it's already a Date object
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      if (isNaN(date.getTime())) return String(dateValue);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return String(dateValue);
    }
  }

  function calculatePaths() {
    if (!browser || cardElements.length < 2 || !containerRef) return;
    
    const containerRect = containerRef.getBoundingClientRect();
    const paths: string[] = [];
    
    for (let i = 0; i < cardElements.length - 1; i++) {
      const current = cardElements[i];
      const next = cardElements[i + 1];
      
      if (!current || !next) continue;
      
      const currentRect = current.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      
      // Calculate positions relative to container
      const startX = currentRect.left - containerRect.left + currentRect.width / 2;
      const startY = currentRect.bottom - containerRect.top;
      const endX = nextRect.left - containerRect.left + nextRect.width / 2;
      const endY = nextRect.top - containerRect.top;
      
      // Create curved path with control points
      const midY = (startY + endY) / 2;
      const controlOffset = Math.min(80, (endY - startY) * 0.4);
      
      // Bezier curve path
      const path = `M ${startX} ${startY} 
                    C ${startX} ${startY + controlOffset}, 
                      ${endX} ${endY - controlOffset}, 
                      ${endX} ${endY}`;
      
      paths.push(path);
    }
    
    svgPaths = paths;
  }

  onMount(() => {
    if (browser) {
      // Wait for cards to render
      setTimeout(calculatePaths, 100);
      window.addEventListener('resize', calculatePaths);
      
      return () => {
        window.removeEventListener('resize', calculatePaths);
      };
    }
  });

  function bindCard(el: HTMLElement, index: number) {
    cardElements[index] = el;
    setTimeout(calculatePaths, 50);
  }
</script>

<SEO
	siteConfig={siteConfig}
	title="Experience"
	description={`Professional work experience at ${companies.slice(0, 3).join(', ')}${companies.length > 3 ? ' and more' : ''}. ${experience.length} positions showcasing career journey and achievements.`}
	keywords={['experience', 'career', 'work history', 'professional', ...companies.slice(0, 5)]}
	type="website"
	canonical={$page.url.pathname}
/>

<StructuredData siteConfig={siteConfig} type="BreadcrumbList" {breadcrumbs} />

<div class="experience-page">
  <Particles className="absolute inset-0" refresh={true} />
  
  <div class="back-nav">
    <a href="/portfolio" class="back-btn">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
      Back to Portfolio
    </a>
  </div>
  
  <section class="hero-section">
    <div class="section-header">
      <h1 class="section-title">Experience</h1>
      <p class="section-subtitle">Professional work experience and career journey</p>
    </div>
  </section>
  
  {#if experience.length > 0}
    <section class="experience-section">
      <div class="container" bind:this={containerRef}>
        <!-- SVG Connecting Paths -->
        <svg class="connecting-paths" aria-hidden="true">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(165, 180, 252, 0.6)" />
              <stop offset="50%" stop-color="rgba(139, 92, 246, 0.4)" />
              <stop offset="100%" stop-color="rgba(99, 102, 241, 0.6)" />
            </linearGradient>
            <filter id="pathGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {#each svgPaths as path, i}
            <path 
              d={path} 
              class="connecting-path"
              style="--path-delay: {i * 0.2}s"
            />
          {/each}
        </svg>

        <!-- Experience Cards -->
        <div class="cards-container">
          {#each experience as exp, index}
            {@const expAny = exp as any}
            <a 
              href="/portfolio/experience/{expAny.markdownPath?.split('/').pop() || expAny.id}"
              class="experience-card"
              class:current={expAny.current || !expAny.endDate}
              use:bindCard={index}
            >
              <div class="card-node">
                <div class="node-ring"></div>
                <div class="node-dot"></div>
              </div>
              
              <div class="card-content">
                <div class="card-header">
                  <div class="card-meta">
                    <span class="card-dates">{formatDate(expAny.startDate)} — {formatDate(expAny.endDate)}</span>
                    {#if expAny.current || !expAny.endDate}
                      <span class="card-current">Current</span>
                    {/if}
                  </div>
                  <span class="card-location">{expAny.location || ''}</span>
                </div>
                
                <h3 class="card-title">{expAny.title}</h3>
                <p class="card-company">{expAny.company}</p>
                
                {#if expAny.description}
                  <p class="card-description">{expAny.description}</p>
                {/if}
                
                {#if expAny.technologies?.length > 0}
                  <div class="card-tech">
                    {#each expAny.technologies.slice(0, 5) as tech}
                      <span class="tech-tag">{tech}</span>
                    {/each}
                    {#if expAny.technologies.length > 5}
                      <span class="tech-more">+{expAny.technologies.length - 5}</span>
                    {/if}
                  </div>
                {/if}
              </div>
              
              <div class="card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </a>
          {/each}
        </div>
      </div>
    </section>
  {:else}
    <section class="empty-section">
      <div class="container">
        <p class="empty-message">No experience entries yet. Check back soon!</p>
      </div>
    </section>
  {/if}
</div>

<style>
  .experience-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  :global(.experience-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  section {
    position: relative;
    z-index: 1;
  }

  .hero-section {
    padding: 4rem 1rem 2rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 0.5rem 0;
  }

  .section-subtitle {
    font-size: 1.1rem;
    color: rgba(148, 163, 184, 0.8);
    margin: 0;
  }

  .experience-section {
    padding: 2rem 1rem 4rem;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
  }

  /* SVG Connecting Paths */
  .connecting-paths {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: visible;
  }

  .connecting-path {
    fill: none;
    stroke: url(#pathGradient);
    stroke-width: 2;
    stroke-linecap: round;
    filter: url(#pathGlow);
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawPath 1.5s ease-out forwards;
    animation-delay: var(--path-delay, 0s);
  }

  @keyframes drawPath {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* Cards Container */
  .cards-container {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    position: relative;
    z-index: 1;
  }

  /* Experience Card */
  .experience-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1.5rem;
    align-items: center;
    padding: 1.75rem;
    background: rgba(20, 25, 40, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    text-decoration: none;
    color: inherit;
    transition: all 0.4s ease;
    backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
  }

  .experience-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 0% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .experience-card:hover {
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateX(8px);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
  }

  .experience-card:hover::before {
    opacity: 1;
  }

  .experience-card.current {
    border-color: rgba(34, 197, 94, 0.3);
  }

  .experience-card.current::before {
    background: radial-gradient(circle at 0% 50%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
  }

  /* Node/Connector */
  .card-node {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .node-ring {
    position: absolute;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(165, 180, 252, 0.3);
    border-radius: 50%;
    animation: pulse-ring 3s ease-out infinite;
  }

  .current .node-ring {
    border-color: rgba(34, 197, 94, 0.4);
  }

  @keyframes pulse-ring {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.5;
    }
  }

  .node-dot {
    width: 14px;
    height: 14px;
    background: linear-gradient(135deg, rgba(165, 180, 252, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.5);
  }

  .current .node-dot {
    background: linear-gradient(135deg, rgba(74, 222, 128, 0.9) 0%, rgba(34, 197, 94, 0.9) 100%);
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.5);
  }

  /* Card Content */
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .card-dates {
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(148, 163, 184, 0.8);
    letter-spacing: 0.02em;
  }

  .card-current {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #4ade80;
    background: rgba(34, 197, 94, 0.15);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .card-location {
    font-size: 0.8rem;
    color: rgba(148, 163, 184, 0.6);
  }

  .card-title {
    font-size: 1.35rem;
    font-weight: 600;
    color: rgba(241, 245, 249, 0.95);
    margin: 0;
    line-height: 1.3;
  }

  .card-company {
    font-size: 1rem;
    font-weight: 500;
    color: rgba(165, 180, 252, 0.9);
    margin: 0;
  }

  .card-description {
    font-size: 0.9rem;
    color: rgba(148, 163, 184, 0.8);
    line-height: 1.6;
    margin: 0.25rem 0 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .tech-tag {
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(148, 163, 184, 0.7);
    background: rgba(255, 255, 255, 0.05);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .tech-more {
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(165, 180, 252, 0.7);
  }

  /* Arrow */
  .card-arrow {
    color: rgba(148, 163, 184, 0.4);
    transition: all 0.3s ease;
  }

  .experience-card:hover .card-arrow {
    color: rgba(165, 180, 252, 0.9);
    transform: translateX(4px);
  }

  /* Empty & Back */
  .empty-section {
    padding: 4rem 1rem;
  }

  .empty-message {
    text-align: center;
    color: var(--color-muted, #8b949e);
    font-size: 1.125rem;
  }

  .back-nav {
    position: relative;
    z-index: 1;
    padding: 2rem 1rem 0;
    max-width: 900px;
    margin: 0 auto;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    background: rgba(20, 25, 35, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    color: rgba(148, 163, 184, 0.8);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
  }

  .back-btn .icon {
    width: 16px;
    height: 16px;
  }

  .back-btn:hover {
    background: rgba(30, 35, 50, 0.7);
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(226, 232, 240, 0.95);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .experience-card {
      grid-template-columns: auto 1fr;
      gap: 1rem;
      padding: 1.25rem;
    }

    .card-arrow {
      display: none;
    }

    .card-node {
      width: 32px;
      height: 32px;
    }

    .node-ring {
      width: 32px;
      height: 32px;
    }

    .node-dot {
      width: 10px;
      height: 10px;
    }

    .card-title {
      font-size: 1.15rem;
    }

    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .connecting-paths {
      display: none;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .connecting-path {
      animation: none;
      stroke-dashoffset: 0;
    }

    .node-ring {
      animation: none;
    }
  }
</style>
