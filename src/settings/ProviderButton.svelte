<script lang="ts">
  import { settings } from './settingsStore';
  let { value, label, checked = false } = $props();
</script>

<label>
  {label}
  <input
    type="radio"
    name="provider"
    {checked}
    onchange={() =>
      settings.update({
        activeProviderId: value,
      })}
    {value}
  /></label
>
