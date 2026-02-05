<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import RepoCard from '$lib/components/RepoCard.svelte';
  import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
  import ExperienceCard from '$lib/components/portfolio/ExperienceCard.svelte';
  import EducationCard from '$lib/components/portfolio/EducationCard.svelte';
  import ContributionGraph from '$lib/components/ContributionGraph.svelte';
  import Meteors from '$lib/animations/Meteors.svelte';
  import Typewriter from '$lib/animations/Typewriter.svelte';
  import BoxReveal from '$lib/animations/BoxReveal.svelte';
  import BentoGrid from '$lib/components/BentoGrid.svelte';
  import BentoCard from '$lib/components/BentoCard.svelte';
  import VerticalNav from '$lib/components/portfolio/VerticalNav.svelte';
  import TimelineButton from '$lib/components/portfolio/TimelineButton.svelte';
  import { MapPin, Mail, Phone, Github, Linkedin, Instagram } from 'lucide-svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';

  export let data;

  // Navigation sections for vertical nav - dynamically filter based on available content
  $: navSections = [
    { id: 'hero', label: 'Home' },
    { id: 'stats', label: 'Stats' },
    ...(experience.length > 0 ? [{ id: 'experience', label: 'Experience' }] : []),
    ...(education.length > 0 ? [{ id: 'education', label: 'Education' }] : []),
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  const taglinePhrases = ['FOUNDING ENGINEER', 'AI RESEARCHER', 'ML SYSTEMS BUILDER'];

  $: siteConfig = data?.siteConfig;
  $: profile = data?.profile || data?.siteConfig?.profile || {
    name: 'Rithesh',
    username: 'Rithesh17',
    avatarUrl: '/avatar.jpg',
    bio: 'Software Developer'
  };
  $: features = data?.features || { showExperience: false, showMacScreen: false };
  $: contact = siteConfig?.contact || {};
  $: social = siteConfig?.social || {};
  $: address = contact?.address || {};
  $: repositories = data?.repositories || [];
  $: projects = data?.projects || [];
  $: experience = data?.experience || [];
  $: education = data?.education || [];
  $: skills = data?.skills || { categories: [] };
  $: contributions = data?.contributions || null;
  $: allTechnologies = [...new Set(projects.flatMap((p: any) => p.technologies || []))];

  // Featured projects (filter by featured flag, sort by order, then take first 6) with bento grid layout
  $: featuredProjects = projects
    .filter((p: any) => p.featured === true)
    .sort((a: any, b: any) => (a.order || 999) - (b.order || 999));
  $: allProjects = featuredProjects.slice(0, 6).map((project: any, index: number) => {
    // Alternate column spans for visual variety
    let colSpan = 1;
    if (index === 0) colSpan = 2; // First project spans 2 columns
    else if (index === 1) colSpan = 1; // Second spans 1
    else if (index === 2) colSpan = 1; // Third spans 1
    else if (index === 3) colSpan = 2; // Fourth spans 2
    else if (index === 4) colSpan = 1; // Fifth spans 1
    else if (index === 5) colSpan = 1; // Sixth spans 1
    
    return { ...project, colSpan };
  });

  // Current and previous experience
  $: currentExperience = experience.find((e: any) => e.current || e.endDate === null) || experience[0];
  $: previousExperience = experience.filter((e: any) => e !== currentExperience).slice(0, 2);

  // Education (most recent first)
  $: recentEducation = education.slice(0, 2);

  // Generate contribution data if not available
  function generateContributions() {
    if (contributions) return contributions;
    const days = [];
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    let total = 0;

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const chance = Math.random();
      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (chance > 0.8) {
        count = Math.floor(Math.random() * 10) + 5;
        level = 4;
      } else if (chance > 0.6) {
        count = Math.floor(Math.random() * 5) + 3;
        level = 3;
      } else if (chance > 0.4) {
        count = Math.floor(Math.random() * 3) + 1;
        level = 2;
      } else if (chance > 0.2) {
        count = 1;
        level = 1;
      }

      total += count;
      days.push({
        date: d.toISOString().split('T')[0],
        count,
        level
      });
    }

    return {
      year: today.getFullYear(),
      total,
      days
    };
  }

  $: CONTRIBUTION_DATA = generateContributions();

  // Function to get number of dots based on skill level
  function getLevelDots(level: string): number {
    switch (level) {
      case 'expert':
        return 4;
      case 'advanced':
        return 3;
      case 'intermediate':
        return 2;
      case 'beginner':
      default:
        return 1;
    }
  }
