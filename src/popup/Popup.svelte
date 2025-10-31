<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Draggable from "./Draggable.svelte";
  export let message = "";
  export let pos = { x: 0, y: 0 };
  export let timeoutMs = 0;

  let popupElement: Element;

  const closeOnClick = (e: Event) => {
    if (popupElement && !popupElement.contains(<Node>e.target)) {
      popupElement.remove();
      document.removeEventListener("click", closeOnClick);
    }
  };

  onMount(() => {
    if (timeoutMs > 0) {
      setTimeout(() => {
        popupElement.remove();
      }, timeoutMs);
    } else {
      document.addEventListener("click", closeOnClick);
    }
  });

  onDestroy(() => {
    document.removeEventListener("click", closeOnClick);
  });
</script>

<div bind:this={popupElement}>
  <Draggable {pos}>
    <div bind:this={popupElement} class="translator-popup">
      <p>{message}</p>
    </div>
  </Draggable>
</div>
