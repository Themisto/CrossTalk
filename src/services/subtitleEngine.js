

export default class SubtitleEngine {

  constructor(videoElement, language, options) {
    if (arguments.length < 2) { throw 'SubtitleEngine requires a video element and a BCP-47 language tag'; }
    this.video = videoElement;
    this.language = language;
    this.duration = options ? options.duration || 2000 : 2000; // Lifespan of a subtitle/cue in milliseconds
    this.maxLength = options ? options.maxLength || 80 : 80; // Max length of a subtitle/cue in characters
    // this.queue = [];    // Cue queue
    this.lastCueTime = 0;

    // Add subtitle track
    this.track = this.video.addTextTrack('subtitles', 'Translation', this.language);
    // Set visibility. Maybe this should toggle based on if there's anything in the queue?
    this.track.mode = "showing";
    this.conditionSubtitle = this.conditionSubtitle.bind(this);
    this.push = this.push.bind(this);

    // Watch queue
  }

  conditionSubtitle(text) {
    if (text.length > this.maxLength) {
      let index = 79;
      while (text[index] !== ' ') {
        --index;
      }
      let left = text.substring(0, index);
      let right = text.substring(index + 1, text.length);

      return [left].concat(this.conditionSubtitle(right));

    } else {
      return [text];
    }
  }

  push(text) {
    let subtitles = this.conditionSubtitle(text);
    for (var i = 0; i < subtitles.length; i++) {
      let startTime = Math.max(this.lastCueTime, this.video.currentTime) + .25;
      let endTime = startTime + (this.duration / 1000);
      this.track.addCue(new VTTCue(startTime, endTime, subtitles[i]));
      this.lastCueTime = endTime;
    }
  }

  // processQueue() {

  // }

}
