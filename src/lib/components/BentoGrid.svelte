<script lang="ts">
  import { cn } from "$lib/utils";
  let className: any = "";
  export { className as class };
</script>

<div class={cn("bento-grid", className)}>
  <slot></slot>
</div>

<style>
  .bento-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    grid-auto-rows: 20rem;
  }

  @media (max-width: 1024px) {
    .bento-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .bento-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
