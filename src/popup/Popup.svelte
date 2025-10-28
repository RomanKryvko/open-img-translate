<script lang="ts">
  import { onMount, onDestroy } from "svelte";
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

<div
  bind:this={popupElement}
  class="translator-popup"
  style="left: {pos.x}px; top: {pos.y}px"
>
  <p>{message}</p>
</div>
