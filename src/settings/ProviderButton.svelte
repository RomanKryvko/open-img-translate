<script lang="ts">
  import { settings } from './settingsStore';
  let { group = $bindable(), value, label } = $props();
</script>

<label>
  {label}
  <input
    type="radio"
    name="provider"
    bind:group
    onchange={(e) => {
      settings.update({
        provider: { ...$settings.provider, name: (e.target as HTMLInputElement).value },
      });
    }}
    {value}
  /></label
>
