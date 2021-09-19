export default class Lyric {
    index;

    // 歌詞情報
    text;
    startTime;
    endTime;
    duration;
    valence;
    arousal;
    color;

    constructor(data, index, color, valenceArousal) {
        this.text = data.text; // 歌詞文字
        this.startTime = data.startTime; // 開始タイム [ms]
        this.endTime = data.endTime; // 終了タイム [ms]
        this.duration = data.duration; // 開始から終了迄の時間 [ms]
        this.index = index;
        this.color = color;
        this.valence = valenceArousal.v; // 覚醒度
        this.arousal = valenceArousal.a; // 感情価
    }

    setIndex(index) {
        this.index = index;
        // console.log("index : " + index + " text : "+ this.text + "startTime : " +this.startTime + " endtime : "+ this.endTime)
    }

    getIndex() {
        return this.index;
    }

    getText(): string {
        return this.text;
    }
}
