<script>
  export let sectionName = 'Section';
  export let estimatedDate = null;
  export let showSignup = false;
</script>

<div class="under-development">
  <div class="content">
    <div class="icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    </div>
    <h1 class="title">Coming Soon</h1>
    <p class="message">
      The {sectionName} section is currently under development.
    </p>
    {#if estimatedDate}
      <p class="date">Expected launch: {estimatedDate}</p>
    {/if}
    {#if showSignup}
      <div class="signup">
        <p>Want to be notified when it's ready?</p>
        <input type="email" placeholder="Enter your email" />
        <button>Notify Me</button>
      </div>
    {/if}
    <a href="/" class="back-link">← Back to Home</a>
  </div>
</div>

<style>
  .under-development {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
  }

  .content {
    text-align: center;
    max-width: 500px;
  }

  .icon {
    color: var(--color-primary, #58a6ff);
    margin-bottom: 2rem;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--color-foreground, #c9d1d9);
  }

  .message {
    font-size: 1.125rem;
    color: var(--color-muted, #8b949e);
    margin-bottom: 1rem;
  }

  .date {
    font-size: 0.875rem;
    color: var(--color-muted, #8b949e);
    margin-bottom: 2rem;
  }

  .signup {
    margin: 2rem 0;
    padding: 1.5rem;
    background: var(--color-card, #161b22);
    border: 1px solid var(--color-border, #30363d);
    border-radius: 8px;
  }

  .signup input {
    width: 100%;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid var(--color-border, #30363d);
    border-radius: 6px;
    background: var(--color-background, #0d1117);
    color: var(--color-foreground, #c9d1d9);
    font-size: 0.875rem;
  }

  .signup button {
    width: 100%;
    padding: 0.75rem;
    margin-top: 0.5rem;
    background: var(--color-primary, #58a6ff);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
  }

  .signup button:hover {
    background: var(--color-primary-hover, #4493f8);
  }

  .back-link {
    display: inline-block;
    margin-top: 2rem;
    color: var(--color-primary, #58a6ff);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: var(--color-primary-hover, #4493f8);
    text-decoration: underline;
  }
</style>
