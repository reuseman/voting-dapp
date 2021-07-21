<script>
  import { createEventDispatcher } from "svelte";
  import { avatarProvider } from "./../store";
  const dispatch = createEventDispatcher();

  export let title = "";
  export let prompt = "";
  let address;
  let sigil;
  let soul;

  export const show = (addr) => {
    address = addr.candidate;
    window.$(".ui.modal").modal("show");
  };

  const closeHandler = () => {
    dispatch("close", true);
  };

  const castHandler = () => {
    dispatch("cast", {
      success: true,
      address: address,
      sigil: sigil,
      soul: soul,
    });
  };

  // TODO add random image generator for sigil
</script>

<div class="ui modal">
  <i class="close icon" />
  <div class="header">{title}</div>
  <div class="image content">
    <div class="ui medium image">
      <img src="{avatarProvider}{address}.svg" loading="lazy" />
    </div>
    <div class="description">
      <div class="ui header">{prompt}</div>

      <form class="ui form">
        <div class="field">
          <label for="sigil">Sigil</label>
          <div class="ui left icon input">
            <i class="key icon" />
            <input
              type="text"
              name="first-name"
              placeholder="74539"
              id="sigil"
              bind:value={sigil}
            />
          </div>
        </div>
        <div class="field">
          <label for="soul">Soul</label>
          <div class="ui left icon input">
            <i class="ethereum icon" />
            <input
              type="text"
              name="first-name"
              placeholder="42"
              id="soul"
              bind:value={soul}
            />
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="actions">
    <div class="ui black deny button" on:click={closeHandler}>Nope</div>
    <div class="ui positive right labeled icon button" on:click={castHandler}>
      Yeah
      <i class="checkmark icon" />
    </div>
  </div>
</div>
