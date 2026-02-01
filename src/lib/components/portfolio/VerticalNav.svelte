<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let sections: Array<{ id: string; label: string }> = [];

  let activeSection = '';
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  function scrollToSection(id: string) {
    if (!browser) return;
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for fixed headers
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }

  function updateActiveSection() {
    if (!browser) return;
    const scrollPosition = window.scrollY + 150; // Offset for better detection

    // Find which section is currently in view
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i].id);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          activeSection = sections[i].id;
          return;
        }
      }
    }

    // If no section found, check if we're at the top
    if (window.scrollY < 100) {
      activeSection = sections[0]?.id || '';
    }
  }

  function handleScroll() {
    if (!browser) return;
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveSection, 50);
  }

  onMount(() => {
    if (browser) {
      updateActiveSection();
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    }
  });
</script>

<nav class="vertical-nav">
  <ul class="nav-list">
    {#each sections as section, index}
      <li class="nav-item">
        <a
          href="#{section.id}"
          class="nav-link"
          class:active={activeSection === section.id}
          on:click|preventDefault={() => scrollToSection(section.id)}
        >
          <span class="nav-text">{section.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .vertical-nav {
    position: fixed;
    left: 1rem;
    top: 10rem; /* Offset for header (NavigationBar is typically ~64-80px) */
    bottom: 16rem; /* Offset for footer */
    height: calc(110vh - 15rem); /* Total viewport minus top and bottom offsets */
    z-index: 100;
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 1.5rem;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: auto;
    justify-content: center;
    position: relative;
    width: 100%;
  }

  .nav-link {
    display: block;
    text-decoration: none;
    color: var(--color-muted, #8b949e);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    transition: all 0.3s ease;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    padding: 0.5rem 0;
    position: relative;
    cursor: pointer;
  }

  .nav-link:hover {
    color: var(--color-foreground, #d0d0d0);
    transform: rotate(180deg) scale(1.1);
  }

  .nav-link.active {
    color: var(--color-primary, #e0e0e0);
    font-weight: 600;
    transform: rotate(180deg) scale(1.15);
  }

  .nav-link.active::before {
    content: '';
    position: absolute;
    left: -0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 100%;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }

  .nav-text {
    display: inline-block;
  }

  /* Responsive: Hide on mobile */
  @media (max-width: 1024px) {
    .vertical-nav {
      display: none;
    }
  }

  /* Ensure nav doesn't interfere with content on smaller screens */
  @media (max-width: 1200px) {
    .vertical-nav {
      left: 1rem;
    }
  }
</style>
