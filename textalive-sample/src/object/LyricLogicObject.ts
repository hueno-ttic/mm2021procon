export default class LyricLogicObject {
    public textAliveAPI;
    public target;

    //下部の歌詞部分
    constructor(textAliveAPI) {
        this.textAliveAPI = textAliveAPI;
    }

    public setLyricColor() {
        console.log("bpm : " + this.textAliveAPI.bpm);
        console.log("色変え : " + (this.textAliveAPI.bpm / 60) * 1000);
        console.log(
            "色変えの回数：" +
                (this.textAliveAPI.player.data.song.length - 0.5) /
                    (this.textAliveAPI.bpm / 60)
        );

        let changeColorCount = (this.textAliveAPI.bpm / 60) * 1000;

        let nextChangeColorTime = 0;
        let lyricColor = this.getRandomColor();
        for (let i = 0; i < this.textAliveAPI.lyrics.length; i++) {
            if (nextChangeColorTime < this.textAliveAPI.lyrics[i].startTime) {
                nextChangeColorTime =
                    this.textAliveAPI.lyrics[i].startTime + changeColorCount;
                lyricColor = this.getRandomColor();
            }
            this.textAliveAPI.lyrics[i].color = lyricColor;
        }
    }

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
        return color;
    }
}
