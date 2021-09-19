import Phaser from 'phaser';

export default class LyricLineObject {

    public scene;
    public lyricLine: Array<Phaser.GameObjects.Text>;
    public textLineLength = 0;
    public lyricLineAddPos = 0;

    //下部の歌詞部分
    constructor(scene: Phaser.Scene) {
        this.lyricLine = [];
        this.scene = scene;
    }

    public initLyricLine(lyrics) {
        for (let i = 0; i < lyrics.length; i++) {
            this.lyricLine[i] = this.scene.add.text(0, 636, lyrics[i].getText(), { font: '32px Arial' });
            this.lyricLine[i].x = 180 + (this.textLineLength * 35);
            this.lyricLine[i].setStroke(lyrics[i].color, 5);
            this.lyricLine[i].setVisible(true);
            this.textLineLength += lyrics[i].getText().length;
            this.lyricLineAddPos++;
            if (this.textLineLength > 15) {
                break;
            }
        }
    }

    public updateLyricLine(lyrics, currentLyricIndex) {
        // 打ち出した歌詞より前のデータが残っていない確認して、あったら削除
        for (let i = 0; i < currentLyricIndex - 1; i++) {
            if (typeof this.lyricLine[i] !== "undefined") {
                this.lyricLine[i].setVisible(false);
                this.lyricLine[i].destroy(true);
            }
        }

        // 直前に打ち出した歌詞がない、または歌詞が進んでない場合はreturn
        if (typeof currentLyricIndex == "undefined" ||
            typeof lyrics[currentLyricIndex] == "undefined" ||
            typeof this.lyricLine[currentLyricIndex] == "undefined") {
            return;
        }

        // 打ち出した歌詞は削除
        this.lyricLine[currentLyricIndex].setVisible(false);
        this.lyricLine[currentLyricIndex].destroy(true);

        // 打ち出した分だけ既存の歌詞を進める
        let lyricLineLength = 0;
        for (let i = currentLyricIndex + 1; i < this.lyricLine.length; i++) {
            this.lyricLine[i].x = 180 + (lyricLineLength * 35);
            lyricLineLength += this.lyricLine[i].text.length;
        }

        // 残りの歌詞を追加する
        for (let i = this.lyricLineAddPos; i < lyrics.length; i++) {
            // 下部の歌詞表示上限判定
            if (lyricLineLength > 17) {
                break;
            }
            this.lyricLine[i] = this.scene.add.text(0, 636, lyrics[i].getText(), { font: '32px Arial' });
            this.lyricLine[i].x = 180 + (lyricLineLength * 35);
            this.lyricLine[i].setStroke(lyrics[i].color, 5);
            lyricLineLength += lyrics[i].getText().length;
            this.lyricLineAddPos++;
        }
    }
}