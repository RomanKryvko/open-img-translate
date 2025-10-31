<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Draggable from "./Draggable.svelte";

  const props = $props();

  let popupElement: HTMLElement | undefined = $state();

  const closeOnClick = (e: Event) => {
    if (popupElement && !popupElement.contains(<Node>e.target)) {
      popupElement.remove();
      document.removeEventListener("click", closeOnClick);
    }
  };

  onMount(() => {
    if (props.timeoutMs > 0) {
      setTimeout(() => {
        popupElement?.remove();
      }, props.timeoutMs);
    } else {
      document.addEventListener("click", closeOnClick);
    }
  });

  onDestroy(() => {
    document.removeEventListener("click", closeOnClick);
  });
</script>

<div bind:this={popupElement}>
  <Draggable pos={props.pos}>
    <div class="translator-popup">
      <p>{props.message}</p>
    </div>
  </Draggable>
</div>
