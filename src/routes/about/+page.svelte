<script>
  import { MapPin, Briefcase, GraduationCap, Code } from 'lucide-svelte';
  import Particles from '$lib/animations/Particles.svelte';
  import BoxReveal from '$lib/animations/BoxReveal.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';

  export let data;

  $: siteConfig = data?.siteConfig;
  $: profile = siteConfig?.profile || {};
  $: experience = data?.experience || [];
  $: education = data?.education || [];
  $: skills = data?.skills || { categories: [] };

  $: topSkills = (skills.categories || [])
    .flatMap(c => c.skills || [])
    .filter(s => s.level === 'expert' || s.level === 'advanced')
    .slice(0, 8);
</script>

<SEO
  siteConfig={siteConfig}
  title="About"
  description={`About ${profile.name} - ${profile.bio}. Background, experience, and skills.`}
  keywords={['about', profile.name || '', 'background', 'experience', 'ML researcher', 'infrastructure engineer']}
  type="website"
  canonical={$page.url.pathname}
/>

<StructuredData siteConfig={siteConfig} type="Person" />
<StructuredData
  siteConfig={siteConfig}
  type="BreadcrumbList"
  breadcrumbs={[
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ]}
/>

<div class="about-page">
  <Particles className="absolute inset-0" refresh={true} quantity={200} />

  <!-- Hero -->
  <section class="hero-section">
    <div class="hero-content">
      <div class="avatar-wrapper">
        <img src={profile.avatarUrl || '/avatar.jpg'} alt={profile.name} class="avatar" />
      </div>
      <BoxReveal boxColor="#e0e0e0" duration={0.5}>
        <h1 class="hero-name">{profile.name}</h1>
      </BoxReveal>
      <p class="hero-bio">{profile.bio}</p>
      {#if profile.location}
        <div class="hero-location">
          <MapPin size={16} />
          <span>{profile.location}</span>
        </div>
      {/if}
    </div>
  </section>

  <!-- Narrative -->
  <section class="narrative-section">
    <div class="narrative-content">
      <h2 class="section-title">Background</h2>
      <div class="narrative-text">
        <p>
          I'm a Machine Learning Researcher and Infrastructure Engineer with experience building
          ML systems at scale. My work spans deep learning research, production ML infrastructure,
          and full-stack software engineering.
        </p>
        <p>
          I've worked across organizations from startups to large enterprises, contributing to
          ML pipelines, model optimization, and the infrastructure that powers intelligent systems.
        </p>
      </div>
    </div>
  </section>

  <!-- Experience Timeline -->
  {#if experience.length > 0}
    <section class="experience-section">
      <h2 class="section-title">Experience</h2>
      <div class="timeline">
        {#each experience as exp}
          <div class="timeline-item">
            <div class="timeline-marker">
              <Briefcase size={16} />
            </div>
            <div class="timeline-card">
              <h3 class="timeline-title">{exp.title}</h3>
              <p class="timeline-company">{exp.company}{exp.location ? ` \u2022 ${exp.location}` : ''}</p>
              {#if exp.type}
                <span class="timeline-badge">{exp.type}</span>
              {/if}
              {#if exp.description}
                <p class="timeline-description">{exp.description}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
      <div class="section-link">
        <a href="/portfolio/experience">View full experience &rarr;</a>
      </div>
    </section>
  {/if}

  <!-- Education -->
  {#if education.length > 0}
    <section class="education-section">
      <h2 class="section-title">Education</h2>
      <div class="education-grid">
        {#each education as edu}
          <div class="education-card">
            <div class="edu-icon">
              <GraduationCap size={24} />
            </div>
            <h3 class="edu-degree">{edu.degree || edu.title}</h3>
            <p class="edu-institution">{edu.institution || edu.company}</p>
            {#if edu.location}
              <p class="edu-location">{edu.location}</p>
            {/if}
            {#if edu.gpa}
              <p class="edu-gpa">GPA: {edu.gpa}</p>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Key Skills -->
  {#if topSkills.length > 0}
    <section class="skills-section">
      <h2 class="section-title">Key Skills</h2>
      <div class="skills-list">
        {#each topSkills as skill}
          <div class="skill-chip">
            <Code size={14} />
            <span>{skill.name}</span>
          </div>
        {/each}
      </div>
      <div class="section-link">
        <a href="/portfolio/skills">View all skills &rarr;</a>
      </div>
    </section>
  {/if}

  <!-- CTA -->
  <section class="cta-section">
    <h2 class="cta-title">Interested in working together?</h2>
    <div class="cta-buttons">
      <a href="/portfolio" class="btn btn-primary">View Portfolio</a>
      <a href="/portfolio/contact" class="btn btn-secondary">Get in Touch</a>
    </div>
  </section>
</div>

<style>
  .about-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  :global(.about-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  section {
    position: relative;
    z-index: 1;
    padding: 4rem 1rem;
    max-width: 900px;
    margin: 0 auto;
  }

  /* Hero */
  .hero-section {
    padding: 6rem 1rem 4rem;
    text-align: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  .avatar-wrapper {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-name {
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    line-height: 1.2;
  }

  .hero-bio {
    font-size: 1.25rem;
    color: var(--color-muted, #8b949e);
    margin: 0;
  }

  .hero-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-muted, #8b949e);
    font-size: 0.9rem;
  }

  /* Section Title */
  .section-title {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 2rem 0;
  }

  /* Narrative */
  .narrative-section {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .narrative-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .narrative-text p {
    font-size: 1.05rem;
    line-height: 1.8;
    color: var(--color-muted, #8b949e);
    margin: 0;
  }

  /* Experience Timeline */
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-left: 2rem;
    border-left: 2px solid rgba(255, 255, 255, 0.1);
  }

  .timeline-item {
    position: relative;
  }

  .timeline-marker {
    position: absolute;
    left: -2.75rem;
    top: 0.25rem;
    width: 28px;
    height: 28px;
    background: var(--color-background, #000000);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-muted, #8b949e);
  }

  .timeline-card {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.25rem;
    transition: border-color 0.2s ease;
  }

  .timeline-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .timeline-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-foreground, #d0d0d0);
    margin: 0 0 0.25rem 0;
  }

  .timeline-company {
    font-size: 0.9rem;
    color: var(--color-muted, #8b949e);
    margin: 0 0 0.5rem 0;
  }

  .timeline-badge {
    display: inline-block;
    font-size: 0.75rem;
    padding: 2px 8px;
    background: rgba(224, 224, 224, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    color: var(--color-muted, #8b949e);
    margin-bottom: 0.5rem;
  }

  .timeline-description {
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--color-muted, #8b949e);
    margin: 0.5rem 0 0 0;
  }

  /* Education */
  .education-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .education-card {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: border-color 0.2s ease;
  }

  .education-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .edu-icon {
    color: var(--color-muted, #8b949e);
    margin-bottom: 1rem;
  }

  .edu-degree {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-foreground, #d0d0d0);
    margin: 0 0 0.25rem 0;
  }

  .edu-institution {
    font-size: 0.95rem;
    color: var(--color-muted, #8b949e);
    margin: 0 0 0.25rem 0;
  }

  .edu-location {
    font-size: 0.85rem;
    color: var(--color-muted, #8b949e);
    margin: 0 0 0.25rem 0;
  }

  .edu-gpa {
    font-size: 0.85rem;
    color: var(--color-foreground, #d0d0d0);
    margin: 0.5rem 0 0 0;
    font-weight: 500;
  }

  /* Skills */
  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .skill-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.08) 0%, rgba(245, 245, 245, 0.05) 50%, rgba(224, 224, 224, 0.08) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 0.875rem;
    color: var(--color-foreground, #d0d0d0);
    transition: all 0.2s ease;
  }

  .skill-chip:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  /* Section Link */
  .section-link {
    margin-top: 1.5rem;
  }

  .section-link a {
    color: var(--color-muted, #8b949e);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
  }

  .section-link a:hover {
    color: var(--color-foreground, #d0d0d0);
  }

  /* CTA */
  .cta-section {
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 4rem;
  }

  .cta-title {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 2rem 0;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
  }

  .btn-primary {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-primary, #e0e0e0);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .btn-secondary:hover {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    .hero-name {
      font-size: 2.25rem;
    }

    .section-title,
    .cta-title {
      font-size: 1.5rem;
    }

    .timeline {
      padding-left: 1.5rem;
    }

    .timeline-marker {
      left: -2.25rem;
      width: 24px;
      height: 24px;
    }
  }
</style>
