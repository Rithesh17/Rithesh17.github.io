<script lang="ts">
  import { PageHero } from 'statue-ssg';
  import EducationCard from '$lib/components/portfolio/EducationCard.svelte';
  
  export let data;
  
  $: education = data?.education || [];
  $: siteConfig = data?.siteConfig;
</script>

<svelte:head>
  <title>Education | Portfolio | {siteConfig?.site?.name || 'Portfolio'}</title>
  <meta name="description" content="Academic background and qualifications" />
</svelte:head>

<div class="education-page">
  <PageHero
    title="Education"
    description="Academic background and qualifications"
  />
  
  {#if education.length > 0}
    <section class="education-section">
      <div class="container">
        <div class="education-timeline">
          {#each education as edu, index}
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <EducationCard education={edu} />
            </div>
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
  }

  .education-section {
    padding: 4rem 1rem;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .education-timeline {
    position: relative;
    padding-left: 2rem;
  }

  .education-timeline::before {
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
    .education-timeline {
      padding-left: 1.5rem;
    }

    .timeline-marker {
      left: -1.75rem;
    }
  }
</style>
