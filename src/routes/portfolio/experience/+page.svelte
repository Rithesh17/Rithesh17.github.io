<script lang="ts">
  import ExperienceCard from '$lib/components/portfolio/ExperienceCard.svelte';
  import Meteors from '$lib/animations/Meteors.svelte';
  
  export let data;
  
  $: experience = data?.experience || [];
  $: siteConfig = data?.siteConfig;
</script>

<svelte:head>
  <title>Experience | Portfolio | {siteConfig?.site?.name || 'Portfolio'}</title>
  <meta name="description" content="Professional work experience and career journey" />
</svelte:head>

<div class="experience-page">
  <Meteors number={30} />
  
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

  /* Ensure meteors are behind all content */
  :global(.meteors-container) {
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

  @media (max-width: 768px) {
    .experience-timeline {
      padding-left: 1.5rem;
    }

    .timeline-marker {
      left: -1.75rem;
    }
  }
</style>
