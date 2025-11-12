<script lang="ts">
  const {
    title,
    callback,
    options,
    defaultValue,
  }: {
    title: string;
    callback: (value: any) => void;
    options: { key: string; text: string }[];
    defaultValue: { key: string; text: string };
  } = $props();

  let selected = $state();
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
      <option value={opt} selected={opt.key == defaultValue.key}>
        {opt.text}
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
