<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { candidates, envelopes_casted, quorum, voted } from "./../store.js";
  import { selectedAccount, web3 } from "svelte-web3";

  import Candidate from "../components/Candidate.svelte";
  import Modal from "../components/Modal.svelte";

  export let mayor, sul, mayorAddress;
  let modal;

  const dispatch = createEventDispatcher();

  const openHandler = async (e) => {
    window.$("#open-loader").dimmer("show");
    console.debug(e);
    let event = e.detail;

    if (event.success) {
      try {
        // TODO rimuovere campi inutili dal modal
        let envelope = await mayor.methods
          .compute_envelope(event.sigil, event.address, event.soul)
          .call({ from: $selectedAccount });
        let approve = await sul.methods
          .approve(mayorAddress, event.soul)
          .send({ from: $selectedAccount });
        let res = await mayor.methods
          .open_envelope(event.sigil, event.address)
          .send({ from: $selectedAccount, value: event.soul });

        if (res.status && res.events.hasOwnProperty("EnvelopeOpen")) {
          window.$("#open-loader").dimmer("hide");
          dispatch("opened", { success: true });
          $voted = event.address;
        } else {
          console.error(res);
          window.$("#open-loader").dimmer("hide");
          console.log(
            "ERRORE REGISTRAZINE: la chiamata `e andata abuon fine ma c' `e un errore comunque"
          );
        }
      } catch (err) {
        window.$("#open-loader").dimmer("hide");
        console.log("ERRORE REGISTRAZIONE");
        console.error(err);
        if (err.code === 4001) {
          console.log("devi accettare sgobbato");
        }
      }
    }
  };
</script>

<Modal
  bind:this={modal}
  on:cast={openHandler}
  title={"Open the casted vote"}
  prompt={"Confirm your Sigil and the casted up Soul"}
/>

<div
  class="ui basic segment"
  id="open-loader"
  in:fade={{ duration: 200, delay: 200 }}
  out:fade={{ duration: 400, delay: 400 }}
  on:outroend
>
  <div class="ui dimmer">
    <div class="ui text loader">Opening</div>
  </div>

  {#if envelopes_casted >= quorum}
    <div class="ui special centered cards">
      {#each $candidates as candidate}
        <Candidate
          address={candidate}
          on:click={() => {
            modal.show({ candidate });
          }}
          button={"Open"}
        />
      {/each}
    </div>
  {:else}
    <h2 class="ui center aligned icon header">
      <i class="sync icon loading" />
      <div class="content">
        Wait for Quorum
        <div class="sub header">{$envelopes_casted}/{$quorum}</div>
      </div>
    </h2>
  {/if}
</div>
