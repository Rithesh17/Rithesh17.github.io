<script lang="ts">
  function handleClick() {
    window.open('/Resume_Rithesh_Kumar.pdf', '_blank');
  }
</script>

<button class="resume-button" on:click={handleClick} aria-label="View Resume">
  <svg class="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
</button>

<style>
  .resume-button {
    position: fixed !important;
    bottom: 6rem;
    right: 2rem;
    z-index: 9998;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.25) 50%, rgba(99, 102, 241, 0.3) 100%);
    border: 1px solid rgba(99, 102, 241, 0.4);
    color: rgba(99, 102, 241, 0.95);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3), 0 0 1px rgba(99, 102, 241, 0.2) inset;
    overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .resume-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(99, 102, 241, 0.1), 
      transparent
    );
    transition: left 0.5s;
    pointer-events: none;
  }

  .resume-button:hover::before {
    left: 100%;
  }

  .resume-button:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.35) 50%, rgba(99, 102, 241, 0.4) 100%);
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4), 0 0 2px rgba(99, 102, 241, 0.3) inset;
    color: rgba(99, 102, 241, 1);
  }

  .resume-button:active {
    transform: translateY(0);
  }

  .resume-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  .resume-button:hover .resume-icon {
    transform: scale(1.1);
  }

  /* Adjust position on smaller screens */
  @media (max-width: 480px) {
    .resume-button {
      bottom: 5.5rem;
      right: 1.5rem;
      width: 48px;
      height: 48px;
      padding: 0.875rem;
    }

    .resume-icon {
      width: 20px;
      height: 20px;
    }
  }
</style>
