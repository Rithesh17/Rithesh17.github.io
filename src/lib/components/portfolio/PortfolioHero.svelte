<script>
  export let title = 'Portfolio';
  export let subtitle = 'Explore my work, experience, and skills';
  export let stats = [];
</script>

<div class="portfolio-hero">
  <div class="hero-content">
    <h1 class="title">{title}</h1>
    <p class="subtitle">{subtitle}</p>
    {#if stats && stats.length > 0}
      <div class="stats">
        {#each stats as stat}
          <div class="stat-item">
            <div class="stat-value">{stat.value}</div>
            <div class="stat-label">{stat.label}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .portfolio-hero {
    padding: 4rem 1rem;
    text-align: center;
    background: linear-gradient(135deg, var(--color-background, #0d1117) 0%, rgba(88, 166, 255, 0.05) 100%);
    border-bottom: 1px solid var(--color-border, #30363d);
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .title {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, var(--color-foreground, #c9d1d9) 0%, var(--color-primary, #58a6ff) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 1.25rem;
    color: var(--color-muted, #8b949e);
    margin: 0 0 2rem 0;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-primary, #58a6ff);
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--color-muted, #8b949e);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 640px) {
    .title {
      font-size: 2.5rem;
    }

    .stats {
      gap: 2rem;
    }

    .stat-value {
      font-size: 2rem;
    }
  }
</style>
