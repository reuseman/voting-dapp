<script>
  import { fade } from "svelte/transition";

  let state = Array(5).fill("disabled");

  export const reset = () => {
    state = Array(5).fill("disabled");
  };
  export const activate = (step) =>
    (state = Array(step)
      .fill("")
      .concat("active")
      .concat(state.slice(step + 1)));
</script>

<div class="ui fluid small vertical steps">
  <div class="step {state[0]}" out:fade={{ duration: 400, delay: 400 }}>
    <i class="plug icon" />
    <div class="content">
      <div class="title">Provider</div>
      <div class="description">Pick Web3 provider</div>
    </div>
  </div>

  <div class="step {state[1]}" in:fade={{ duration: 400, delay: 400 }}>
    <i class="user icon" />
    <div class="content">
      <div class="title">Register</div>
      <div class="description">Register as a voter</div>
    </div>
  </div>

  <div class="step {state[2]}" in:fade={{ duration: 400, delay: 400 }}>
    <i class="envelope icon" />
    <div class="content">
      <div class="title">Cast</div>
      <div class="description">Cast your envelope</div>
    </div>
  </div>

  <div class="step {state[3]}" in:fade={{ duration: 400, delay: 400 }}>
    <i class="envelope open icon" />
    <div class="content">
      <div class="title">Open</div>
      <div class="description">Open your envelope</div>
    </div>
  </div>

  <div class="step {state[4]}" in:fade={{ duration: 400, delay: 400 }}>
    <i class="bullhorn icon" />
    <div class="content">
      <div class="title">Results</div>
      <div class="description">Who's the winner?</div>
    </div>
  </div>
</div>
