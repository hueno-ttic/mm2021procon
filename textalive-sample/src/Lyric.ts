export default class Lyric
{

    public index;

    // 歌詞情報
    public text;
    public startTime;
    public endTime;
    public duration;
    public valence;
    public arousal
    public color;

    constructor (data, index, color, valenceArousal)
    {
        this.text      = data.text;      // 歌詞文字
        this.startTime = data.startTime; // 開始タイム [ms]
        this.endTime   = data.endTime;   // 終了タイム [ms]
        this.duration  = data.duration;  // 開始から終了迄の時間 [ms]
        this.index     = index;
        this.color = color;               // 歌詞の色
        this.valence = valenceArousal.v;  // 覚醒度
        this.arousal = valenceArousal.a;  // 感情価

    }

    public setIndex(index) {
        this.index = index;
        //console.log("index : " + index + " text : "+ this.text + "startTime : " +this.startTime + " endtime : "+ this.endTime)
    }

    public getIndex() {
        return this.index;
    }

    public getText () :String{
        return this.text;
    }

}