<script>
  import { web3, selectedAccount, connected } from "svelte-web3";
  import { onMount, onDestroy } from "svelte";
  import {
    balance,
    candidates,
    candidates_number,
    envelopes_casted,
    envelopes_opened,
    outcome_announced,
    winner,
    quorum,
    route,
  } from "./store.js";

  import * as mayorContract from "../contracts/Mayor.json";
  import * as sulContract from "../contracts/SULToken.json";
  import * as addresses from "../contracts/addresses.json";

  // Components
  import Nav from "./components/Nav.svelte";
  import Statistics from "./components/Statistics.svelte";
  import Steps from "./components/Steps.svelte";
  import Message from "./components/Message.svelte";

  import Web3Provider from "./routes/Web3Provider.svelte";
  import Register from "./routes/Register.svelte";
  import Cast from "./routes/Cast.svelte";
  import Open from "./routes/Open.svelte";
  import Result from "./routes/Result.svelte";

  const routes = ["provider", "register", "cast", "open", "results"];
  let currentRoute = routes[0];
  let sul,
    mayor = null;
  let steps;
  let showMessage;
  let subscription;

  onMount(() => {
    steps.activate(0);

    // Style
    window.$(".ui.sticky").sticky({
      offset: 80,
      context: "#main1",
    });
  });

  onDestroy(() => {
    unsubscribe();
  });

  function unsubscribe() {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  $: if ($connected) {
    sul = new $web3.eth.Contract(sulContract.abi, addresses.sul);
    mayor = new $web3.eth.Contract(mayorContract.abi, addresses.mayor);

    window.mayor = mayor;

    subscription = $web3.eth.subscribe("logs", {}, (err, event) => {
      if (!err) console.log(event);
    });

    subscription.on("data", (event) => {
      console.log("Subscription");
      console.log(event);
      compute();
    });
  }

  // $: if ($outcome_announced && currentRoute != routes[4]) {
  //   $route[$selectedAccount] = routes[4];
  //   changeRoute();
  // }

  async function firstRoute(e) {
    if (e.detail.success) {
      await compute();
      let old = $route;
      if (!$route[$selectedAccount]) {
        old[$selectedAccount] = routes[1];
        route.set(old);
      }
      if ($outcome_announced) {
        $route[$selectedAccount] = routes[4];
      }
      currentRoute = "empty";
    }
  }

  function nextRoute(e) {
    if (e.detail.success) {
      compute();
      let old = $route;
      let newRouteIndex = routes.indexOf(old[$selectedAccount]) + 1;
      old[$selectedAccount] = routes[newRouteIndex];
      route.set(old);
      currentRoute = "empty";
    }
  }

  function changeRoute() {
    currentRoute = $route[$selectedAccount];
    steps.activate(routes.indexOf(currentRoute));
  }

  const toggleLoader = (command) => {
    window.$("#loader").dimmer(command);
  };

  const compute = async () => {
    $balance = await sul.methods
      .balanceOf($selectedAccount)
      .call({ from: $selectedAccount });

    let voting_condition = await mayor.methods.voting_condition().call();
    $quorum = voting_condition.quorum;
    $envelopes_casted = voting_condition.envelopes_casted;
    $envelopes_opened = voting_condition.envelopes_opened;
    $outcome_announced = voting_condition.outcome_announced;
    $winner = voting_condition.winner;

    $candidates_number = await mayor.methods.candidates_number().call();
    $candidates = [];
    let temp = [];
    for (let i = 0; i < $candidates_number; i++) {
      let candidate = await mayor.methods.candidates(i).call();
      temp.push(candidate);
    }
    $candidates = temp;
  };
</script>

<Nav />

<div class="ui main fluid container">
  <Statistics />
  <div class="ui main grid">
    <div class="middle aligned stretched row">
      <div class="left floated three wide column">
        <Steps bind:this={steps} />
      </div>
      <div class="ten wide column">
        <div class="ui segment" id="loader">
          <div class="ui dimmer">
            <div class="ui text loader">Loading</div>
          </div>

          {#if currentRoute == routes[0]}
            <Web3Provider
              {toggleLoader}
              on:connected={firstRoute}
              on:outroend={changeRoute}
            />
          {:else if currentRoute == routes[1]}
            <Register
              {mayor}
              {toggleLoader}
              {showMessage}
              on:register={nextRoute}
              on:outroend={changeRoute}
            />
          {:else if currentRoute == routes[2]}
            <Cast
              {mayor}
              {toggleLoader}
              on:casted={nextRoute}
              on:outroend={changeRoute}
            />
          {:else if currentRoute == routes[3]}
            <Open
              {mayor}
              {sul}
              mayorAddress={addresses.mayor}
              updateStats={compute}
              {toggleLoader}
              on:opened={nextRoute}
              on:outroend={changeRoute}
            />
          {:else if currentRoute == routes[4]}
            <Result {mayor} on:completed={unsubscribe} />
          {/if}
        </div>
      </div>
      <div class="right floated three wide column" />
    </div>
    <div class="middle aligned stretched row">
      <div class="ten wide centered column">
        <Message bind:show={showMessage} />
      </div>
    </div>
  </div>
</div>

<style>
  .main.ui.container {
    padding: 5rem 4rem;
    margin-top: 1rem;
  }
</style>
