<template>

<div id="avatar-panel">

<!--   <div v-if="!image">
    <h2>Select an image</h2>
    <input type="file" @change="onFileChange">
  </div> -->

  <div id="img-container">
    <img id="avatar" v-if="data" :src="imageURL" />
  </div>


  <!-- <div> -->

    <!-- <button @click="removeImage">Remove image</button> -->
  <!-- </div> -->

  <div id="group">
    <button v-on:click="showUpdateForm = !showUpdateForm">Update</button>
    <input v-on:keyup.enter="uploadImage" v-model="newImageURL" v-show="showUpdateForm" placeholder="Update your avatar">
  </div>




</div>





</template>


<script>
import axios from 'axios';

export default {
  props: ['data'],

  data() {
    return {
      showUpdateForm: false,
      newImageURL: null,
      // image: null,
      imageURL: null
    }

  },

  watch: {
    data: function() {
      this.imageURL = this.data.imageURL;
      console.log('NOT TRIGGERED!');
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

    "img-container"
    "group";

  grid-template-rows: 1fr;
  grid-template-columns: 4fr 1fr;

}

#avatar-panel img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  overflow: hidden;
  margin: auto;
  /*display: flex;*/
  margin-bottom: 10px;
  border: 1px solid lime;
  /*background: rgba(0,0,0,0.9);*/
  /*opacity: 1;*/
}

#img-container {
  grid-area: img-container;

}

#group {
  grid-area: group;

}

</style>