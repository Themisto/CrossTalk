
export default class Gatherer {

  constructor(socket, userID) {
    if (!socket) { throw 'Gatherer requires a socket!'; };
    this.socket = socket;
    this.start = null;
  };

  startTimer(remoteVideoElement) {
    this.start = new Date;
  };

  sendTimeData() {
    if (this.start) {
      let end = new Date;
      this.socket.emit('metric', {
        type: 'callTime',
        userID: this.userID,
        data: end - this.start  // The duration of the call
      });
      this.start = null;  // Reset start time, just in case
    } else {
      console.error('MetricsGatherer: No data to send. Was .startTimer() called?');
    }
  };

}
