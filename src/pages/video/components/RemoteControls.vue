<template>
  <div id="controls">
    <div id="addFriend" v-on:click="handleAddFriend">
      <p>+</p>
    </div>
    <div id="votes">
      <div>
        <p id="upvote" v-on:click="handleVote('up')">&#9757</p>
        <p id="downvote" v-on:click="handleVote('down')">&#9759</p>
      </div>
      <p v-if="this.partnerRating !== null">{{this.partnerRating}}</p>
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
        publicId: null,
        rating: null,
        partnerId: null,
        partnerRating: null,
        friendAdded: false,
        votes: {
          up: false,
          down: false
        }
      }
    },
    watch: {
      socketReady: function() {
        this.registerListeners();
      },
      inCall: function() {
        this.inCall && this.sendPublicData();
      }
    },
    methods: {
      // Convenience method for logging debugging messages
      log: function() {
        this.verbose && console.log.apply(console, ['RemoteControls:', ...arguments]);
      },

      registerListeners: function() {
        this.socket.on('relay', (data) => {
          if (data.type === 'publicData') {
            this.log(`Received partner's public data`);
            this.partnerId = data.publicId;
            this.partnerRating = data.rating;
          }
        });

        this.log('Component ready');
      },

      getPublicId: function() {
        this.log(`Attempting to fetch current user's public id...`);
        axios.get('/api/users/publicId', {
          headers: {'x-access-token': `Bearer ${localStorage.id_token}`}
        })
        .then(response => {
          this.publicId = response.data;
          if (this.inCall) { this.sendPublicData(); }
        })
        .catch(err => console.error('Failure retrieving public id:', err));
      },

      getRating: function() {
        this.log(`Attempting to fetch current user's rating...`);
        axios.get('/api/users/rating', {
          headers: {'x-access-token': `Bearer ${localStorage.id_token}`}
        })
        .then(response => {
          this.rating = response.data;
          if (this.inCall) { this.sendPublicData(); }
        })
        .catch(err => console.error('Failure retrieving public id:', err));
      },

      sendPublicData: function() {
        if (this.publicId !== null && this.rating !== null) {
          this.log('Sending public data...');
          this.socket.relay({
            type: 'publicData',
            publicId: this.publicId,
            rating: this.rating.net
          });
        }
      },

      handleAddFriend: function() {
        if (this.partnerId && !this.friendAdded) {
          this.log('Attempting to add friend...');
          this.friendAdded = true;  // Set boolean so user can't spam the button
          this.addFriendButton.setAttribute('background-color', 'grey');
          axios.post(
            '/api/users/friends',
            { friendId: this.partnerId },
            { headers: {'x-access-token': `Bearer ${localStorage.id_token}`} }
          )
          .then(response => this.log('Successfully added friend'))
          .catch(err => {
            console.error('Failed to add friend:', err);
            this.addFriendButton.setAttribute('background-color', 'black');
            this.friendAdded = false;
          });
        }
      },

      handleVote: function(direction) {
        if (this.partnerId) {
          this.log(`Attempting to update partner's rating...`);
          this.votes[direction] = !this.votes[direction];
          let votesData = {
            partnerId: this.partnerId,
            votes: {
              up: direction === 'up' ? (this.votes.up ? 1 : -1) : 0,
              down: direction === 'down' ? (this.votes.down ? 1 : -1) : 0
            }
          };
          this.partnerRating += votesData.votes.up - votesData.votes.down;
          this.partnerRating
          axios.put(
            '/api/users/rating',
            votesData,
            { headers: {'x-access-token': `Bearer ${localStorage.id_token}`} }
          )
          .then(response => this.log('Successfully updated user rating'))
          .catch(err => {
            console.err('Failed to update rating:', err);
          });
        }
      }
    },
    mounted: function() {
      this.addFriendButton = document.getElementById('addFriend');
      this.getPublicId();
      this.getRating();
    }
  }

</script>



<style scoped>
  #controls {
    position: absolute;
    top: 80px;
    display: flex;
  }

  #controls > *:hover {
    cursor: pointer;
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

  #addFriend:hover {
    background-color: #42b883;

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