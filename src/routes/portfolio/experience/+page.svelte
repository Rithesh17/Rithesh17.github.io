<script lang="ts">
  import ExperienceCard from '$lib/components/portfolio/ExperienceCard.svelte';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: experience = data?.experience || [];
  $: siteConfig = data?.siteConfig;
  $: companies = [...new Set(experience.map(e => e.company).filter(Boolean))];
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Experience', url: '/portfolio/experience' }
  ];
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
      <div class="container">
        <div class="experience-timeline">
          {#each experience as exp, index}
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <ExperienceCard experience={exp} />
            </div>
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

  /* Ensure particles are behind all content */
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
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
  }

  .section-subtitle {
    font-size: 1.25rem;
    color: var(--color-muted, #8b949e);
    margin: 0;
  }

  .experience-section {
    padding: 2rem 1rem 4rem;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .experience-timeline {
    position: relative;
    padding-left: 2rem;
  }

  .experience-timeline::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
  }

  .timeline-item {
    position: relative;
    margin-bottom: 2rem;
  }

  .timeline-marker {
    position: absolute;
    left: -2.25rem;
    top: 1.5rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    border: 2px solid var(--color-background, #000000);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    z-index: 1;
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
    max-width: 1200px;
    margin: 0 auto;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--color-foreground, #d0d0d0);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .back-btn .icon {
    width: 18px;
    height: 18px;
  }

  .back-btn:hover {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .experience-timeline {
      padding-left: 1.5rem;
    }

    .timeline-marker {
      left: -1.75rem;
    }
  }
</style>
