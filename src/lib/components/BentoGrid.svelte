<script lang="ts">
  import { cn } from "$lib/utils";
  let className: any = "";
  export { className as class };
</script>

<div class={cn("bento-grid", className)}>
  <slot></slot>
</div>

<style>
  /* Spans are precomputed in JS by bentoPack.js, which simulates standard
     (non-dense) row-major grid placement. Must NOT use grid-auto-flow: dense
     here - dense would place cards differently than the packer assumed and
     could reintroduce gaps or overlaps. */
  .bento-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    grid-auto-rows: 11.5rem;
  }

  /* Below the 3-column desktop width, the packer's precomputed spans no
     longer apply cleanly (they assumed exactly 3 columns) - BentoCard forces
     every card back to a single column at this same breakpoint. */
  @media (max-width: 1024px) {
    .bento-grid {
      grid-template-columns: 1fr;
      grid-auto-rows: auto;
    }
  }
</style>
