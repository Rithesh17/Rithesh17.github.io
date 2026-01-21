<script>
  export let education;
  
  $: slug = education.id?.replace('edu-', '') || '';
  $: detailUrl = `/portfolio/education#${slug}`;
  $: title = education.degree || 'Education';
  $: institution = education.institution || '';
  $: location = education.location || '';
  $: degree = education.degree || '';
  $: startDate = education.startDate || '';
  $: endDate = education.endDate || '';
  $: gpa = education.gpa;
  $: honors = education.honors && education.honors.length > 0;
  $: description = '';
  
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.getFullYear();
  }
</script>

<a href={detailUrl} class="education-card">
  <div class="header">
    <div class="title-section">
      <h3 class="title">{title}</h3>
      {#if institution}
        <p class="institution">{institution}</p>
      {/if}
    </div>
    <div class="date-range">
      {#if startDate}
        <span class="date">{formatDate(startDate)}</span>
        {#if endDate}
          <span class="date-separator">-</span>
          <span class="date">{formatDate(endDate)}</span>
        {/if}
      {/if}
    </div>
  </div>
  
  {#if degree}
    <p class="degree">{degree} in {education.field || 'Computer Science'}</p>
  {/if}
  
  {#if location}
    <p class="location">{location}</p>
  {/if}
  
  <div class="badges">
    {#if gpa}
      <span class="badge">GPA: {gpa}</span>
    {/if}
    {#if honors}
      <span class="badge honors">Honors</span>
    {/if}
  </div>
</a>

<style>
  .education-card {
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
  
  .education-card::before {
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
  
  .education-card:hover::before {
    left: 100%;
  }
  
  .education-card:hover {
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
  
  .institution {
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
  
  .degree {
    color: var(--color-foreground, #c9d1d9);
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0;
  }
  
  .location {
    color: var(--color-muted, #8b949e);
    font-size: 0.875rem;
    margin: 0;
  }
  
  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .badge {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.15) 0%, rgba(245, 245, 245, 0.1) 50%, rgba(224, 224, 224, 0.15) 100%);
    color: var(--color-primary, #e0e0e0);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }
  
  .badge.honors {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2), 0 0 1px rgba(255, 255, 255, 0.3) inset;
  }
</style>
