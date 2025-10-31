<script lang="ts">
  const props = $props();

  let left = $state(props.pos.x);
  let top = $state(props.pos.y);

  let moving = $state(false);

  const onMouseDown = () => {
    moving = true;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (moving) {
      left += e.movementX;
      top += e.movementY;
    }
  };

  const onMouseUp = () => {
    moving = false;
  };
</script>

<div
  role="textbox"
  tabindex="0"
  onmousedown={onMouseDown}
  style="left: {left}px; top: {top}px;"
  class="draggable"
>
  {@render props.children?.()}
</div>

<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />
