<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import RepoCard from '$lib/components/RepoCard.svelte';
  import TimelineWidget from '$lib/components/TimelineWidget.svelte';
  import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
  import ExperienceCard from '$lib/components/portfolio/ExperienceCard.svelte';
  import EducationCard from '$lib/components/portfolio/EducationCard.svelte';
  import ContributionGraph from '$lib/components/ContributionGraph.svelte';
  import Meteors from '$lib/animations/Meteors.svelte';
  import Typewriter from '$lib/animations/Typewriter.svelte';

  export let data;

  const taglinePhrases = ['SOFTWARE ENGINEER', 'AI RESEARCHER', 'ML INFRA DEVELOPER'];

  $: profile = data?.profile || data?.siteConfig?.profile || {
    name: 'Rithesh',
    username: 'Rithesh17',
    avatarUrl: '/avatar.jpg',
    bio: 'Software Developer'
  };
  $: features = data?.features || { showExperience: false, showMacScreen: false };
  $: repositories = data?.repositories || [];
  $: projects = data?.projects || [];
  $: experience = data?.experience || [];
  $: education = data?.education || [];
  $: skills = data?.skills || { categories: [] };
  $: contributions = data?.contributions || null;

  // Featured projects (first 6)
  $: allProjects = projects.slice(0, 6);

  // Current and previous experience
  $: currentExperience = experience.find(e => e.current || e.endDate === null) || experience[0];
  $: previousExperience = experience.filter(e => e !== currentExperience).slice(0, 2);

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
</script>

<svelte:head>
  <title>{profile.name} - Portfolio</title>
  <meta name="description" content={profile.bio || `${profile.name}'s portfolio`} />
</svelte:head>

<div class="portfolio-page">
  <!-- Meteors Background Effect -->
  <Meteors number={40} />

  <!-- Hero / Intro Section -->
  <section id="hero" class="hero-section">
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">Hi, I'm <span class="highlight">{profile.name}</span></h1>
        <p class="hero-bio">
          <Typewriter phrases={taglinePhrases} deletingSpeed={50} />
        </p>
        <div class="hero-cta">
          <a href="#projects" class="btn btn-primary">View Projects</a>
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
        <div class="stat-value">{repositories.length}+</div>
        <div class="stat-label">Repositories</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{CONTRIBUTION_DATA.total}</div>
        <div class="stat-label">Contributions</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{projects.length}+</div>
        <div class="stat-label">Projects</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{experience.length}+</div>
        <div class="stat-label">Experience</div>
      </div>
    </div>
  </section>

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
      <div class="projects-grid">
        {#each allProjects as project}
          <ProjectCard {project} />
        {/each}
      </div>
    {/if}
    <div class="section-footer">
      <a href="/portfolio/projects" class="btn btn-outline">See All Projects →</a>
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

  <!-- Skills & Tools Overview Section -->
  <section id="skills" class="skills-section">
    <div class="section-header">
      <h2 class="section-title">Skills & Tools</h2>
      <p class="section-subtitle">Technologies I work with</p>
    </div>
    <div class="skills-categories">
      {#each skills.categories || [] as category}
        <div class="skill-category">
          <h3 class="category-title">{category.name}</h3>
          <div class="skill-tags">
            {#each category.skills || [] as skill}
              <span class="skill-tag">{skill.name}</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
    <div class="section-footer">
      <a href="/portfolio/skills" class="btn btn-outline">See Detailed Skills →</a>
    </div>
  </section>

  <!-- GitHub Repositories Section -->
  {#if repositories.length > 0}
    <section id="repositories" class="repositories-section">
      <div class="section-header">
        <h2 class="section-title">Open Source & Public Work</h2>
        <p class="section-subtitle">A live view of my GitHub activity and repositories</p>
      </div>
      <div class="repos-grid">
        {#each repositories.slice(0, 6) as repo}
          <RepoCard {repo} />
        {/each}
      </div>
      <div class="section-footer">
        <a href="/repositoriespage" class="btn btn-outline">View All Repositories →</a>
      </div>
    </section>
  {/if}

  <!-- Timeline Teaser Section -->
  <section id="timeline" class="timeline-section">
    <div class="section-header">
      <h2 class="section-title">Interactive Timeline</h2>
      <p class="section-subtitle">See how my projects, experience, and education connect over time</p>
    </div>
    <div class="timeline-teaser">
      <div class="timeline-preview">
        {#if features.showExperience}
          <TimelineWidget items={experience.slice(0, 3).map(e => ({
            type: 'work',
            title: e.company,
            role: e.title,
            date: `${new Date(e.startDate).getFullYear()} - ${e.current ? 'Present' : new Date(e.endDate).getFullYear()}`,
            color: '#e0e0e0'
          }))} />
        {:else}
          <div class="timeline-placeholder">
            <p>3D Interactive Timeline</p>
            <p class="placeholder-subtitle">Explore my journey in an immersive 3D experience</p>
          </div>
        {/if}
      </div>
    </div>
    <div class="section-footer">
      <a href="/timeline" class="btn btn-primary">Explore Interactive Timeline →</a>
    </div>
  </section>

  <!-- Contact / Footer CTA Section -->
  <section id="contact" class="contact-section">
    <div class="contact-content">
      <h2 class="contact-title">Let's Work Together</h2>
      <p class="contact-subtitle">I'm always open to discussing new opportunities and interesting projects</p>
      <div class="contact-links">
        {#if profile.email}
          <a href="mailto:{profile.email}" class="contact-link">
            <span class="contact-icon">✉️</span>
            <span>{profile.email}</span>
          </a>
        {/if}
        {#if profile.linkedin}
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" class="contact-link">
            <span class="contact-icon">💼</span>
            <span>LinkedIn</span>
          </a>
        {/if}
        {#if profile.website}
          <a href={profile.website} target="_blank" rel="noopener noreferrer" class="contact-link">
            <span class="contact-icon">🌐</span>
            <span>Website</span>
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

  /* Projects Section */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

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
  .skills-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
    font-size: 1.25rem;
    font-weight: 600;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 1rem 0;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }

  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skill-tag {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.15) 0%, rgba(245, 245, 245, 0.1) 50%, rgba(224, 224, 224, 0.15) 100%);
    color: var(--color-primary, #e0e0e0);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  /* Repositories Section */
  .repos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  /* Timeline Section */
  .timeline-teaser {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    position: relative;
    overflow: hidden;
  }
  
  .timeline-teaser::before {
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
  
  .timeline-teaser:hover::before {
    left: 100%;
  }

  .timeline-placeholder {
    text-align: center;
    color: var(--color-muted, #8b949e);
  }

  .placeholder-subtitle {
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  /* Contact Section */
  .contact-section {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 4rem 1rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }

  .contact-content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
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
    margin: 0 0 2rem 0;
  }

  .contact-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .contact-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-foreground, #d0d0d0);
    text-decoration: none;
    font-size: 1.1rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    transition: all 0.2s;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
    position: relative;
    overflow: hidden;
  }
  
  .contact-link::before {
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
  
  .contact-link:hover::before {
    left: 100%;
  }

  .contact-link:hover {
    border-color: rgba(255, 255, 255, 0.2);
    color: var(--color-primary, #e0e0e0);
    transform: translateY(-2px);
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), 0 0 2px rgba(255, 255, 255, 0.1) inset;
  }

  .contact-icon {
    font-size: 1.25rem;
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

    .projects-grid,
    .repos-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
