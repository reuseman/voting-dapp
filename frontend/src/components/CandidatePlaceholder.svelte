<script>
  export let votes = 0;
  export let soul = 0;
</script>

<div class="card">
  <div class="image">
    <div class="ui placeholder">
      <div class="square image" />
    </div>
  </div>
  <div class="content">
    <div class="ui placeholder">
      <div class="header"><div class="full line" /></div>
    </div>
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
