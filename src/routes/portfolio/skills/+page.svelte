<script lang="ts">
  import { PageHero } from 'statue-ssg';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: skills = data?.skills || { categories: [] };
  $: siteConfig = data?.siteConfig;
  $: allSkills = skills.categories?.flatMap(cat => cat.skills?.map(s => s.name) || []) || [];
  $: skillCategories = skills.categories?.map(c => c.name) || [];
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Skills', url: '/portfolio/skills' }
  ];
  
  function getLevelColor(level: string) {
    switch (level) {
      case 'expert':
        return 'var(--color-primary, #e0e0e0)';
      case 'advanced':
        return 'rgba(224, 224, 224, 0.8)';
      case 'intermediate':
        return 'rgba(224, 224, 224, 0.6)';
      default:
        return 'rgba(224, 224, 224, 0.4)';
    }
  }
  
  function getLevelWidth(level: string) {
    switch (level) {
      case 'expert':
        return '100%';
      case 'advanced':
        return '80%';
      case 'intermediate':
        return '60%';
      default:
        return '40%';
    }
  }
</script>

<SEO
	siteConfig={siteConfig}
	title="Skills"
	description={`Technical skills and expertise in ${skillCategories.join(', ')}. Proficient in ${allSkills.slice(0, 10).join(', ')} and more.`}
	keywords={['skills', 'technical skills', 'expertise', ...allSkills.slice(0, 15), ...skillCategories]}
	type="website"
	canonical={$page.url.pathname}
/>

<StructuredData siteConfig={siteConfig} type="BreadcrumbList" {breadcrumbs} />

<div class="skills-page">
  <Particles className="absolute inset-0" refresh={true} />
  
  <PageHero
    title="Skills"
    description="Technical skills and expertise"
  />
  
  {#if skills.categories && skills.categories.length > 0}
    <section class="skills-section">
      <div class="container">
        <div class="skills-categories">
          {#each skills.categories as category}
            <div class="skill-category">
              <h3 class="category-title">{category.name}</h3>
              <div class="skills-list">
                {#each category.skills as skill}
                  <div class="skill-item">
                    <div class="skill-header">
                      <span class="skill-name">{skill.name}</span>
                      {#if skill.years}
                        <span class="skill-years">{skill.years} {skill.years === 1 ? 'year' : 'years'}</span>
                      {/if}
                    </div>
                    {#if skill.description}
                      <p class="skill-description">{skill.description}</p>
                    {/if}
                    <div class="skill-level-bar">
                      <div 
                        class="skill-level-fill"
                        style="width: {getLevelWidth(skill.level)}; background: {getLevelColor(skill.level)};"
                      ></div>
                    </div>
                    <div class="skill-level-label">
                      <span class="level-text">{skill.level}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {:else}
    <section class="empty-section">
      <div class="container">
        <p class="empty-message">No skills data available yet. Check back soon!</p>
      </div>
    </section>
  {/if}
</div>

<style>
  .skills-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    position: relative;
    overflow-x: hidden;
  }

  /* Ensure particles are behind all content */
  :global(.skills-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  section {
    position: relative;
    z-index: 1;
  }

  .skills-section {
    padding: 4rem 1rem;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .skills-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .skill-category {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    position: relative;
    overflow: hidden;
  }

  .skill-category::before {
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

  .skill-category:hover::before {
    left: 100%;
  }

  .skill-category:hover {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 2px rgba(255, 255, 255, 0.15) inset;
  }

  .category-title {
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 1.5rem 0;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }

  .skills-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .skill-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .skill-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-foreground, #d0d0d0);
  }

  .skill-years {
    font-size: 0.75rem;
    color: var(--color-muted, #8b949e);
  }

  .skill-description {
    font-size: 0.875rem;
    color: var(--color-muted, #8b949e);
    margin: 0;
    line-height: 1.4;
  }

  .skill-level-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 0.25rem;
  }

  .skill-level-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
    box-shadow: 0 0 8px currentColor;
  }

  .skill-level-label {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.25rem;
  }

  .level-text {
    font-size: 0.75rem;
    color: var(--color-muted, #8b949e);
    text-transform: capitalize;
  }

  .empty-section {
    padding: 4rem 1rem;
  }

  .empty-message {
    text-align: center;
    color: var(--color-muted, #8b949e);
    font-size: 1.125rem;
  }

  @media (max-width: 768px) {
    .skills-categories {
      grid-template-columns: 1fr;
    }
  }
</style>
