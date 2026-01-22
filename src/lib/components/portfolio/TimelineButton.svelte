<script lang="ts">
  import { goto } from '$app/navigation';

  async function handleClick() {
    await goto('/timeline');
  }
</script>

<button class="timeline-button" on:click={handleClick} aria-label="View Timeline">
  <svg class="timeline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
  <span class="timeline-text">Timeline</span>
</button>

<style>
  .timeline-button {
    position: fixed !important;
    bottom: 2rem;
    right: 2rem;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50px;
    color: #000000;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1) inset;
    overflow: hidden;
  }

  .timeline-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(0, 0, 0, 0.05), 
      transparent
    );
    transition: left 0.5s;
    pointer-events: none;
  }

  .timeline-button:hover::before {
    left: 100%;
  }

  .timeline-button:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 2px rgba(0, 0, 0, 0.1) inset;
    color: #000000;
  }

  .timeline-button:active {
    transform: translateY(0);
  }

  .timeline-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  .timeline-button:hover .timeline-icon {
    transform: rotate(90deg);
  }

  .timeline-text {
    white-space: nowrap;
    letter-spacing: 0.05em;
  }

  /* Responsive: Show only icon on smaller screens */
  @media (max-width: 768px) {
    .timeline-button {
      padding: 1rem;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      justify-content: center;
    }

    .timeline-text {
      display: none;
    }

    .timeline-icon {
      width: 24px;
      height: 24px;
    }
  }

  /* Adjust position on smaller screens */
  @media (max-width: 480px) {
    .timeline-button {
      bottom: 1.5rem;
      right: 1.5rem;
    }
  }
</style>
