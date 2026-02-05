<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: education = data?.education || [];
  $: siteConfig = data?.siteConfig;
  $: institutions = [...new Set(education.map((e: any) => e.institution).filter(Boolean))] as string[];
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Education', url: '/portfolio/education' }
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
      
      const startX = currentRect.left - containerRect.left + currentRect.width / 2;
      const startY = currentRect.bottom - containerRect.top;
      const endX = nextRect.left - containerRect.left + nextRect.width / 2;
      const endY = nextRect.top - containerRect.top;
      
      const controlOffset = Math.min(80, (endY - startY) * 0.4);
      
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
	title="Education"
	description={`Academic background and qualifications from ${institutions.slice(0, 2).join(' and ')}${institutions.length > 2 ? ' and more' : ''}. ${education.length} degree${education.length !== 1 ? 's' : ''} in computer science and related fields.`}
	keywords={['education', 'academic', 'qualifications', 'degrees', ...institutions.slice(0, 5)]}
	type="website"
	canonical={$page.url.pathname}
/>

<StructuredData siteConfig={siteConfig} type="BreadcrumbList" {breadcrumbs} />

<div class="education-page">
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
      <h1 class="section-title">Education</h1>
      <p class="section-subtitle">Academic background and qualifications</p>
    </div>
  </section>
  
  {#if education.length > 0}
    <section class="education-section">
      <div class="container" bind:this={containerRef}>
        <!-- SVG Connecting Paths -->
        <svg class="connecting-paths" aria-hidden="true">
          <defs>
            <linearGradient id="eduPathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(147, 197, 253, 0.6)" />
              <stop offset="50%" stop-color="rgba(99, 102, 241, 0.4)" />
              <stop offset="100%" stop-color="rgba(165, 180, 252, 0.6)" />
            </linearGradient>
            <filter id="eduPathGlow">
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

        <!-- Education Cards -->
        <div class="cards-container">
          {#each education as edu, index}
            {@const eduAny = edu as any}
            <a 
              href="/portfolio/education/{eduAny.markdownPath?.split('/').pop() || eduAny.id}"
              class="education-card"
              use:bindCard={index}
            >
              <div class="card-node">
                <div class="node-ring"></div>
                <div class="node-dot"></div>
              </div>
              
              <div class="card-content">
                <div class="card-header">
                  <span class="card-dates">{formatDate(eduAny.startDate)} — {formatDate(eduAny.endDate)}</span>
                  <span class="card-location">{eduAny.location || ''}</span>
                </div>
                
                <h3 class="card-title">{eduAny.degree}</h3>
                <p class="card-institution">{eduAny.institution}</p>
                
                {#if eduAny.description}
                  <p class="card-description">{eduAny.description}</p>
                {/if}
                
                {#if eduAny.achievements?.length > 0}
                  <div class="card-achievements">
                    {#each eduAny.achievements.slice(0, 2) as achievement}
                      <span class="achievement-tag">{achievement}</span>
                    {/each}
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
        <p class="empty-message">No education entries yet. Check back soon!</p>
      </div>
    </section>
  {/if}
</div>

<style>
  .education-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  :global(.education-page > div[aria-hidden="true"]) {
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

  .education-section {
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
    stroke: url(#eduPathGradient);
    stroke-width: 2;
    stroke-linecap: round;
    filter: url(#eduPathGlow);
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

  /* Education Card */
  .education-card {
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

  .education-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 0% 50%, rgba(147, 197, 253, 0.08) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .education-card:hover {
    border-color: rgba(147, 197, 253, 0.3);
    transform: translateX(8px);
    box-shadow: 0 8px 32px rgba(147, 197, 253, 0.15);
  }

  .education-card:hover::before {
    opacity: 1;
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
    border: 2px solid rgba(147, 197, 253, 0.3);
    border-radius: 50%;
    animation: pulse-ring 3s ease-out infinite;
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
    background: linear-gradient(135deg, rgba(147, 197, 253, 0.9) 0%, rgba(99, 102, 241, 0.9) 100%);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
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

  .card-dates {
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(148, 163, 184, 0.8);
    letter-spacing: 0.02em;
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

  .card-institution {
    font-size: 1rem;
    font-weight: 500;
    color: rgba(147, 197, 253, 0.9);
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

  .card-achievements {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .achievement-tag {
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(148, 163, 184, 0.7);
    background: rgba(255, 255, 255, 0.05);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  /* Arrow */
  .card-arrow {
    color: rgba(148, 163, 184, 0.4);
    transition: all 0.3s ease;
  }

  .education-card:hover .card-arrow {
    color: rgba(147, 197, 253, 0.9);
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
    .education-card {
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
