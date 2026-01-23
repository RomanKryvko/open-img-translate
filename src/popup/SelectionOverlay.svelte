<script lang="ts">
  let active = $state(true);
  let selecting = $state(false);

  let startX = $state(0);
  let startY = $state(0);

  let boxX = $state(0);
  let boxY = $state(0);
  let boxWidth = $state(0);
  let boxHeight = $state(0);

  let box: HTMLDivElement | null = $state(null);

  const onmousedown = (e: MouseEvent) => {
    if (!active) return;
    startX = e.clientX;
    startY = e.clientY;
    selecting = true;
  };

  const onmousemove = (e: MouseEvent) => {
    if (!selecting) return;
    boxX = Math.min(e.clientX, startX);
    boxY = Math.min(e.clientY, startY);
    boxWidth = Math.abs(e.clientX - startX);
    boxHeight = Math.abs(e.clientY - startY);
  };

  const onmouseup = () => {
    if (!selecting || !active) return;
    active = false;
    selecting = false;
    if (!box) {
      console.error('Selection box not found.');
      return;
    }
    captureRegion(box.getBoundingClientRect());
  };

  const onkeydown = (e: KeyboardEvent) => {
    if (active && e.key === 'Escape') {
      active = false;
      selecting = false;
    }
  };

  const captureRegion = async (rect: DOMRect) => {
    const { left, top, width, height } = rect;
    const imageUri = await browser.runtime.sendMessage({
      type: 'captureRegion',
      rect: { left, top, width, height },
    });
    console.log('Captured region:', imageUri);
  };
</script>

<svelte:window {onmousedown} {onmousemove} {onmouseup} {onkeydown} />
{#if active}
  <div class="overlay">
    {#if selecting}
      <div
        bind:this={box}
        class="selection-box"
        style="
          left: {boxX}px;
          top: {boxY}px;
          width: {boxWidth}px;
          height: {boxHeight}px;
        "
      ></div>
    {/if}
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: crosshair;
    z-index: 999999;
  }
  .selection-box {
    position: fixed;
    border: 2px solid #00ffff;
    background-color: rgba(0, 255, 255, 0.1);
    z-index: 1000000;
  }
</style>
