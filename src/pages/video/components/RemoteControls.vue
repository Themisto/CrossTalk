<template>
  <div id="controls">
    <div id="add" v-on:click="handleAddFriend">
      <p>+</p>
    </div>
    <div id="votes">
      <div>
        <p id="upvote" v-on:click="handleUpvote">&#9757</p>
        <p id="downvote" v-on:click="handleDownvote">&#9759</p>
      </div>
      <p>1234</p>
    </div>
  </div>
</template>



<script>

  import axios from 'axios';

  export default {
    props: [
      'socket',
      'socketReady',
      'roomJoined'
    ],
    data: function() {
      return {
        partnerId: null,
        publicId: null
      }
    },
    watch: {
      socketReady: this.registerListeners,
      roomJoined: function() {

      }
    },
    methods: {
      registerListeners: function() {
        this.socket.on('relay', (data) => {
          if (data.type === 'publicId') {
            this.partnerId = data.publicId;
          }
        });
      },

      getPublicId: function() {
        axios.get('/api/users/publicId', {
          headers: {'x-access-token': `Bearer ${localStorage.id_token}`}
        })
        .then(response => {
          this.publicId = response.data;
        })
        .catch(err => {
          console.error('Failure retrieving public id:', err);
        });
      },

      sendPublicId: function() {
        if (this.publicId) {
          this.socket.relay({
            type: 'publicId',
            publicId: this.id_public
          });
        }
      }
    },
    mounted: function() {
      this.getPublicId();
    }
  }

</script>



<style scoped>
  #controls {
    position: absolute;
    top: 70px;
    display: flex;
  }

  #add {
    height: 40px;
    width: 40px;
    background-color: black;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    margin-top: 10px;
  }

  #votes {
    height: 40px;
    /*width: 40px;*/
    margin-left: 10px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>