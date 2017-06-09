<template>
<div id="profile-page">

  <avatar-panel></avatar-panel>
  <info-panel></info-panel>
  <settings-panel></settings-panel>
  <history-panel></history-panel>
  <friendslist></friendslist>

</div>


</template>


<script>

import AvatarPanel from './components/AvatarPanel.vue';
import Friendslist from './components/Friendslist.vue';
import HistoryPanel from './components/HistoryPanel.vue';
import InfoPanel from './components/InfoPanel.vue';
import SettingsPanel from './components/SettingsPanel.vue';


export default {
  data() {
    return {}
  },
  components: {
    AvatarPanel,
    Friendslist,
    HistoryPanel,
    InfoPanel,
    SettingsPanel
  }
}




</script>


<style>
#profile-page {
  width: 100%;
  height: 100%;
  display: grid;
  grid-gap: 20px;
  margin: 20px;


  grid-template-areas:

    "avatar-panel settings-panel friendslist"
    "info-panel history-panel friendslist";

  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;

}

#profile-page > * {
  background-color: black;
  color: white;
  opacity: 0.5;
}

#avatar-panel {
  grid-area: avatar-panel;
  border: 2px solid lime;
}

#settings-panel {
  grid-area: settings-panel;
  border: 2px solid lime;
}

#info-panel {
  grid-area: info-panel;
  border: 2px solid lime;
}

#history-panel {
  grid-area: history-panel;
  border: 2px solid lime;
}

#friendslist {
  grid-area: friendslist;
  border: 2px solid lime;
}




</style>