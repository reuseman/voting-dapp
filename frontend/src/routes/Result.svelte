<script>
  import {
    candidates,
    envelopes_casted,
    envelopes_opened,
    quorum,
    outcome_announced,
    winner,
    voted,
  } from "./../store.js";
  import { selectedAccount, web3 } from "svelte-web3";
  import { fade, blur } from "svelte/transition";

  import Candidate from "../components/Candidate.svelte";

  export let mayor, updateStats;
  let modal;
  let orderedCandidates = [];

  $: if ($envelopes_opened != 0 && $envelopes_opened >= $quorum) {
    // TODO check if updateStats() is needed
    if ($outcome_announced == false) {
      mayor.methods.mayor_or_sayonara().send({ from: $selectedAccount });
    }

    console.log("Outcome announced: " + $outcome_announced);
    console.log("Winner is: " + $winner);
  }

  $: if ($outcome_announced && $candidates.length) {
    getOrderedCandidates();
  }

  const getOrderedCandidates = async () => {
    for (let candidate of $candidates) {
      let res = await mayor.methods
        .candidates_state(candidate)
        .call({ from: $selectedAccount });
      orderedCandidates.push({
        address: candidate,
        soul: res.soul,
        votes: res.votes,
        winner: candidate == $winner,
      });
    }
    orderedCandidates = orderedCandidates.sort(
      (a, b) => b.sul - a.sul || b.votes - a.votes
    );
  };
</script>

<div
  class="ui basic segment"
  in:fade={{ duration: 200, delay: 200 }}
  out:fade={{ duration: 400, delay: 400 }}
  on:outroend
>
  {#if $envelopes_opened != 0 && envelopes_opened >= quorum}
    {#if $outcome_announced}
      {#if $winner == $web3.utils.toBN($winner).isZero()}
        TIE
        <h2 class="ui center aligned header" style="margin-top: 0;">
          It's a tie!
        </h2>
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
              voted={$voted == candidate.address}
            />
          {/each}
        </div>
      {/if}
    {:else}
      <h2 class="ui center aligned header" style="margin-top: 0;">
        Results not announced yet
      </h2>
    {/if}
  {:else}
    <h2 class="ui center aligned icon header">
      <i class="sync icon loading" />
      <div class="content">
        Wait for Results
        <div class="sub header">{$envelopes_opened}/{$quorum}</div>
      </div>
    </h2>
  {/if}
</div>
