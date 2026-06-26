<script lang="ts">
  import { LangCode, LANGUAGE_REGISTRY } from '../languages';
  type Layout = 'column' | 'row';

  const {
    title,
    callback,
    options,
    defaultValue,
    layout = 'column',
  }: {
    title: string;
    callback: (value: LangCode) => void;
    options: Set<LangCode | 'auto'>;
    defaultValue: LangCode;
    layout?: Layout;
  } = $props();

  let selected = $state(defaultValue);
</script>

<div class={layout}>
  <p class="title">{title}</p>
  <select
    class="select"
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
  .column {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    gap: 1em;
  }
  .row * {
    flex: 1 1 0px;
  }
  .select {
    height: 2em;
    max-width: fit-content;
  }
</style>
