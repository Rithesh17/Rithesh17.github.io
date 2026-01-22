<script lang="ts">
  export let experience;
  
  // Use slug directly if available (from content.slug), otherwise extract from markdownPath
  // This ensures we get the exact filename
  $: slug = experience.slug || experience.markdownPath?.split('/').pop()?.replace('.md', '') || experience.id?.replace('exp-', '') || '';
  $: detailUrl = `/portfolio/experience/${slug}`;
  $: title = experience.title || 'Untitled Role';
  $: company = experience.company || '';
  $: location = experience.location || '';
  $: startDate = experience.startDate || '';
  $: endDate = experience.endDate || (experience.current ? 'present' : '');
  $: technologies = experience.technologies || [];
  $: description = experience.description || '';
  
  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.getFullYear();
  }
</script>

<a href={detailUrl} class="experience-card">
  <div class="header">
    <div class="title-section">
      <h3 class="title">{title}</h3>
      {#if company}
        <p class="company">{company}</p>
      {/if}
    </div>
    <div class="date-range">
      {#if startDate}
        <span class="date">{formatDate(startDate)}</span>
        {#if endDate && endDate !== 'present'}
          <span class="date-separator">-</span>
          <span class="date">{formatDate(endDate)}</span>
        {:else if endDate === 'present' || experience.current}
          <span class="date-separator">-</span>
          <span class="date">Present</span>
        {/if}
      {/if}
    </div>
  </div>
  
  {#if location}
    <p class="location">{location}</p>
  {/if}
  
  {#if description}
    <p class="description">{description}</p>
  {/if}
  
  {#if technologies.length > 0}
    <div class="tech-badges">
      {#each technologies.slice(0, 5) as tech}
        <span class="tech-badge">{tech}</span>
      {/each}
    </div>
  {/if}
</a>

<style>
  .experience-card {
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
  }
  
  .experience-card::before {
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
  
  .experience-card:hover::before {
    left: 100%;
  }
  
  .experience-card:hover {
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
    margin: 0 0 0.25rem 0;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }
  
  .company {
    color: var(--color-muted, #8b949e);
    font-size: 0.9rem;
    margin: 0;
  }
  
  .date-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-muted, #8b949e);
    font-size: 0.875rem;
    white-space: nowrap;
  }
  
  .date-separator {
    opacity: 0.5;
  }
  
  .location {
    color: var(--color-muted, #8b949e);
    font-size: 0.875rem;
    margin: 0;
  }
  
  .description {
    color: var(--color-foreground, #c9d1d9);
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
    margin-top: 0.5rem;
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
</style>
