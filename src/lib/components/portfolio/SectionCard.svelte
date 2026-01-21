<script>
  import { goto } from '$app/navigation';

  export let title = '';
  export let description = '';
  export let href = '';
  export let icon = '';
  export let count = null;
  export let featured = false;

  async function handleClick() {
    if (href) {
      await goto(href);
    }
  }
</script>

<a
  href={href}
  on:click|preventDefault={handleClick}
  class="section-card"
  class:featured={featured}
>
  <div class="card-content">
    {#if icon}
      <div class="icon-wrapper">
        <div class="icon">{icon}</div>
      </div>
    {/if}
    <div class="text-content">
      <h3 class="title">{title}</h3>
      <p class="description">{description}</p>
      {#if count !== null}
        <span class="count">{count} {count === 1 ? 'item' : 'items'}</span>
      {/if}
    </div>
    <div class="arrow">→</div>
  </div>
</a>

<style>
  .section-card {
    display: block;
    background: var(--color-card, #161b22);
    border: 1px solid var(--color-border, #30363d);
    border-radius: 12px;
    padding: 1.5rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .section-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-primary, #58a6ff);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  .section-card:hover {
    border-color: var(--color-primary, #58a6ff);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .section-card:hover::before {
    transform: scaleX(1);
  }

  .section-card.featured {
    border-color: var(--color-primary, #58a6ff);
    background: linear-gradient(135deg, var(--color-card, #161b22) 0%, rgba(88, 166, 255, 0.05) 100%);
  }

  .card-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .icon-wrapper {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-primary, #58a6ff);
    border-radius: 8px;
    opacity: 0.1;
  }

  .section-card:hover .icon-wrapper {
    opacity: 0.2;
  }

  .icon {
    font-size: 24px;
  }

  .text-content {
    flex: 1;
    min-width: 0;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--color-foreground, #c9d1d9);
  }

  .description {
    font-size: 0.875rem;
    color: var(--color-muted, #8b949e);
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
  }

  .count {
    font-size: 0.75rem;
    color: var(--color-primary, #58a6ff);
    font-weight: 500;
  }

  .arrow {
    flex-shrink: 0;
    font-size: 1.5rem;
    color: var(--color-muted, #8b949e);
    transition: all 0.3s ease;
    margin-left: auto;
  }

  .section-card:hover .arrow {
    color: var(--color-primary, #58a6ff);
    transform: translateX(4px);
  }
</style>
