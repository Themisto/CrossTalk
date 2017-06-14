<template>

<div id="avatar-panel">



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
  background: rgba(0,0,0,0.5);

  padding: 20px;

}

#avatar-panel img {
  width: 80%;
  height: 80%;
  margin: auto;
  display: flex;
  margin-bottom: 10px;
  border: 1px solid lime;
  /*background: rgba(0,0,0,0.9);*/
  /*opacity: 1;*/
}

button {

}

</style>