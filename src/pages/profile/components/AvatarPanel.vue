<template>

<div id="avatar-panel">

<!-- UPLOAD OWN AVATAR -->
<!--   <div v-if="!image">
    <h2>Select an image</h2>
    <input type="file" @change="onFileChange">
  </div> -->
  <!-- <div> -->

    <!-- <button @click="removeImage">Remove image</button> -->
  <!-- </div> -->



  <div id="img-container">
    <img id="avatar" v-if="data" :src="imageURL" />
  </div>

  <info-panel :data="data"></info-panel>



  <div id="group">
    <button v-on:click="showUpdateForm = !showUpdateForm">Update</button>
    <input v-on:keyup.enter="uploadImage" v-model="newImageURL" v-show="showUpdateForm" placeholder="Update your avatar">
  </div>




</div>





</template>


<script>
import InfoPanel from './InfoPanel.vue';
import axios from 'axios';

export default {
  props: ['data'],

  data() {
    return {
      // image: null,
      showUpdateForm: false,
      newImageURL: null,
      imageURL: null
    }

  },

  watch: {
    data: function() {
      this.imageURL = this.data.metrics.imageURL;
    }

  },

  methods: {

    uploadImage() {

      this.imageURL = this.newImageURL;

      axios.put('/api/users/avatar', {imageURL: this.imageURL},
        {headers: {'x-access-token': `Bearer ${localStorage.id_token}`} })
        .then(() => {console.log('Slightly triggered')})
        .catch(() => { console.log('FAIL!')});

      this.newImageURL = null;
      this.showUpdateForm = false;
    },


    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
      this.image = '';
    }
  },

  components: {
    InfoPanel
  },

  mounted: function() {

  }

}



</script>


<style scoped>

#avatar-panel {
  /*text-align: center;*/
  padding: 20px;
  display: grid;
  grid-gap: 20px;
  grid-template-areas:

    "img-container info-panel"
    "group info-panel";

  grid-template-rows: 5fr 1fr;
  grid-template-columns: 1fr 1fr;

}

#avatar-panel img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  overflow: hidden;
  margin: auto;
  /*display: flex;*/
  margin-bottom: 10px;
  /*border: 1px solid lime;*/
  /*background: rgba(0,0,0,0.9);*/
  /*opacity: 1;*/
}

#img-container {
  grid-area: img-container;
  margin-top: 10px;


}

#group {
  grid-area: group;
  /*border: 1px solid pink;*/

}

#info-panel {
  grid-area: info-panel;
  /*border: 1px solid orange;*/
  align-items: left;
}

</style>