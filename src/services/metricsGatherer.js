
export default class Gatherer {

  constructor(socket, userID) {
    if (!socket) { throw 'Gatherer requires a socket!'; };
    this.socket = socket;
    this.userID = userID;
    this.startTime = null;
    this.fromLang = null;
    this.toLang = null;
  };

  startCallWatcher(fromLang, toLang) {
    this.startTime = new Date;
    this.fromLang = fromLang;
    this.toLang = toLang;
  };

  sendCallData() {
    if (this.start) {
      let endTime = new Date;
      this.socket.emit('metric', {
        type: 'call',
        userID: this.userID,
        data: {
          duration: endTime - this.startTime,
          fromLang: this.fromLang,
          toLang: this.toLang
        }
      });
      this.start = null;  // Reset start time, just in case
    } else {
      console.error('MetricsGatherer: No data to send. Was .startCallWatcher() called?');
    }
  };

}
