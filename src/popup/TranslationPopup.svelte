<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Draggable from "./Draggable.svelte";
  import Popup from "./Popup.svelte";

  let popupElement: HTMLElement | undefined = $state();

  const props = $props();
  let visible = $state(true);

  const hideOnClick = (e: Event) => {
    if (popupElement && !popupElement.contains(<Node>e.target)) {
      visible = false;
    }
  };

  onMount(() => {
    document.addEventListener("click", hideOnClick);
  });

  onDestroy(() => {
    document.removeEventListener("click", hideOnClick);
  });
</script>

{#if visible}
  <div bind:this={popupElement}>
    <Draggable pos={props.pos}>
      <Popup message={props.message} />
    </Draggable>
  </div>
{/if}
