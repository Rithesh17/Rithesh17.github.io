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
    {#each sections as section}
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
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    pointer-events: none;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .nav-item {
    pointer-events: auto;
    position: relative;
  }

  .nav-link {
    display: block;
    text-decoration: none;
    color: rgba(148, 163, 184, 0.4);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.3s ease;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    padding: 0.6rem 0.4rem;
    position: relative;
    cursor: pointer;
    border-left: 2px solid transparent;
  }

  .nav-link:hover {
    color: rgba(226, 232, 240, 0.8);
  }

  .nav-link.active {
    color: rgba(226, 232, 240, 0.95);
    font-weight: 600;
    border-left-color: rgba(165, 180, 252, 0.8);
  }

  .nav-link.active::before {
    content: '';
    position: absolute;
    left: -2px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent 0%, rgba(165, 180, 252, 0.8) 20%, rgba(165, 180, 252, 0.8) 80%, transparent 100%);
    box-shadow: 0 0 8px rgba(165, 180, 252, 0.5);
  }

  .nav-text {
    display: inline-block;
  }

  /* Responsive: Hide on smaller screens */
  @media (max-width: 1100px) {
    .vertical-nav {
      display: none;
    }
  }

  /* Adjust position on larger screens */
  @media (min-width: 1600px) {
    .vertical-nav {
      left: 2.5rem;
    }
  }
</style>
