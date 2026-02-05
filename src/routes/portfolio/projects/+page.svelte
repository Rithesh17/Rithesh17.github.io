<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  
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

  $: allTechnologies = [...new Set(projects.flatMap((p: any) => p.technologies || []))] as string[];
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Projects', url: '/portfolio/projects' }
  ];

  // Assign each project depth, animation, and bento size
  function getCardProps(index: number, total: number) {
    const depths = [1, 2, 1, 3, 2, 1]; // Varied depth pattern
    const depth = depths[index % 6];
    const animationDelay = (index * 0.5) % 4;
    const floatDuration = 4 + (index % 3);
    
    // Bento grid sizes: 'large' = 2x2, 'wide' = 2x1, 'tall' = 1x2, 'normal' = 1x1
    // Create an interesting pattern
    let size: 'large' | 'wide' | 'tall' | 'normal' = 'normal';
    
    if (index === 0) {
      size = 'large'; // First project is featured (2x2)
    } else if (index === 1 || index === 4) {
      size = 'wide'; // Wide cards
    } else if (index === 3 || index === 6) {
      size = 'tall'; // Tall cards
    } else {
      size = 'normal';
    }
    
    return { depth, animationDelay, floatDuration, size };
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
    <a href="/portfolio" class="back-btn">
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
          {#each filteredProjects as project, index}
            {@const props = getCardProps(index, filteredProjects.length)}
            {@const projectAny = project as any}
            <a 
              href="/portfolio/projects/{projectAny.markdownPath?.split('/').pop() || projectAny.id}"
              class="floating-card depth-{props.depth} size-{props.size}"
              style="--float-delay: {props.animationDelay}s; --float-duration: {props.floatDuration}s; {getParallaxStyle(props.depth)}"
            >
              <div class="card-glow"></div>
              <div class="card-content">
                <div class="card-header">
                  <span class="card-category">{projectAny.category || 'Project'}</span>
                  {#if projectAny.status}
                    <span class="card-status" class:active={projectAny.status?.toLowerCase() === 'active'}>
                      {projectAny.status}
                    </span>
                  {/if}
                </div>
                <h3 class="card-title">{projectAny.title}</h3>
                <p class="card-description">{projectAny.description}</p>
                <div class="card-tech">
                  {#each (projectAny.technologies || []).slice(0, 4) as tech}
                    <span class="tech-tag">{tech}</span>
                  {/each}
                  {#if (projectAny.technologies || []).length > 4}
                    <span class="tech-more">+{projectAny.technologies.length - 4}</span>
                  {/if}
                </div>
              </div>
            </a>
          {/each}
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

  /* Floating Bento Grid */
  .floating-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(180px, auto);
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

  /* Bento size variations */
  .floating-card.size-large {
    grid-column: span 2;
    grid-row: span 2;
  }

  .floating-card.size-wide {
    grid-column: span 2;
  }

  .floating-card.size-tall {
    grid-row: span 2;
  }

  .floating-card.size-normal {
    grid-column: span 1;
    grid-row: span 1;
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
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
  }

  /* Size-specific content adjustments */
  .size-large .card-content {
    padding: 2rem;
    gap: 1rem;
  }

  .size-large .card-title {
    font-size: 1.75rem;
  }

  .size-large .card-description {
    font-size: 1rem;
    -webkit-line-clamp: 5;
    line-clamp: 5;
  }

  .size-tall .card-content {
    justify-content: space-between;
  }

  .size-tall .card-description {
    -webkit-line-clamp: 6;
    line-clamp: 6;
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
    font-size: 1.25rem;
    font-weight: 600;
    color: rgba(241, 245, 249, 0.95);
    margin: 0;
    line-height: 1.3;
  }

  .card-description {
    font-size: 0.9rem;
    color: rgba(148, 163, 184, 0.8);
    line-height: 1.6;
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

  /* Responsive */
  @media (max-width: 1200px) {
    .floating-grid {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: minmax(160px, auto);
    }

    .floating-card.size-large {
      grid-column: span 2;
      grid-row: span 2;
    }
  }

  @media (max-width: 900px) {
    .floating-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: minmax(150px, auto);
      gap: 1.25rem;
    }

    .floating-card.size-large {
      grid-column: span 2;
      grid-row: span 1;
    }

    .floating-card.size-tall {
      grid-row: span 1;
    }
  }

  @media (max-width: 640px) {
    .floating-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .floating-card.size-large,
    .floating-card.size-wide,
    .floating-card.size-tall,
    .floating-card.size-normal {
      grid-column: span 1;
      grid-row: span 1;
    }

    .page-title {
      font-size: 2.25rem;
    }

    .size-large .card-title {
      font-size: 1.25rem;
    }

    .size-large .card-content {
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
