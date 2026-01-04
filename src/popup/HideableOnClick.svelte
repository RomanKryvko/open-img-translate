<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  const props = $props();
  let element: HTMLElement | undefined = $state();
  let visible = $state(true);

  const hideOnClick = (e: Event) => {
    if (element && !element.contains(<Node>e.target)) {
      visible = false;
    }
  };

  onMount(() => {
    document.addEventListener('click', hideOnClick);
  });

  onDestroy(() => {
    document.removeEventListener('click', hideOnClick);
  });
</script>

{#if visible}
  <div bind:this={element}>
    {@render props.children?.()}
  </div>
{/if}
