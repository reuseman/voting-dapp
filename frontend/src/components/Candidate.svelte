<script>
  import { onMount } from "svelte";
  import { fade, blur } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { avatarProvider } from "./../store";

  const dispatch = createEventDispatcher();

  export let button = "vote";
  export let address;
  export let votes = 0;
  export let soul = 0;
  export let hoverEnabled = true;
  export let winner = false;
  export let voted = false;

  onMount(() => {
    if (hoverEnabled) {
      window.$(".special.cards .image").dimmer({
        on: "hover",
      });
    }
  });

  function handleOnclick(e) {
    dispatch("click", { address: address });
  }
</script>

<div class="card {winner ? 'blue' : ''}">
  <div class="blurring dimmable image">
    <div class="ui dimmer">
      <div class="content">
        <div class="center">
          <div class="ui primary button" on:click={handleOnclick}>{button}</div>
        </div>
      </div>
    </div>
    <img
      src="{avatarProvider}{address}.svg"
      loading="lazy"
      alt="Avatar of {address}"
    />
    {#if winner}
      <div class="ui top right attached blue label">
        <i class="icon chess king" /> Mayor
      </div>
    {/if}
  </div>
  <div class="content">
    {#if voted}
      <i class="right floated check icon blue" transition:fade />
    {/if}
    <p class="header">{address}</p>
  </div>
  <div class="extra content">
    <span class="right floated">
      <i class="ethereum icon" />{soul} Soul
    </span>
    <span>
      <i class="user icon" />{votes} Votes
    </span>
  </div>
</div>

<style>
  .header {
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
