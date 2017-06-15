<template>
  <div id="controls">
    <div id="addFriend" v-on:click="handleAddFriend">
      <p>+</p>
    </div>
    <div id="votes">
      <div>
        <!-- <p id="upvote" v-on:click="handleUpvote">&#9757</p> -->
        <p id="upvote">&#9757</p>
        <!-- <p id="downvote" v-on:click="handleDownvote">&#9759</p> -->
        <p id="downvote">&#9759</p>
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
      'inCall',
      'verbose'
    ],
    data: function() {
      return {
        addFriendButton: null,
        upvoteButton: null,
        downvoteButton: null,
        partnerId: null,
        publicId: null,
        friendAdded: false
      }
    },
    watch: {
      socketReady: function() {
        this.registerListeners();
      },
      inCall: function() {
        this.inCall && this.sendPublicId();
      }
    },
    methods: {
      // Convenience method for logging debugging messages
      log: function() {
        this.verbose && console.log.apply(console, ['RemoteControls:', ...arguments]);
      },

      registerListeners: function() {
        this.socket.on('relay', (data) => {
          if (data.type === 'publicId') {
            this.log(`Received partner's public id "${data.publicId}"`);
            this.partnerId = data.publicId;
          }
        });

        this.log('Component ready');
      },

      getPublicId: function() {
        axios.get('/api/users/publicId', {
          headers: {'x-access-token': `Bearer ${localStorage.id_token}`}
        })
        .then(response => {
          this.publicId = response.data;
        })
        .catch(err => console.error('Failure retrieving public id:', err));
      },

      sendPublicId: function() {
        this.log('Sending public id');
        if (this.publicId) {
          this.socket.relay({
            type: 'publicId',
            publicId: this.publicId
          });
        }
      },

      handleAddFriend: function() {
        this.log('Attempting to add friend...');
        if (this.partnerId && !this.friendAdded) {
          this.friendAdded = true;  // Set boolean so user can't spam the button
          this.addFriendButton.setAttribute('background-color', 'grey');
          axios.post('/api/users/friends',
            { friendID: this.partnerId },
            {
              headers: {
                'x-access-token': `Bearer ${localStorage.id_token}`
              }
            }
          )
          .then(response => this.log('Successfully added friend'))
          .catch(err => {
            console.error('Failed to add friend:', err);
            this.addFriendButton.setAttribute('background-color', 'black');
            this.friendAdded = false;
          });
        }
      }
    },
    mounted: function() {
      this.addFriendButton = document.getElementById('addFriend');
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

  #addFriend {
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