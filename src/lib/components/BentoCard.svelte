<script lang="ts">
  import { cn } from "$lib/utils";
  import { Github } from "lucide-svelte";
  import ProjectCard from "./portfolio/ProjectCard.svelte";

  let className: any = "";
  export { className as class };
  export let project: any;
  export let colSpan: number = 1; // For grid column span
  export let rowSpan: number = 1; // For grid row span

  // Bento mosaic shape, derived from the actual span rather than tracked
  // separately: hero (2x2) and tall (1x2) get full detail because they have
  // two rows of height to work with; wide (2x1) and small (1x1) stay
  // minimal because row height - not column width - is what limits how
  // much content actually fits without getting squeezed to nothing.
  $: shape = colSpan >= 2 && rowSpan >= 2 ? 'hero'
    : colSpan >= 2 ? 'wide'
    : rowSpan >= 2 ? 'tall'
    : 'small';
  $: isLarge = shape === 'hero'; // full-detail tier, kept for the extended-description hook below
  $: richContent = rowSpan >= 2; // hero or tall

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
  $: showDescription = true; // every card shows at least a line of what the project is
  $: descriptionLines = shape === 'hero' ? 3 : shape === 'tall' ? 4 : shape === 'wide' ? 2 : 1;
  $: maxTags = shape === 'hero' ? 5 : richContent ? 3 : (colSpan >= 2 ? 3 : 0);
  $: maxTechBadges = shape === 'hero' ? 6 : richContent ? 3 : 0;

  // For the hero card, create extended description from content (just add 1-2 sentences)
  $: extendedDescription = isLarge && project.content
    ? extractExtendedDescription(project.content, project.description)
    : project.description;
  
  function decodeHtmlEntities(text: string): string {
    return text
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ');
  }

  function extractExtendedDescription(content: string, baseDescription: string): string {
    if (!content) return baseDescription;

    // `content` here is pre-rendered HTML (e.g. "<h2>The Idea</h2><p>==...==</p>"),
    // not raw markdown. Drop whole heading elements (tag AND inner text) first,
    // so a heading title can never leak into the extracted excerpt.
    const withoutHeadings = content
      .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, '')
      // Also cover the markdown-source case (## Heading) in case this is ever raw markdown
      .split('\n')
      .filter(line => !/^\s*#{1,6}\s/.test(line))
      .join('\n');

    // Clean up markdown and HTML formatting thoroughly
    const cleaned = decodeHtmlEntities(withoutHeadings)
      .replace(/<[^>]+>/g, ' ') // Remove remaining HTML tags (as a space, so words don't run together)
      .replace(/==(.*?)==/g, '$1') // Remove highlight markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
      .replace(/\[([^\]]+)\]/g, '$1') // Remove remaining brackets
      .replace(/^[-*]\s+/gm, '') // Remove list markers
      .replace(/^\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/`([^`]+)`/g, '$1') // Remove code backticks
      .replace(/^---$/gm, '') // Remove frontmatter/rule dashes
      .replace(/\s+/g, ' ') // Collapse all whitespace/newlines to single spaces
      .trim();

    if (!cleaned) return baseDescription;

    // Take the first 1-2 real sentences as the excerpt
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    const excerpt = sentences.slice(0, 2).join(' ').trim().substring(0, 160).trim();

    if (excerpt.length > 30) {
      return baseDescription + ' ' + excerpt;
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
  class={cn("bento-card", `shape-${shape}`, className)}
  style="grid-column: span {colSpan}; grid-row: span {rowSpan};"
  on:click={handleCardClick}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
>
  <div class="bento-content">
    {#if !richContent}
      <!-- Wide/small cells are only ever one row tall, so they stay compact -
           like the module tiles in a real bento layout - but every card
           still gets at least one line saying what the project is. Wide
           gets a bit more room to also show tags. -->
      <div class="bento-header">
        {#if category}
          <span class="category-badge">{category}</span>
        {/if}
      </div>
      <div class="bento-body">
        <h3 class="bento-title">{title}</h3>
        {#if description}
          <p class="bento-description" style="-webkit-line-clamp: {descriptionLines}; line-clamp: {descriptionLines};">
            {description}
          </p>
        {/if}
        {#if maxTags > 0 && technologies.length > 0}
          <div class="tags">
            {#each technologies.slice(0, maxTags) as tech}
              <span class="tag">{tech}</span>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
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
        {#if showDescription && extendedDescription}
          <p class="bento-description" style="-webkit-line-clamp: {descriptionLines}; line-clamp: {descriptionLines};">
            {extendedDescription}
          </p>
        {/if}
        {#if maxTags > 0 && tags.length > 0}
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
    {/if}
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
    padding: 1.25rem;
  }

  .bento-card.shape-hero {
    padding: 1.75rem;
  }

  .bento-card.shape-small {
    padding: 1.1rem;
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


  /* Below the packer's assumed 3-column width, collapse to a single column.
     Must match BentoGrid's breakpoint (1024px). */
  @media (max-width: 1024px) {
    .bento-card {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
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
    gap: 0.5rem;
    min-height: 0;
    overflow: hidden;
  }

  .shape-hero .bento-body,
  .shape-tall .bento-body {
    gap: 0.85rem;
  }

  .bento-title {
    font-size: 1.05rem;
    font-weight: 600;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .shape-hero .bento-title {
    font-size: 1.5rem;
    line-height: 1.2;
  }

  .shape-small .bento-title {
    font-size: 0.95rem;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }

  .bento-description {
    color: var(--color-foreground, #c9d1d9);
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .shape-hero .bento-description {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.5rem;
    overflow: hidden;
    max-height: 1.75rem;
  }

  .shape-hero .tags,
  .shape-tall .tags {
    max-height: none;
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
