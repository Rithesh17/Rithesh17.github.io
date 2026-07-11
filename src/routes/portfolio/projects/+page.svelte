<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  import { packBento } from '$lib/utils/bentoPack.js';

  // Each tile flies in from its own random direction/distance so the mosaic
  // feels like it's settling into place rather than just appearing. Purely
  // a client-side transition effect (no bearing on SSR markup), so genuine
  // Math.random() here is safe - it doesn't need to match between server
  // and client, it just needs to look alive each time the grid mounts.
  function flyInProps() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 140;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      duration: 550 + Math.random() * 250,
      easing: cubicOut,
    };
  }

  export let data;

  $: projects = data?.projects || [];
  $: siteConfig = data?.siteConfig;

  let selectedCategory = 'all';
  let mouseX = 0;
  let mouseY = 0;
  let containerRef: HTMLElement;

  $: categories = ['all', ...new Set(projects.map((p: any) => p.category).filter(Boolean))];
  $: filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p: any) => p.category === selectedCategory);

  // Re-packed every time the filter changes, so however many cards are
  // visible always tile into a gap-free bento mosaic - no dependency on a
  // fixed project count.
  $: packedProjects = packBento(filteredProjects, { columns: 3, maxCol: 2, maxRow: 2 });

  $: allTechnologies = [...new Set(projects.flatMap((p: any) => p.technologies || []))] as string[];
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/portfolio/projects' }
  ];

  // Assign each project a depth/animation, and derive its bento shape from
  // the span the packer gave it (not array position).
  function getCardProps(project: any, index: number) {
    const depths = [1, 2, 1, 3, 2, 1]; // Varied depth pattern
    const depth = depths[index % 6];
    const animationDelay = (index * 0.5) % 4;
    const floatDuration = 4 + (index % 3);

    const colSpan = project.colSpan || 1;
    const rowSpan = project.rowSpan || 1;
    const shape =
      colSpan >= 2 && rowSpan >= 2 ? 'hero' :
      colSpan >= 2 ? 'wide' :
      rowSpan >= 2 ? 'tall' :
      'small';

    return { depth, animationDelay, floatDuration, colSpan, rowSpan, shape };
  }

  function handleMouseMove(e: MouseEvent) {
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    // Normalize to -1 to 1
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  function handleMouseLeave() {
    mouseX = 0;
    mouseY = 0;
  }

  // Calculate parallax offset based on depth
  function getParallaxStyle(depth: number) {
    const intensity = (4 - depth) * 8; // Closer = more movement
    const x = mouseX * intensity;
    const y = mouseY * intensity;
    return `transform: translate(${x}px, ${y}px)`;
  }
</script>

<SEO
	siteConfig={siteConfig}
	title="Projects"
	description={`Browse ${projects.length} personal and professional projects${allTechnologies.length > 0 ? ` built with ${allTechnologies.slice(0, 5).join(', ')}` : ''}`}
	keywords={['projects', 'portfolio', 'software development', ...allTechnologies.slice(0, 10)]}
	type="website"
	canonical={$page.url.pathname}
/>

<StructuredData siteConfig={siteConfig} type="BreadcrumbList" {breadcrumbs} />

<div class="projects-page">
  <Particles className="absolute inset-0" refresh={true} />
  
  <div class="back-nav">
    <a href="/" class="back-btn">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
      Back to Portfolio
    </a>
  </div>
  
  <header class="page-header">
    <h1 class="page-title">Projects</h1>
    <p class="page-description">Explorations in code, research, and creativity</p>
  </header>
  
  {#if projects.length > 0}
    <section class="projects-section">
      <div class="container">
        {#if categories.length > 1}
          <div class="filters">
            {#each categories as category}
              <button
                class="filter-btn"
                class:active={selectedCategory === category}
                on:click={() => selectedCategory = String(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            {/each}
          </div>
        {/if}
        
        <div
          class="floating-grid"
          bind:this={containerRef}
          on:mousemove={handleMouseMove}
          on:mouseleave={handleMouseLeave}
          role="region"
          aria-label="Projects gallery"
        >
          {#key selectedCategory}
          {#each packedProjects as project, index (project.id || project.markdownPath)}
            {@const props = getCardProps(project, index)}
            {@const projectAny = project as any}
            {@const maxTech = props.shape === 'hero' ? 6 : props.shape === 'small' ? 0 : 3}
            <a
              href="/portfolio/projects/{projectAny.markdownPath?.split('/').pop() || projectAny.id}"
              class="floating-card depth-{props.depth} shape-{props.shape}"
              style="grid-column: span {props.colSpan}; grid-row: span {props.rowSpan}; --float-delay: {props.animationDelay}s; --float-duration: {props.floatDuration}s; {getParallaxStyle(props.depth)}"
              in:fly={{ ...flyInProps(), delay: Math.min(index, 10) * 45 }}
            >
              <div class="card-glow"></div>
              <div class="card-content">
                <div class="card-header">
                  <span class="card-category">{projectAny.category || 'Project'}</span>
                  {#if props.shape !== 'small' && projectAny.status}
                    <span class="card-status" class:active={projectAny.status?.toLowerCase() === 'active'}>
                      {projectAny.status}
                    </span>
                  {/if}
                </div>
                <h3 class="card-title">{projectAny.title}</h3>
                {#if projectAny.description}
                  <p class="card-description">{projectAny.description}</p>
                {/if}
                {#if maxTech > 0}
                  <div class="card-tech">
                    {#each (projectAny.technologies || []).slice(0, maxTech) as tech}
                      <span class="tech-tag">{tech}</span>
                    {/each}
                    {#if (projectAny.technologies || []).length > maxTech}
                      <span class="tech-more">+{projectAny.technologies.length - maxTech}</span>
                    {/if}
                  </div>
                {/if}
              </div>
            </a>
          {/each}
          {/key}
        </div>

        {#if filteredProjects.length === 0}
          <p class="no-results">No projects found in this category.</p>
        {/if}
      </div>
    </section>
  {:else}
    <section class="empty-section">
      <div class="container">
        <p class="empty-message">No projects yet. Check back soon!</p>
      </div>
    </section>
  {/if}
</div>

<style>
  .projects-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    position: relative;
    overflow-x: hidden;
  }

  /* Ensure particles are behind all content */
  :global(.projects-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  section {
    position: relative;
    z-index: 1;
  }

  /* Page Header */
  .page-header {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 3rem 1rem 2rem;
  }

  .page-title {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
    color: #ffffff;
  }

  .page-description {
    font-size: 1.1rem;
    color: rgba(148, 163, 184, 0.8);
    margin: 0;
    font-weight: 400;
  }

  .projects-section {
    padding: 2rem 1rem 4rem;
  }

  .container {
    max-width: 1300px;
    margin: 0 auto;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 3rem;
    justify-content: center;
  }

  .filter-btn {
    padding: 0.5rem 1.25rem;
    background: rgba(20, 25, 35, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    color: rgba(148, 163, 184, 0.8);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: capitalize;
    backdrop-filter: blur(8px);
  }

  .filter-btn:hover {
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(226, 232, 240, 0.95);
    background: rgba(30, 35, 50, 0.7);
  }

  .filter-btn.active {
    background: rgba(99, 102, 241, 0.2);
    color: rgba(165, 180, 252, 0.95);
    border-color: rgba(99, 102, 241, 0.4);
  }

  /* Floating Bento Grid: a true mosaic where a skyline packer (bentoPack.js)
     precomputes each card's column/row span in JS, simulating standard
     (non-dense) row-major placement. grid-auto-flow must stay the browser
     default "row" here, NOT "dense" - dense would place cards differently
     than the packer assumed and could reintroduce gaps or overlaps. */
  .floating-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 11.5rem;
    gap: 1.5rem;
    perspective: 1000px;
  }

  /* Floating Card */
  .floating-card {
    position: relative;
    display: block;
    text-decoration: none;
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    animation: float var(--float-duration, 5s) ease-in-out infinite;
    animation-delay: var(--float-delay, 0s);
    will-change: transform;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  /* Depth variations */
  .floating-card.depth-1 {
    background: rgba(25, 30, 45, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    z-index: 3;
  }

  .floating-card.depth-2 {
    background: rgba(20, 25, 40, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
    z-index: 2;
    opacity: 0.95;
  }

  .floating-card.depth-3 {
    background: rgba(15, 20, 35, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    z-index: 1;
    opacity: 0.9;
  }

  .floating-card:hover {
    z-index: 10;
    opacity: 1;
    animation-play-state: paused;
  }

  .floating-card.depth-1:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 50px rgba(99, 102, 241, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.3) inset;
  }

  .floating-card.depth-2:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 16px 40px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.25) inset;
  }

  .floating-card.depth-3:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 30px rgba(99, 102, 241, 0.1), 0 0 0 1px rgba(99, 102, 241, 0.2) inset;
  }

  /* Card glow effect */
  .card-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .floating-card:hover .card-glow {
    opacity: 1;
  }

  /* Card Content */
  .card-content {
    position: relative;
    padding: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100%;
  }

  /* Shape-specific content adjustments */
  .shape-hero .card-content,
  .shape-tall .card-content {
    gap: 0.75rem;
  }

  .shape-hero .card-content {
    padding: 1.75rem;
  }

  .shape-hero .card-title {
    font-size: 1.6rem;
  }

  .shape-hero .card-description {
    font-size: 0.95rem;
    line-height: 1.6;
    -webkit-line-clamp: 5;
    line-clamp: 5;
  }

  .shape-tall .card-description {
    -webkit-line-clamp: 6;
    line-clamp: 6;
  }

  .shape-small .card-title {
    font-size: 0.95rem;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .shape-small .card-description {
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .shape-wide .card-description {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .card-category {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(165, 180, 252, 0.8);
    background: rgba(99, 102, 241, 0.15);
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
  }

  .card-status {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(148, 163, 184, 0.7);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background: rgba(100, 116, 139, 0.2);
    border: 1px solid rgba(100, 116, 139, 0.3);
  }

  .card-status.active {
    color: #4ade80;
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.3);
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(241, 245, 249, 0.95);
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-description {
    font-size: 0.88rem;
    color: rgba(148, 163, 184, 0.8);
    line-height: 1.55;
    margin: 0;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: auto;
    max-height: 1.75rem;
    overflow: hidden;
  }

  .shape-hero .card-tech,
  .shape-tall .card-tech {
    max-height: none;
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

  .no-results {
    text-align: center;
    color: var(--color-muted, #8b949e);
    font-size: 1.125rem;
    padding: 3rem 0;
  }

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
    max-width: 1300px;
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

  /* Responsive. The packer assumed exactly 3 columns, so below that width
     every card collapses to a single column instead of trying to reflow
     spans that no longer make sense at 1-2 columns. */
  @media (max-width: 1024px) {
    .floating-grid {
      grid-template-columns: 1fr;
      grid-auto-rows: auto;
      gap: 1.25rem;
    }

    .floating-card {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
    }

    .floating-card .card-description {
      -webkit-line-clamp: 4;
      line-clamp: 4;
    }

    .shape-small .card-title {
      font-size: 1.1rem;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
  }

  @media (max-width: 640px) {
    .page-title {
      font-size: 2.25rem;
    }

    .shape-hero .card-title {
      font-size: 1.25rem;
    }

    .shape-hero .card-content {
      padding: 1.5rem;
    }

    /* Reduce animation on mobile for performance */
    .floating-card {
      animation: none;
    }
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .floating-card {
      animation: none;
    }
  }
</style>
