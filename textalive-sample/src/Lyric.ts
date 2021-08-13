export default class Lyric
{

    public index;

    // 歌詞情報
    public text;
    public startTime;
    public endTime;
    public duration;

    // 表示周り
    public x;
    public y;
    public isDraw;

    constructor (data)
    {
        this.text      = data.text;      // 歌詞文字
        this.startTime = data.startTime; // 開始タイム [ms]
        this.endTime   = data.endTime;   // 終了タイム [ms]
        this.duration  = data.duration;  // 開始から終了迄の時間 [ms]
        
        this.x = 0; // グリッドの座標 x
        this.y = 0; // グリッドの座標 y
        this.isDraw = false; // 描画するかどうか
    }

    public setIndex(index) {
        this.index = index;
        //console.log("index : " + index)
    }

    public getIndex() {
        return this.index;
    }

}