export default class CharText {
  index;

  // 歌詞情報
  text;
  startTime;
  endTime;
  duration;

  constructor(data, index) {
    this.text = data.text; // 歌詞文字
    this.startTime = data.startTime; // 開始タイム [ms]
    this.endTime = data.endTime; // 終了タイム [ms]
    this.duration = data.duration; // 開始から終了迄の時間 [ms]
    this.index = index;
  }

  setIndex(index) {
    this.index = index;
    // console.log("index : " + index + " text : "+ this.text + "startTime : " +this.startTime + " endtime : "+ this.endTime)
  }

  getIndex() {
    return this.index;
  }

  getText(): String {
    return this.text;
  }
}