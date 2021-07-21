<script>
  import { createEventDispatcher } from "svelte";
  import { candidates, candidates_number } from "./../store.js";
  import { selectedAccount } from "svelte-web3";
  import { fly, blur, fade } from "svelte/transition";

  import Candidate from "../components/Candidate.svelte";
  import CandidatePlaceholder from "../components/CandidatePlaceholder.svelte";
  import Modal from "../components/Modal.svelte";

  export let mayor;
  let modal;

  const dispatch = createEventDispatcher();

  const castHandler = async (e) => {
    window.$("#cast-loader").dimmer("show");
    console.debug(e);
    let event = e.detail;

    if (event.success) {
      try {
        let envelope = await mayor.methods
          .compute_envelope(event.sigil, event.address, event.soul)
          .call();
        console.log("hai castato questo envelope: " + envelope);
        let res = await mayor.methods
          .cast_envelope(envelope)
          .send({ from: $selectedAccount });

        console.debug(res);
        if (res.status && res.events.hasOwnProperty("EnvelopeCast")) {
          window.$("#cast-loader").dimmer("hide");
          dispatch("casted", { success: true });
        } else {
          console.error(res);
          window.$("#cast-loader").dimmer("hide");
          console.log(
            "ERRORE REGISTRAZINE: la chiamata `e andata abuon fine ma c' `e un errore comunque"
          );
        }
      } catch (err) {
        window.$("#cast-loader").dimmer("hide");
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
  on:cast={castHandler}
  title={"Cast your vote"}
  prompt={"Create your Sigil and pick up the Soul"}
/>

<div
  class="ui basic segment"
  id="cast-loader"
  in:fade={{ duration: 200, delay: 200 }}
  out:fade={{ duration: 400, delay: 400 }}
  on:outroend
>
  <div class="ui dimmer">
    <div class="ui text loader">Casting</div>
  </div>

  <h2 class="ui center aligned header" style="margin-top: 0;">
    Cast your envelope
  </h2>
  <div class="ui special centered cards" in:fade out:fade>
    {#if $candidates_number}
      {#each $candidates as candidate}
        <Candidate
          address={candidate}
          on:click={() => {
            modal.show({ candidate });
          }}
          button={"Cast"}
        />
      {/each}
    {:else}
      {#each [1, 2, 3] as candidate}
        <CandidatePlaceholder />
      {/each}
    {/if}
  </div>
</div>
