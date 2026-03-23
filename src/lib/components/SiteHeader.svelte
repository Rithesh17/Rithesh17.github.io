<script>
  import { House } from 'lucide-svelte';

  /** @type {string | null} */
  export let siteTitle = null;
  /** Logo: `true` = default SVG mark, string = image URL, null = use home icon only */
  export let logo = null;
</script>

<header class="site-header text-[var(--color-foreground)]">
  <div class="site-header-inner">
    <a href="/" class="home-brand" aria-label="Home">
      {#if logo === true}
        <span class="logo-mark text-[var(--color-primary)]" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" />
            <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M12 8L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
      {:else if logo}
        <img src={logo} alt="" class="logo-img h-8 w-8 shrink-0 object-contain" />
      {:else}
        <span class="home-icon-wrap" aria-hidden="true">
          <House class="home-icon" size={22} strokeWidth={2} />
        </span>
      {/if}
      {#if siteTitle}
        <span class="site-title font-bold text-xl">{siteTitle}</span>
      {/if}
    </a>
  </div>
</header>

<style>
  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    height: 4rem;
    view-transition-name: navbar;
    /* Frosted glass: see-through + blur (meteors/hero show through) */
    background: color-mix(in srgb, var(--color-background) 20%, transparent);
    backdrop-filter: blur(5px) saturate(1.15);
    -webkit-backdrop-filter: blur(5px) saturate(1.15);
  }

  @supports not (background: color-mix(in srgb, black, transparent)) {
    .site-header {
      background: rgba(0, 0, 0, 0.45);
    }
  }

  .site-header-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .home-brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
    border-radius: 8px;
    padding: 0.25rem 0.35rem 0.25rem 0;
    margin-left: -0.35rem;
    transition: color 0.2s ease, opacity 0.2s ease;
  }

  .home-brand:hover {
    color: var(--color-primary);
  }

  .home-brand:hover :global(.home-icon) {
    stroke: var(--color-primary);
  }

  .home-icon-wrap {
    display: flex;
    align-items: center;
    color: var(--color-muted);
  }

  .home-brand:hover .home-icon-wrap {
    color: var(--color-primary);
  }

  .site-title {
    color: var(--color-foreground);
  }

  .home-brand:hover .site-title {
    color: var(--color-primary);
  }

  .home-brand:hover .logo-mark {
    color: var(--color-primary);
  }
</style>