</script>

<SEO
	siteConfig={siteConfig}
	title="Portfolio"
	description={`${profile.bio || `${profile.name}'s portfolio`}. ${projects.length} projects, ${experience.length} work experiences, ${education.length} education entries. ${skills.categories?.length || 0} skill categories.`}
	keywords={['portfolio', 'projects', 'experience', 'education', 'skills', profile.name || '', ...allTechnologies.slice(0, 10)]}
	type="website"
	canonical={$page.url.pathname}
/>

<StructuredData siteConfig={siteConfig} type="Person" />

<StructuredData 
	siteConfig={siteConfig}
	type="BreadcrumbList"
	breadcrumbs={[
		{ name: 'Home', url: '/' },
		{ name: 'Portfolio', url: '/portfolio' }
	]}
/>

<div class="portfolio-page">
  <!-- Vertical Navigation -->
  <VerticalNav sections={navSections} />
  
  <!-- Floating Timeline Button -->
  <TimelineButton />
  
  <!-- Meteors Background Effect -->
  <Meteors number={60} />

  <!-- Hero / Intro Section -->
  <section id="hero" class="hero-section">
    <div class="hero-content">
      <div class="hero-text">
        <BoxReveal boxColor="#e0e0e0" duration={0.5}>
          <h1 class="hero-title">Hi, I'm <span class="highlight">{profile.name}</span></h1>
        </BoxReveal>
        <p class="hero-bio">
          <Typewriter phrases={taglinePhrases} deletingSpeed={50} />
        </p>
        <div class="hero-cta">
          <a href="/portfolio/projects" class="btn btn-primary">View Projects</a>
          <a href="/portfolio/experience" class="btn btn-secondary">View Experience</a>
        </div>
      </div>
      <div class="hero-sidebar">
        <Sidebar {profile} contributionData={CONTRIBUTION_DATA} />
      </div>
    </div>
  </section>

  <!-- Highlights / Stats Section -->
  <section id="stats" class="stats-section">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{experience.length}+</div>
        <div class="stat-label">Experience</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{education.length}</div>
        <div class="stat-label">Degrees</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{projects.length}+</div>
        <div class="stat-label">Projects</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{skills.categories?.length || 0}+</div>
        <div class="stat-label">Skill Areas</div>
      </div>
    </div>
  </section>

  <!-- Experience Snapshot Section -->
  {#if experience.length > 0}
    <section id="experience" class="experience-section">
      <div class="section-header">
        <h2 class="section-title">Experience</h2>
        <p class="section-subtitle">Professional work experience and roles</p>
      </div>
      <div class="experience-list">
        {#if currentExperience}
          <div class="experience-main">
            <ExperienceCard experience={currentExperience} />
          </div>
        {/if}
        {#if previousExperience.length > 0}
          <div class="experience-secondary">
            {#each previousExperience as exp}
              <ExperienceCard experience={exp} />
            {/each}
          </div>
        {/if}
      </div>
      <div class="section-footer">
        <a href="/portfolio/experience" class="btn btn-outline">See All Experience →</a>
      </div>
    </section>
  {/if}

  <!-- Education Snapshot Section -->
  {#if education.length > 0}
    <section id="education" class="education-section">
      <div class="section-header">
        <h2 class="section-title">Education</h2>
        <p class="section-subtitle">Educational background and achievements</p>
      </div>
      <div class="education-grid">
        {#each recentEducation as edu}
          <EducationCard education={edu} />
        {/each}
      </div>
      <div class="section-footer">
        <a href="/portfolio/education" class="btn btn-outline">See All Education →</a>
      </div>
    </section>
  {/if}

  <!-- Featured Projects Section -->
  <section id="projects" class="projects-section">
    <div class="section-header">
      <h2 class="section-title">Featured Projects</h2>
      <p class="section-subtitle">
        {#if allProjects.length > 0}
          Selected work showcasing my skills and experience
        {:else}
          Projects will be added here soon.
        {/if}
      </p>
    </div>
    {#if allProjects.length > 0}
      <BentoGrid>
        {#each allProjects as project}
          <BentoCard {project} colSpan={project.colSpan || 1} />
        {/each}
      </BentoGrid>
    {/if}
    <div class="section-footer">
      <a href="/portfolio/projects" class="btn btn-outline">See All Projects →</a>
    </div>
  </section>

  <!-- Skills & Tools Overview Section -->
  <section id="skills" class="skills-section">
    <div class="section-header">
      <h2 class="section-title">Skills & Tools</h2>
      <p class="section-subtitle">Technologies I work with</p>
    </div>
    <div class="skills-container">
      {#each (skills.categories || []).slice(0, 6) as category}
        <div class="skill-category-card">
          <div class="category-header">
            <h3 class="category-title">{category.name}</h3>
            <span class="category-count">{Math.min(category.skills?.length || 0, 4)}</span>
          </div>
          <div class="skills-grid">
            {#each (category.skills || []).slice(0, 4) as skill}
              <div class="skill-item" data-level={skill.level || 'beginner'}>
                <div class="skill-content">
                  <span class="skill-name">{skill.name}</span>
                  {#if skill.years}
                    <span class="skill-years">{skill.years}y</span>
                  {/if}
                </div>
                <div class="skill-level-indicator">
                  {#each Array(4) as _, i}
                    <div class="skill-level-dot" class:filled={i < getLevelDots(skill.level || 'beginner')}></div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
    <div class="section-footer">
      <a href="/portfolio/skills" class="btn btn-outline">See Detailed Skills →</a>
    </div>
  </section>

  <!-- Contact / Footer CTA Section -->
  <section id="contact" class="contact-section">
    <div class="contact-content">
      <h2 class="contact-title">Let's Work Together!</h2>
      <p class="contact-subtitle">I'm always open to discussing new opportunities and interesting projects</p>
      <div class="contact-list">
        {#if contact.email}
          <a href="mailto:{contact.email}" class="contact-link">
            <Mail size={16} />
            <span>{contact.email}</span>
          </a>
        {/if}
        {#if contact.phone}
          <a href="tel:{contact.phone.replace(/[\s-]/g, '')}" class="contact-link">
            <Phone size={16} />
            <span>{contact.phone}</span>
          </a>
        {/if}
        {#if address.street || address.city}
          <div class="contact-link">
            <MapPin size={16} />
            <span>{[address.street, address.city].filter(Boolean).join(', ')}</span>
          </div>
        {/if}
        {#if social.github}
          <a href={social.github} target="_blank" rel="noopener noreferrer" class="contact-link">
            <Github size={16} />
            <span>{profile.username || 'GitHub'}</span>
          </a>
        {/if}
        {#if social.linkedin}
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer" class="contact-link">
            <Linkedin size={16} />
            <span>LinkedIn</span>
          </a>
        {/if}
        {#if social.instagram}
          <a href={social.instagram} target="_blank" rel="noopener noreferrer" class="contact-link">
            <Instagram size={16} />
            <span>Instagram</span>
          </a>
        {/if}
      </div>
    </div>
  </section>
</div>

<style>
  .portfolio-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    position: relative;
    overflow-x: hidden;
    overflow-y: visible;
  }

  /* Ensure meteors are behind all content */
  :global(.meteors-container) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  /* Ensure all sections are above meteors */
  section {
    position: relative;
    z-index: 1;
  }

  /* Hero Section */
  .hero-section {
    padding: 4rem 1rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .hero-content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 3rem;
    align-items: center;
  }

  @media (max-width: 1024px) {
    .hero-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .hero-text {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
  }

  .highlight {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }

  .hero-bio {
    font-size: 1.25rem;
    color: var(--color-muted, #8b949e);
    line-height: 1.6;
    margin: 0;
    font-family: 'Courier New', Courier, monospace;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .hero-sidebar {
    display: flex;
    justify-content: center;
  }

  /* Stats Section */
  .stats-section {
    padding: 3rem 1rem;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .stat-card {
    text-align: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    position: relative;
    overflow: hidden;
  }
  
  .stat-card::before {
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
  
  .stat-card:hover::before {
    left: 100%;
  }
  
  .stat-card:hover {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 2px rgba(255, 255, 255, 0.15) inset;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--color-muted, #8b949e);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Common Section Styles */
  section {
    padding: 4rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
  }

  .section-subtitle {
    font-size: 1.1rem;
    color: var(--color-muted, #8b949e);
    margin: 0;
  }

  .section-footer {
    text-align: center;
    margin-top: 3rem;
  }

  /* Projects Section - Bento Grid handled by component */

  /* Experience Section */
  .experience-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .experience-main {
    margin-bottom: 1rem;
  }

  .experience-secondary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  /* Education Section */
  .education-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  /* Skills Section */
  .skills-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .skill-category-card {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .skill-category-card::before {
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
  
  .skill-category-card:hover::before {
    left: 100%;
  }
  
  .skill-category-card:hover {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 2px rgba(255, 255, 255, 0.15) inset;
    transform: translateY(-2px);
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .category-title {
    font-size: 1.125rem;
    font-weight: 600;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }

  .category-count {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.15) 0%, rgba(245, 245, 245, 0.1) 50%, rgba(224, 224, 224, 0.15) 100%);
    color: var(--color-primary, #e0e0e0);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .skill-item {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.08) 0%, rgba(245, 245, 245, 0.05) 50%, rgba(224, 224, 224, 0.08) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .skill-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, currentColor, transparent);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .skill-item[data-level="expert"]::before {
    background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  }

  .skill-item[data-level="advanced"]::before {
    background: linear-gradient(90deg, transparent, rgba(224, 224, 224, 0.8), transparent);
  }

  .skill-item[data-level="intermediate"]::before {
    background: linear-gradient(90deg, transparent, rgba(224, 224, 224, 0.6), transparent);
  }

  .skill-item[data-level="beginner"]::before {
    background: linear-gradient(90deg, transparent, rgba(224, 224, 224, 0.4), transparent);
  }

  .skill-item:hover {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.15) 0%, rgba(245, 245, 245, 0.1) 50%, rgba(224, 224, 224, 0.15) 100%);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }

  .skill-item:hover::before {
    opacity: 1;
  }

  .skill-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .skill-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-foreground, #d0d0d0);
    flex: 1;
  }

  .skill-years {
    font-size: 0.7rem;
    color: var(--color-muted, #8b949e);
    background: rgba(255, 255, 255, 0.05);
    padding: 2px 6px;
    border-radius: 6px;
    font-weight: 500;
  }

  .skill-level-indicator {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .skill-level-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;
  }

  .skill-level-dot.filled {
    background: #e0e0e0;
    border-color: rgba(224, 224, 224, 0.3);
    box-shadow: 0 0 4px rgba(224, 224, 224, 0.4);
  }

  /* Repositories Section */
  .repos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  /* Contact Section */
  .contact-section {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 4rem 2rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    width: 100%;
    max-width: 100%;
  }

  .contact-content {
    text-align: center;
    max-width: 100%;
    margin: 0 auto;
    width: 100%;
  }

  .contact-title {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 1rem 0;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
  }

  .contact-subtitle {
    font-size: 1.1rem;
    color: var(--color-muted, #8b949e);
    margin: 0 0 2.5rem 0;
  }

  .contact-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
  }

  .contact-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-foreground, #d0d0d0);
    text-decoration: none;
    font-size: 0.8rem;
    transition: color 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .contact-link:hover {
    color: var(--color-primary, #e0e0e0);
  }

  .contact-link :global(svg) {
    color: var(--color-muted, #8b949e);
    transition: color 0.2s ease;
  }

  .contact-link:hover :global(svg) {
    color: var(--color-primary, #e0e0e0);
  }

  /* Buttons */
  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
  }

  .btn-primary {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 15px rgba(255, 255, 255, 0.2), 0 0 1px rgba(255, 255, 255, 0.3) inset;
    position: relative;
    overflow: hidden;
  }
  
  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.3), 
      transparent
    );
    transition: left 0.3s;
  }
  
  .btn-primary:hover::before {
    left: 100%;
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3), 0 0 2px rgba(255, 255, 255, 0.4) inset;
  }

  .btn-secondary {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.1) 0%, rgba(245, 245, 245, 0.05) 50%, rgba(224, 224, 224, 0.1) 100%);
    color: var(--color-primary, #e0e0e0);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
    position: relative;
    overflow: hidden;
  }
  
  .btn-secondary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent
    );
    transition: left 0.3s;
  }
  
  .btn-secondary:hover::before {
    left: 100%;
  }

  .btn-secondary:hover {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2), 0 0 2px rgba(255, 255, 255, 0.3) inset;
  }

  .btn-outline {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.1) 0%, rgba(245, 245, 245, 0.05) 50%, rgba(224, 224, 224, 0.1) 100%);
    color: var(--color-primary, #e0e0e0);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
    position: relative;
    overflow: hidden;
  }
  
  .btn-outline::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent
    );
    transition: left 0.3s;
  }
  
  .btn-outline:hover::before {
    left: 100%;
  }

  .btn-outline:hover {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2), 0 0 2px rgba(255, 255, 255, 0.3) inset;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .repos-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
