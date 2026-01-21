<script>
  export let project;
  
  $: slug = project.markdownPath?.split('/').pop()?.replace('.md', '') || project.id;
  $: detailUrl = `/portfolio/projects/${slug}`;
  $: title = project.title || 'Untitled Project';
  $: description = project.description || '';
  $: technologies = project.technologies || [];
  $: githubUrl = project.githubUrl || '';
  $: liveUrl = project.liveUrl || '';
  $: featured = project.featured || false;
  
  function stopPropagation(e) {
    e.stopPropagation();
  }
</script>

<article class="project-card" class:featured>
  {#if featured}
    <div class="featured-badge badge-shine">Featured</div>
  {/if}
  
  <a href={detailUrl} class="project-main-link">
    <div class="content">
      <h3 class="title">{title}</h3>
      {#if description}
        <p class="description">{description}</p>
      {/if}
      
      {#if technologies.length > 0}
        <div class="tech-badges">
          {#each technologies.slice(0, 4) as tech}
            <span class="tech-badge">{tech}</span>
          {/each}
          {#if technologies.length > 4}
            <span class="tech-badge">+{technologies.length - 4}</span>
          {/if}
        </div>
      {/if}
    </div>
  </a>

  <div class="content">
    <div class="links">
      {#if liveUrl}
        <a href={liveUrl} class="link" on:click={stopPropagation} target="_blank" rel="noopener noreferrer">Demo</a>
      {/if}
      {#if githubUrl}
        <a href={githubUrl} class="link" on:click={stopPropagation} target="_blank" rel="noopener noreferrer">GitHub</a>
      {/if}
    </div>
  </div>
</article>

<style>
  .project-card {
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    text-decoration: none;
    color: var(--color-foreground, #d0d0d0);
    transition: all 0.3s ease;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    padding-top: 0.5rem;
  }
  
  .project-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.03), 
      transparent
    );
    transition: left 0.5s;
    z-index: 1;
    pointer-events: none;
  }
  
  .project-card:hover::before {
    left: 100%;
  }
  
  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 
                0 0 2px rgba(255, 255, 255, 0.15) inset,
                0 1px 0 rgba(255, 255, 255, 0.1) inset;
    border-color: rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
  }
  
  .project-card.featured {
    border-color: rgba(255, 255, 255, 0.2);
    border-width: 2px;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6), 
                0 0 2px rgba(255, 255, 255, 0.15) inset;
  }
  
  .featured-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--color-primary, #58a6ff);
    color: var(--color-background, #0d1117);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 1;
  }
  
  .content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
  }
  
  .title {
    font-size: 1.25rem;
    font-weight: 600;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }
  
  .description {
    color: var(--color-muted, #8b949e);
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .tech-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }
  
  .tech-badge {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.15) 0%, rgba(245, 245, 245, 0.1) 50%, rgba(224, 224, 224, 0.15) 100%);
    color: var(--color-primary, #e0e0e0);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }
  
  .links {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .link {
    color: var(--color-primary, #e0e0e0);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }
  
  .link:hover {
    color: #f5f5f5;
    text-decoration: underline;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  }
</style>
