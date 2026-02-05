<script lang="ts">
  import { cn } from "$lib/utils";
  import { Github } from "lucide-svelte";
  import ProjectCard from "./portfolio/ProjectCard.svelte";

  let className: any = "";
  export { className as class };
  export let project: any;
  export let colSpan: number = 1; // For grid column span

  $: slug = project.markdownPath?.split('/').pop()?.replace('.md', '') || project.id;
  $: detailUrl = `/portfolio/projects/${slug}`;
  $: title = project.title || 'Untitled Project';
  $: description = project.description || '';
  $: technologies = project.technologies || [];
  $: githubUrl = project.githubUrl || '';
  $: category = project.category || '';
  $: date = project.date || '';
  $: status = project.status || '';
  $: tags = project.tags || [];
  $: descriptionLines = colSpan >= 2 ? 7 : 4;
  $: maxTags = colSpan >= 2 ? 5 : 3;
  $: maxTechBadges = colSpan >= 2 ? 8 : 4;
  
  // For larger cards, create extended description from content (just add 1-2 sentences)
  $: extendedDescription = colSpan >= 2 && project.content 
    ? extractExtendedDescription(project.content, project.description)
    : project.description;
  
  function extractExtendedDescription(content: string, baseDescription: string): string {
    if (!content) return baseDescription;
    
    // Try to extract first sentence or two from Overview section
    const overviewMatch = content.match(/## Overview\s*\n\n([\s\S]*?)(?=\n## |$)/);
    if (overviewMatch) {
      const overview = overviewMatch[1].trim();
      // Clean up markdown and HTML formatting thoroughly
      let cleaned = overview
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
        .replace(/\[([^\]]+)\]/g, '$1') // Remove remaining brackets
        .replace(/^[-*]\s+/gm, '') // Remove list markers
        .replace(/^\d+\.\s+/gm, '') // Remove numbered list markers
        .replace(/`([^`]+)`/g, '$1') // Remove code backticks
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\n{2,}/g, ' ') // Replace multiple newlines with space
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      // Extract just first 1-2 sentences (up to ~120 characters)
      const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
      const firstSentences = sentences.slice(0, 2).join(' ').substring(0, 120);
      
      if (firstSentences.length > 30) {
        return baseDescription + ' ' + firstSentences.trim();
      }
    }
    
    // Fallback: extract first sentence from first paragraph
    const firstPara = content.split('\n\n').find(p => 
      p.trim().length > 30 && 
      !p.startsWith('#') && 
      !p.startsWith('---') &&
      !p.match(/^[\*\-\d]/) &&
      !p.includes('##')
    );
    
    if (firstPara) {
      let cleaned = firstPara
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/#{1,6}\s+/g, '')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Get first sentence only
      const firstSentence = cleaned.match(/[^.!?]+[.!?]+/)?.[0] || cleaned.substring(0, 100);
      
      if (firstSentence.length > 30) {
        return baseDescription + ' ' + firstSentence.trim();
      }
    }
    
    return baseDescription;
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  }

  function handleCardClick() {
    window.location.href = detailUrl;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }

  function stopPropagation(e: Event) {
    e.stopPropagation();
  }
</script>

<div
  id={title}
  class={cn("bento-card", className)}
  style="grid-column: span {colSpan};"
  on:click={handleCardClick}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
>
  <div class="bento-content">
    <div class="bento-header">
      <div class="header-left">
        {#if category}
          <span class="category-badge">{category}</span>
        {/if}
        {#if status}
          <span class="status-badge" class:active={status.toLowerCase() === 'active'} class:completed={status.toLowerCase() === 'completed'}>
            {status}
          </span>
        {/if}
      </div>
      {#if date}
        <span class="date-badge">{formatDate(date)}</span>
      {/if}
    </div>

    <div class="bento-body">
      <h3 class="bento-title">{title}</h3>
      {#if extendedDescription}
        <p class="bento-description" style="-webkit-line-clamp: {descriptionLines}; line-clamp: {descriptionLines};">
          {extendedDescription}
        </p>
      {/if}
      {#if tags.length > 0}
        <div class="tags">
          {#each tags.slice(0, maxTags) as tag}
            <span class="tag">{tag}</span>
          {/each}
          {#if tags.length > maxTags}
            <span class="tag">+{tags.length - maxTags}</span>
          {/if}
        </div>
      {/if}
    </div>

    <div class="bento-footer">
      <div class="footer-content">
        {#if technologies.length > 0}
          <div class="tech-badges">
            {#each technologies.slice(0, maxTechBadges) as tech}
              <span class="tech-badge">{tech}</span>
            {/each}
            {#if technologies.length > maxTechBadges}
              <span class="tech-badge">+{technologies.length - maxTechBadges}</span>
            {/if}
          </div>
        {/if}
        {#if githubUrl}
          <a 
            href={githubUrl} 
            class="github-link" 
            on:click={stopPropagation} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Github size={20} />
          </a>
        {/if}
      </div>
    </div>
  </div>

  <div class="bento-overlay"></div>
</div>

<style>
  .bento-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    border-radius: 12px;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 1.5rem;
  }

  .bento-card:focus {
    outline: 2px solid rgba(255, 255, 255, 0.3);
    outline-offset: 2px;
  }

  .bento-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 
                0 0 2px rgba(255, 255, 255, 0.15) inset;
    border-color: rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
  }

  /* On tablets, limit to max 2 columns */
  @media (max-width: 1024px) {
    .bento-card[style*="span 3"] {
      grid-column: span 2 !important;
    }
  }

  /* On mobile, everything is 1 column */
  @media (max-width: 768px) {
    .bento-card {
      grid-column: span 1 !important;
    }
  }

  .bento-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
    min-height: 0;
  }

  .bento-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .category-badge {
    background: linear-gradient(135deg, rgba(88, 166, 255, 0.2) 0%, rgba(88, 166, 255, 0.1) 50%, rgba(88, 166, 255, 0.2) 100%);
    color: var(--accent-fg, #58a6ff);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    border: 1px solid rgba(88, 166, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: capitalize;
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.15) 0%, rgba(245, 245, 245, 0.1) 50%, rgba(224, 224, 224, 0.15) 100%);
    color: var(--color-muted, #8b949e);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .status-badge.active {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(34, 197, 94, 0.2) 100%);
    color: #22c55e;
    border-color: rgba(34, 197, 94, 0.3);
  }

  .status-badge.completed {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(59, 130, 246, 0.2) 100%);
    color: #3b82f6;
    border-color: rgba(59, 130, 246, 0.3);
  }

  .date-badge {
    color: var(--color-muted, #8b949e);
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .bento-footer {
    margin-top: auto;
    padding-top: 0;
    min-height: 2.5rem;
    display: flex;
    align-items: flex-end;
  }

  .footer-content {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    position: relative;
    width: 100%;
  }

  .github-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0.2), 0 0 1px rgba(255, 255, 255, 0.3) inset;
    transition: all 0.2s ease;
    text-decoration: none;
    flex-shrink: 0;
    margin-left: auto;
  }

  .github-link:hover {
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3), 0 0 2px rgba(255, 255, 255, 0.4) inset;
    transform: translateY(-1px);
  }

  .bento-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 0;
  }
  
  .bento-card[style*="span 2"] .bento-body,
  .bento-card[style*="span 3"] .bento-body {
    gap: 1rem;
  }

  .bento-title {
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    line-height: 1.2;
  }

  .bento-description {
    color: var(--color-foreground, #c9d1d9);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .tag {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.1) 0%, rgba(245, 245, 245, 0.05) 50%, rgba(224, 224, 224, 0.1) 100%);
    color: var(--color-muted, #8b949e);
    padding: 3px 8px;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 400;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .tech-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .tech-badge {
    background: linear-gradient(135deg, rgba(224, 224, 224, 0.15) 0%, rgba(245, 245, 245, 0.1) 50%, rgba(224, 224, 224, 0.15) 100%);
    color: var(--color-primary, #e0e0e0);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  .bento-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.03), 
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.5s;
    pointer-events: none;
  }

  .bento-card:hover .bento-overlay {
    transform: translateX(100%);
  }
</style>
