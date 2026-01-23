<script lang="ts">
  import { PageHero } from 'statue-ssg';
  import { ContentBody } from 'statue-ssg';
  import Particles from '$lib/animations/Particles.svelte';
  
  export let data;
  
  $: project = data?.project;
  $: siteConfig = data?.siteConfig;
  $: title = project?.title || 'Project';
  $: description = project?.description || '';
  $: technologies = project?.technologies || [];
  $: githubUrl = project?.githubUrl || '';
  $: liveUrl = project?.liveUrl || '';
  $: date = project?.date;
  $: content = project?.content || '';
</script>

<svelte:head>
  <title>{title} | Projects | Portfolio | {siteConfig?.site?.name || 'Portfolio'}</title>
  <meta name="description" content={description} />
</svelte:head>

<div class="project-page">
  <Particles className="absolute inset-0" refresh={true} />
  
  <PageHero
    title={title}
    description={description}
  />
  
  {#if project}
    <section class="project-section">
      <div class="container">
        <div class="project-header">
          <div class="project-meta">
            {#if date}
              <span class="date">Date: {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {/if}
            {#if project.category}
              <span class="category">Category: {project.category}</span>
            {/if}
          </div>
          
          <div class="project-links">
            {#if githubUrl}
              <a 
                href={githubUrl} 
                class="link-btn github-btn" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                </svg>
                View on GitHub
              </a>
            {/if}
            {#if liveUrl}
              <a 
                href={liveUrl} 
                class="link-btn live-btn" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Live Demo
              </a>
            {/if}
          </div>
        </div>
        
        {#if technologies.length > 0}
          <div class="technologies">
            <h3 class="section-title">Technologies</h3>
            <div class="tech-badges">
              {#each technologies as tech}
                <span class="tech-badge">{tech}</span>
              {/each}
            </div>
          </div>
        {/if}
        
        <div class="project-content">
          <ContentBody content={content} />
        </div>
        
        <div class="back-link">
          <a href="/portfolio/projects" class="back-btn">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Projects
          </a>
        </div>
      </div>
    </section>
  {:else}
    <section class="error-section">
      <div class="container">
        <p class="error-message">Project not found.</p>
        <a href="/portfolio/projects" class="back-btn">Back to Projects</a>
      </div>
    </section>
  {/if}
</div>

<style>
  .project-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    position: relative;
    overflow-x: hidden;
  }

  /* Ensure particles are behind all content */
  :global(.project-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  section {
    position: relative;
    z-index: 1;
  }

  .project-section {
    padding: 4rem 1rem;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .project-header {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .project-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--color-muted, #8b949e);
  }

  .project-meta .date,
  .project-meta .category {
    text-transform: capitalize;
  }

  .project-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .link-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .link-btn .icon {
    width: 18px;
    height: 18px;
  }

  .github-btn {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    color: var(--color-foreground, #d0d0d0);
  }

  .github-btn:hover {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  .live-btn {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
  }

  .live-btn:hover {
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
    transform: translateY(-1px);
  }

  .technologies {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tech-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech-badge {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.15) 0%, rgba(245, 245, 245, 0.1) 50%, rgba(224, 224, 224, 0.15) 100%);
    color: var(--color-primary, #e0e0e0);
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  .project-content {
    margin-bottom: 3rem;
    line-height: 1.7;
  }

  .project-content :global(h1),
  .project-content :global(h2),
  .project-content :global(h3) {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--color-foreground, #d0d0d0);
  }

  .project-content :global(p) {
    margin-bottom: 1rem;
    color: var(--color-foreground, #c9d1d9);
  }

  .project-content :global(ul),
  .project-content :global(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .project-content :global(li) {
    margin-bottom: 0.5rem;
    color: var(--color-foreground, #c9d1d9);
  }

  .project-content :global(code) {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  .project-content :global(pre) {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 1rem;
  }

  .back-link {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
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

  .error-section {
    padding: 4rem 1rem;
  }

  .error-message {
    text-align: center;
    color: var(--color-muted, #8b949e);
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .project-header {
      gap: 1rem;
    }

    .project-links {
      flex-direction: column;
    }

    .link-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
