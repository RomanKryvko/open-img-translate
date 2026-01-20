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
    onchange={(e) => {
      settings.update({
        provider: { ...$settings.provider, name: (e.target as HTMLInputElement).value },
      });
    }}
    {value}
  /></label
>
