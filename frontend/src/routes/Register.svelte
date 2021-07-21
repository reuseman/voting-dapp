<script>
  import { selectedAccount, connected, web3 } from "svelte-web3";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let mayor = null;
  export let toggleLoader;
  let error = null;

  const registerHandler = async () => {
    toggleLoader("show");

    try {
      let res = await mayor.methods.register().send({ from: $selectedAccount });
      console.log("questo risultato");
      console.log(res);
      if (res.status && res.events.hasOwnProperty("Registered")) {
        toggleLoader("hide");
        dispatch("register", { success: true });
      } else {
        toggleLoader("hide");
        console.log(
          "ERRORE REGISTRAZINE: la chiamata `e andata abuon fine ma c' `e un errore comunque"
        );
      }
    } catch (err) {
      toggleLoader("hide");
      console.log("ERRORE REGISTRAZIONE");
      console.log(err);
      // console.log(err["value"]["data"]["message"].includes("The voter already received the soul"))
      if (err.code === 4001) {
        console.log("devi accettare sgobbato");
      }
    }
  };
</script>

<div
  class="ui center aligned basic segment"
  in:fade={{ duration: 200, delay: 200 }}
  out:fade={{ duration: 400, delay: 400 }}
  on:outroend
>
  {#if $connected}
    <h2 class="ui center aligned icon header">
      <i class="ethereum icon" />
      <div class="content">
        Get your SOUL
        <div class="sub header">
          Register in order to receive the token to vote.
        </div>
      </div>
    </h2>
    <div class="inline">
      <div class="ui primary button" on:click={registerHandler}>Register</div>
    </div>
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
