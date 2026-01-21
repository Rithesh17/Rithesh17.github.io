<script lang="ts">
  import { PageHero } from 'statue-ssg';
  import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
  
  export let data;
  
  $: projects = data?.projects || [];
  $: siteConfig = data?.siteConfig;
  
  let selectedCategory = 'all';
  
  $: categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];
  $: filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);
</script>

<svelte:head>
  <title>Projects | Portfolio | {siteConfig?.site?.name || 'Portfolio'}</title>
  <meta name="description" content="Showcase of personal and professional projects" />
</svelte:head>

<div class="projects-page">
  <PageHero
    title="Projects"
    description="Showcase of personal and professional projects"
  />
  
  {#if projects.length > 0}
    <section class="projects-section">
      <div class="container">
        {#if categories.length > 1}
          <div class="filters">
            {#each categories as category}
              <button
                class="filter-btn"
                class:active={selectedCategory === category}
                on:click={() => selectedCategory = category}
              >
                {category === 'all' ? 'All' : category}
              </button>
            {/each}
          </div>
        {/if}
        
        <div class="projects-grid">
          {#each filteredProjects as project}
            <ProjectCard {project} />
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
  }

  .projects-section {
    padding: 4rem 1rem;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  .filter-btn {
    padding: 0.5rem 1.25rem;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    color: var(--color-foreground, #d0d0d0);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: capitalize;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  .filter-btn:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    transform: translateY(-1px);
  }

  .filter-btn.active {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 15px rgba(255, 255, 255, 0.2), 0 0 1px rgba(255, 255, 255, 0.3) inset;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
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

  @media (max-width: 768px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
