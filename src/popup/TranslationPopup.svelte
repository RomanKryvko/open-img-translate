<script lang="ts">
  import Draggable from "./Draggable.svelte";
  import Popup from "./Popup.svelte";
  import HideableOnClick from "./HideableOnClick.svelte";

  const props = $props();
</script>

<HideableOnClick>
  <Draggable pos={props.pos}>
    <Popup message={props.message} />
  </Draggable>
</HideableOnClick>
