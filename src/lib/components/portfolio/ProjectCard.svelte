<script lang="ts">
  import { goto } from '$app/navigation';
  
  export let project;
  
  $: slug = project.markdownPath?.split('/').pop()?.replace('.md', '') || project.id;
  $: detailUrl = `/portfolio/projects/${slug}`;
  $: title = project.title || 'Untitled Project';
  $: description = project.description || '';
  $: technologies = project.technologies || [];
  $: githubUrl = project.githubUrl || '';
  $: liveUrl = project.liveUrl || '';
  
  function handleCardClick() {
    goto(detailUrl);
  }
  
  function stopPropagation(e: Event) {
    e.stopPropagation();
  }
</script>

<a href={detailUrl} class="project-card" on:click|preventDefault={handleCardClick}>
  <div class="header">
    <div class="title-section">
      <h3 class="title">{title}</h3>
    </div>
  </div>
  
  {#if description}
    <p class="description">{description}</p>
  {/if}
  
  <div class="tech-and-github">
    {#if technologies.length > 0}
      <div class="tech-badges">
        {#each technologies.slice(0, 5) as tech}
          <span class="tech-badge">{tech}</span>
        {/each}
      </div>
    {/if}
    {#if githubUrl}
      <a 
        href={githubUrl} 
        class="github-link" 
        on:click={stopPropagation} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    {/if}
  </div>
</a>

<style>
  .project-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    text-decoration: none;
    color: var(--color-foreground, #d0d0d0);
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  
  .project-card:focus {
    outline: 2px solid rgba(255, 255, 255, 0.3);
    outline-offset: 2px;
  }
  
  .project-card:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.3);
    outline-offset: 2px;
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
    pointer-events: none;
  }
  
  .project-card:hover::before {
    left: 100%;
  }
  
  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 
                0 0 2px rgba(255, 255, 255, 0.15) inset;
    border-color: rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .title-section {
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
    color: var(--color-foreground, #c9d1d9);
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .tech-and-github {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .tech-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    flex: 1;
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
  
  .github-link {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2), 0 0 1px rgba(255, 255, 255, 0.3) inset;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  
  .github-link:hover {
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3), 0 0 2px rgba(255, 255, 255, 0.4) inset;
    transform: translateY(-1px);
  }
</style>
