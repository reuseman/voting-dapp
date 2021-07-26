<script>
  import { createEventDispatcher, onMount } from "svelte";
  import {
    candidates,
    envelopes_opened,
    quorum,
    outcome_announced,
    winner,
    voted,
  } from "./../store.js";
  import { selectedAccount, web3 } from "svelte-web3";
  import { fade, blur } from "svelte/transition";

  import Candidate from "../components/Candidate.svelte";

  export let mayor;
  let orderedCandidates = [];
  let candidates_called = false;

  const dispatch = createEventDispatcher();

  $: if ($envelopes_opened != 0 && $envelopes_opened >= $quorum) {
    if ($outcome_announced == false) {
      mayor.methods.mayor_or_sayonara().send({ from: $selectedAccount });
    }
  }

  $: if ($outcome_announced && $candidates.length) {
    if (!candidates_called) {
      getOrderedCandidates();
      dispatch("completed", { success: true });
      candidates_called = true;
    }
  }

  const getOrderedCandidates = async () => {
    let temp = [];
    for (let candidate of $candidates) {
      let res = await mayor.methods
        .candidates_state(candidate)
        .call({ from: $selectedAccount });
      temp.push({
        address: candidate,
        soul: res.soul,
        votes: res.votes,
        winner: candidate == $winner,
      });
    }
    orderedCandidates = temp.sort((a, b) => b.sul - a.sul || b.votes - a.votes);
  };

  onMount(() => {
    // window.$("#bar").progress({
    //   percent: ($envelopes_opened / $quorum) * 100,
    //   total: $quorum,
    // });
  });
</script>

<div
  class="ui basic segment"
  in:fade={{ duration: 200, delay: 200 }}
  out:fade={{ duration: 400, delay: 400 }}
  on:outroend
>
  <!-- <div class="ui blue progress" id="bar">
    <div class="bar" />
    <div class="label">{$envelopes_opened}/{$quorum} Opened Votes</div>
  </div>
  <div class="ui divider hidden" /> -->
  {#if $outcome_announced}
    {#if $envelopes_opened != 0 && envelopes_opened >= quorum}
      {#if $web3.utils.toBN($winner).isZero()}
        <h2 class="ui center aligned header" style="margin-top: 0;">
          It's a tie!
        </h2>
        <div class="ui special centered cards" transition:blur>
          {#each orderedCandidates as candidate}
            <Candidate
              address={candidate.address}
              votes={candidate.votes}
              soul={candidate.soul}
              hoverEnabled={false}
              winner={candidate.winner}
              voted={$voted[$selectedAccount] == candidate.address}
            />
          {/each}
        </div>
      {:else}
        <h2 class="ui center aligned header" style="margin-top: 0;">
          The winner is...
        </h2>
        <div class="ui special centered cards" transition:blur>
          {#each orderedCandidates as candidate}
            <Candidate
              address={candidate.address}
              votes={candidate.votes}
              soul={candidate.soul}
              hoverEnabled={false}
              winner={candidate.winner}
              voted={$voted[$selectedAccount] == candidate.address}
            />
          {/each}
        </div>
      {/if}
    {/if}
  {:else}
    <h2 class="ui center aligned icon header">
      <i class="sync blue icon loading" />
      <div class="content">
        Wait for Results
        <div class="sub header">{$envelopes_opened}/{$quorum}</div>
      </div>
    </h2>
  {/if}
</div>
