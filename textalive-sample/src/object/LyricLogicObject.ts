export default class LyricLogicObject {
    public textAliveAPI;
    public targetTime = 1500; // ms
    public targetTime2 = 1000; // ms
    public now_color = "#ff8e1e";

    constructor(textAliveAPI) {
        this.textAliveAPI = textAliveAPI;
    }

    // 単語の色つけロジック
    public setLyricColor() {
        let nextChangeColorTime = 0; // 色切り替え時の最低限の待たないといけない時間
        let preCheckTime = 0; // 色切り替え時の発話スタートタイム
        let lyricColor = this.getRandomColor();
        for (let i = 0; i < this.textAliveAPI.lyrics.length; i++) {
            if (
                i < this.textAliveAPI.lyrics.length - 1 && // 最後の文字の次が取得できないため
                nextChangeColorTime < this.textAliveAPI.lyrics[i].startTime && // 色を変える際の最低限の間隔の担保
                this.textAliveAPI.lyrics[i + 1].startTime - preCheckTime >=
                    this.targetTime2 // 最低限の発話幅の担保
            ) {
                nextChangeColorTime =
                    this.textAliveAPI.lyrics[i].startTime + this.targetTime;
                preCheckTime = this.textAliveAPI.lyrics[i].startTime;
                lyricColor = this.getRandomColor();
                this.now_color = lyricColor;
            }
            this.textAliveAPI.lyrics[i].color = lyricColor;
        }
    }

    // 前回と同じ色にはならないようにランダムに色を返す
    private getRandomColor(): string {
        let color;
        let num = Math.floor(Math.random() * 3);
        switch (num) {
            case 0:
                color = "#ff8e1e"; // 橙
                break;
            case 1:
                color = "#47ff47"; // 緑
                break;
            case 2:
                color = "#ffdc00"; // 黄
                break;
            default:
                color = "#ff8e1e"; // 青
                break;
        }

        // 連続して同じ色にならないようにする
        if (this.now_color === color) {
            this.getRandomColor();
        }
        return color;
    }
}