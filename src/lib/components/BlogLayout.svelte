<script lang="ts">
  import { ContentBody } from 'statue-ssg';
  
  export let title: string;
  export let description: string = '';
  export let content: string = '';
  export let metadata: Array<{ label: string; value: string }> = [];
  export let tags: string[] = [];
  export let backUrl: string;
  export let backLabel: string;
  export let actions: Array<{ label: string; href: string; icon?: string }> = [];
</script>

<article class="blog-article">
  <header class="article-header">
    <nav class="article-nav">
      <a href={backUrl} class="back-link">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        {backLabel}
      </a>
    </nav>
    
    <h1 class="article-title">{title}</h1>
    
    {#if description}
      <p class="article-description">{description}</p>
    {/if}
    
    {#if metadata.length > 0}
      <div class="article-meta">
        {#each metadata as item}
          <div class="meta-item">
            <span class="meta-label">{item.label}</span>
            <span class="meta-value">{item.value}</span>
          </div>
        {/each}
      </div>
    {/if}
    
    {#if tags.length > 0}
      <div class="article-tags">
        {#each tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
    
    {#if actions.length > 0}
      <div class="article-actions">
        {#each actions as action}
          <a href={action.href} class="action-btn" target="_blank" rel="noopener noreferrer">
            {#if action.icon === 'github'}
              <svg class="icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
              </svg>
            {:else if action.icon === 'external'}
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            {/if}
            {action.label}
          </a>
        {/each}
      </div>
    {/if}
  </header>
  
  {#if content}
    <div class="article-content">
      <ContentBody content={content} />
    </div>
  {/if}
  
  <footer class="article-footer">
    <a href={backUrl} class="back-link">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      {backLabel}
    </a>
  </footer>
</article>

<style>
  .blog-article {
    max-width: 850px;
    margin: 0 auto;
    padding: 2rem 1rem;
    color: var(--color-foreground, #d0d0d0);
  }
  
  .article-header {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .article-nav {
    margin-bottom: 2rem;
  }
  
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-muted, #8b949e);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
  }
  
  .back-link:hover {
    color: var(--color-foreground, #d0d0d0);
  }
  
  .back-link .icon {
    width: 18px;
    height: 18px;
  }
  
  .article-title {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .article-description {
    font-size: 1.25rem;
    line-height: 1.6;
    color: var(--color-muted, #8b949e);
    margin: 0 0 1.5rem 0;
  }
  
  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }
  
  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .meta-label {
    color: var(--color-muted, #8b949e);
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
  
  .meta-value {
    color: var(--color-foreground, #d0d0d0);
  }
  
  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .tag {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--color-foreground, #d0d0d0);
  }
  
  .article-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--color-foreground, #d0d0d0);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  .action-btn .icon {
    width: 18px;
    height: 18px;
  }
  
  .article-content {
    line-height: 1.8;
    font-size: 1.125rem;
    color: var(--color-foreground, #d0d0d0);
  }
  
  .article-content :global(h1),
  .article-content :global(h2),
  .article-content :global(h3),
  .article-content :global(h4) {
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-foreground, #e0e0e0);
  }
  
  .article-content :global(h1) {
    font-size: 2rem;
  }
  
  .article-content :global(h2) {
    font-size: 1.75rem;
  }
  
  .article-content :global(h3) {
    font-size: 1.5rem;
  }
  
  .article-content :global(h4) {
    font-size: 1.25rem;
  }
  
  .article-content :global(p) {
    margin-bottom: 1.5rem;
    color: var(--color-foreground, #c9d1d9);
  }
  
  .article-content :global(ul),
  .article-content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }
  
  .article-content :global(li) {
    margin-bottom: 0.75rem;
    color: var(--color-foreground, #c9d1d9);
  }
  
  .article-content :global(blockquote) {
    margin: 2rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0 8px 8px 0;
    color: var(--color-muted, #8b949e);
    font-style: italic;
  }
  
  .article-content :global(code) {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: 'Courier New', monospace;
  }
  
  .article-content :global(pre) {
    background: rgba(0, 0, 0, 0.4);
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2rem 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .article-content :global(pre code) {
    background: none;
    padding: 0;
    font-size: 0.9rem;
  }
  
  .article-content :global(a) {
    color: var(--color-primary, #e0e0e0);
    text-decoration: underline;
    text-decoration-color: rgba(224, 224, 224, 0.3);
    transition: text-decoration-color 0.2s ease;
  }
  
  .article-content :global(a:hover) {
    text-decoration-color: rgba(224, 224, 224, 0.6);
  }
  
  .article-content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2rem 0;
  }
  
  .article-content :global(hr) {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 3rem 0;
  }
  
  .article-footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    .blog-article {
      padding: 1.5rem 1rem;
    }
    
    .article-title {
      font-size: 2rem;
    }
    
    .article-description {
      font-size: 1.125rem;
    }
    
    .article-content {
      font-size: 1rem;
    }
    
    .article-meta {
      flex-direction: column;
      gap: 1rem;
    }
    
    .article-actions {
      flex-direction: column;
    }
    
    .action-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
