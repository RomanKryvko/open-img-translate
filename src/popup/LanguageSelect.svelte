<script lang="ts">
  import { LangCode, LANGUAGE_REGISTRY } from '../languages';

  const {
    title,
    callback,
    options,
    defaultValue,
  }: {
    title: string;
    callback: (value: LangCode) => void;
    options: Set<LangCode | 'auto'>;
    defaultValue: LangCode;
  } = $props();

  let selected = $state(defaultValue);
</script>

<div class="language-select">
  <p>{title}</p>
  <select
    bind:value={selected}
    onchange={() => {
      callback(selected);
    }}
  >
    {#each options as opt}
      <option value={opt} selected={opt == defaultValue}>
        {LANGUAGE_REGISTRY[opt]}
      </option>
    {/each}
  </select>
</div>

<style>
  .language-select {
    display: flex;
    flex-direction: column;
  }
</style>
