<script>
  import {
    balance,
    envelopes_casted,
    envelopes_opened,
    quorum,
  } from "../store.js";
  import { blur } from "svelte/transition";
</script>

<div class="ui four statistics">
  <div class="statistic">
    <div class="value">
      <i class="ethereum icon" />
      {#each [$balance] as b (b)}
        <span class="ui blue" in:blur={{ duration: 400, delay: 400 }}
          >{b}
        </span>
      {/each}
    </div>
    <div class="label">Your SOUL</div>
  </div>

  <div class="statistic">
    <div class="value">
      <i class="users icon" />
      {#each [$quorum] as q (q)}
        <span in:blur={{ duration: 400, delay: 400 }}>{q} </span>
      {/each}
    </div>
    <div class="label">Quorum</div>
  </div>

  <div class="statistic">
    <div class="value">
      <i class="envelope icon" />
      {#each [$envelopes_casted] as q (q)}
        <span in:blur={{ duration: 400, delay: 400 }}>{q} </span>
      {/each}
    </div>
    <div class="label">
      Envelope{#if $envelopes_casted > 1}s{/if} Casted
    </div>
  </div>

  <div class="statistic">
    <div class="value">
      <i class="envelope icon" />
      {#each [$envelopes_opened] as q (q)}
        <span in:blur={{ duration: 400, delay: 400 }}>{q} </span>
      {/each}
    </div>
    <div class="label">
      Envelope{#if $envelopes_casted > 1}s{/if} Opened
    </div>
  </div>
</div>
