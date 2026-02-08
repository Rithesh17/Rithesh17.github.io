<script lang="ts">
  import { goto } from '$app/navigation';

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function handleResume() {
    window.open('/Resume_Rithesh_Kumar.pdf', '_blank');
    isOpen = false;
  }

  async function handleTimeline() {
    await goto('/timeline');
    isOpen = false;
  }

  // Close menu when clicking outside
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      isOpen = false;
    }
  }
</script>

<!-- Backdrop to close menu when clicking outside -->
{#if isOpen}
  <div class="backdrop" on:click={handleBackdropClick}></div>
{/if}

<div class="fab-container">
  <!-- Menu Options -->
  <div class="menu-options" class:open={isOpen}>
    <button class="menu-option" on:click={handleResume} aria-label="View Resume">
      <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <span class="menu-text">Resume</span>
    </button>
    <button class="menu-option" on:click={handleTimeline} aria-label="View Timeline">
      <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span class="menu-text">Timeline</span>
    </button>
  </div>

  <!-- Main FAB Button -->
  <button class="fab-button" on:click={toggleMenu} aria-label="Menu" class:open={isOpen}>
    <svg class="fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </button>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 9998;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .fab-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
  }

  .menu-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .menu-options.open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: all;
  }

  .menu-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50px;
    color: #000000;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1) inset;
    white-space: nowrap;
  }

  .menu-option:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 2px rgba(0, 0, 0, 0.1) inset;
  }

  .menu-option:active {
    transform: translateY(0);
  }

  .menu-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  .menu-option:hover .menu-icon {
    transform: scale(1.1);
  }

  .menu-text {
    letter-spacing: 0.05em;
  }

  .fab-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    padding: 0;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.85) 50%, rgba(99, 102, 241, 0.9) 100%);
    border: 1px solid rgba(99, 102, 241, 0.5);
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 6px 25px rgba(99, 102, 241, 0.4), 0 0 1px rgba(99, 102, 241, 0.3) inset;
    overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .fab-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
    pointer-events: none;
  }

  .fab-button:hover::before {
    left: 100%;
  }

  .fab-button:hover {
    transform: translateY(-2px) scale(1.05);
    background: linear-gradient(135deg, rgba(99, 102, 241, 1) 0%, rgba(139, 92, 246, 0.95) 50%, rgba(99, 102, 241, 1) 100%);
    border-color: rgba(99, 102, 241, 0.6);
    box-shadow: 0 10px 35px rgba(99, 102, 241, 0.5), 0 0 2px rgba(99, 102, 241, 0.4) inset;
  }

  .fab-button:active {
    transform: translateY(0) scale(1);
  }

  .fab-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fab-button.open {
    background: linear-gradient(135deg, rgba(99, 102, 241, 1) 0%, rgba(139, 92, 246, 0.95) 50%, rgba(99, 102, 241, 1) 100%);
    transform: rotate(45deg);
  }

  .fab-icon {
    width: 24px;
    height: 24px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }

  /* Stagger animation for menu options */
  .menu-options.open .menu-option:nth-child(1) {
    transition-delay: 0.05s;
  }

  .menu-options.open .menu-option:nth-child(2) {
    transition-delay: 0.1s;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .fab-container {
      bottom: 1.5rem;
      right: 1.5rem;
    }

    .menu-option {
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
    }

    .menu-icon {
      width: 18px;
      height: 18px;
    }

    .fab-button {
      width: 52px;
      height: 52px;
    }

    .fab-icon {
      width: 22px;
      height: 22px;
    }
  }

  @media (max-width: 480px) {
    .fab-container {
      bottom: 1rem;
      right: 1rem;
    }

    .menu-option {
      padding: 0.625rem 0.875rem;
    }

    .menu-text {
      font-size: 0.8rem;
    }
  }
</style>
