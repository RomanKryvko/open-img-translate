<script lang="ts">
  const props = $props();

  let left = $state(props.pos.x);
  let top = $state(props.pos.y);

  let moving = $state(false);

  let width: number = $state(0);
  let height: number = $state(0);

  const onMouseDown = () => {
    moving = true;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!moving) return;

    const updatedLeft = left + e.movementX;
    const updatedTop = top + e.movementY;

    const maxLeft = window.innerWidth - width;
    const maxTop = window.innerHeight - height;

    left = Math.max(0, Math.min(updatedLeft, maxLeft));
    top = Math.max(0, Math.min(updatedTop, maxTop));
  };

  const onMouseUp = () => {
    moving = false;
  };
</script>

<div
  role="textbox"
  tabindex="0"
  bind:clientWidth={width}
  bind:clientHeight={height}
  onmousedown={onMouseDown}
  style="left: {left}px; top: {top}px;"
  class="draggable"
>
  {@render props.children?.()}
</div>

<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />
