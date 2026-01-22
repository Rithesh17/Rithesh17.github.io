<script lang="ts">
  import { inview } from "svelte-inview";
  import { browser } from "$app/environment";

  export let width = "fit-content";
  export let boxColor = "#5046e6";
  export let duration = 0.5;

  let isVisible = false;

  let viewEnter = () => {
    if (browser) {
      isVisible = true;
    }
  };
  let viewLeave = () => {
    if (browser) {
      isVisible = false;
    }
  };
</script>

<div
  class="box-reveal-container"
  class:visible={isVisible}
  style="width:{width}; --box-color: {boxColor}; --duration: {duration}s;"
  use:inview
  on:inview_enter={viewEnter}
  on:inview_leave={viewLeave}
>
  <div class="box-reveal-content">
    <slot>Default</slot>
  </div>
  <div class="box-reveal-overlay"></div>
</div>

<style>
  .box-reveal-container {
    position: relative;
    overflow: hidden;
  }

  .box-reveal-content {
    opacity: 0;
    transform: translateY(75px);
    transition: opacity var(--duration, 0.5s) ease-out var(--delay, 0.25s),
      transform var(--duration, 0.5s) ease-out var(--delay, 0.25s);
  }

  .box-reveal-container.visible .box-reveal-content {
    opacity: 1;
    transform: translateY(0);
  }

  .box-reveal-overlay {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 0;
    width: 100%;
    background: var(--box-color, #5046e6);
    z-index: 40;
    transform: translateX(0);
    transition: transform var(--duration, 0.5s) ease-in;
  }

  .box-reveal-container.visible .box-reveal-overlay {
    transform: translateX(100%);
  }
</style>
