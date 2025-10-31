<script lang="ts">
  import { onMount } from "svelte";

  const props = $props();
  let left = $state(props.pos?.x ?? 0);
  let top = $state(props.pos?.y ?? 0);

  let popupElement: HTMLElement | undefined = $state();

  onMount(() => {
    if (props.timeoutMs > 0) {
      setTimeout(() => {
        popupElement?.remove();
      }, props.timeoutMs);
    }
  });
</script>

<div bind:this={popupElement}>
  <div class="translator-popup" style="left:{left}px; top:{top}px;">
    <p>{props.message}</p>
  </div>
</div>
