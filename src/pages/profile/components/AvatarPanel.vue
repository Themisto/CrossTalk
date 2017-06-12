<template>

<div id="avatar-panel">

  <h1>Avatar</h1>

  <div v-if="!image">
    <h2>Select an image</h2>
    <input type="file" @change="onFileChange">
  </div>

  <div v-else>
    <img :src="image" />
    <button @click="removeImage">Remove image</button>
  </div>

</div>





</template>


<script>

export default {

  data() {
    return {
      image: ''
    }

  },

  methods: {
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
  }

}



</script>


<style>

#avatar-panel {
  text-align: center;
}

#avatar-panel img {
  width: 90%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
  opacity: 1;
}

button {

}

</style>