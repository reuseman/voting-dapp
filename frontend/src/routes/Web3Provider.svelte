<script>
  import { defaultChainStore, connected } from "svelte-web3";
  import { onMount, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let toggleLoader;
  let error = null;

  onMount(() => {
    // Enable wallet provider
    toggleLoader("show");
    let provider = defaultChainStore.setBrowserProvider();

    provider
      .then((res) => {
        toggleLoader("hide");
        dispatch("connected", { success: true });
      })
      .catch((err) => {
        error = err;
        console.error(err);
        if (err.code !== -32002) {
          toggleLoader("hide");
        }
      });
  });

  $: if ($connected) {
    toggleLoader("hide");
    error = null;
  }
</script>

<div
  class="ui basic segment"
  in:fade={{ duration: 200, delay: 200 }}
  out:fade={{ duration: 400, delay: 400 }}
  on:outroend
>
  {#if $connected}
    <h2 class="ui center aligned icon header">
      <i class="handshake icon" />
      <div class="content">
        Web3 Provider
        <div class="sub header">Connected</div>
      </div>
    </h2>
  {:else if error}
    <h2 class="ui center aligned icon red header">
      <i class="plug icon" />
      <div class="content">
        Error {error.code}
        <div class="sub header">{error.message}</div>
        <div class="sub header">Refresh the page or check your provider.</div>
      </div>
    </h2>
  {:else}
    <h2 class="ui center aligned icon header">
      <i class="plug icon" />
      <div class="content">
        Web3 Provider
        <div class="sub header">Connect to your Web3 provider.</div>
      </div>
    </h2>
  {/if}
</div>
