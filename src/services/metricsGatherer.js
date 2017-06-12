
export default class Gatherer {

  constructor(socket, idToken) {
    if (!socket) { throw 'Gatherer requires a socket!'; };
    this.socket = socket;
    this.idToken = idToken;
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
        idToken: this.idToken,
        data: {
          duration: endTime - this.startTime / 1000,  // The call duration in seconds
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
