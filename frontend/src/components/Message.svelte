<script>
  import { fade, fly } from "svelte/transition";

  let hidden = true;
  let header = "sotta a lebba";
  let message = "la mapmpuglia e fiuta sott' allebba allora";

  export function show(h, m) {
    hidden = false;
    header = h;
    message = m;
  }
</script>

{#if !hidden}
  <div class="ui warning message transition" transition:fly>
    <i class="close icon" on:click={() => (hidden = true)} />
    <div class="header">{header}</div>
    {message}
  </div>
{/if}
