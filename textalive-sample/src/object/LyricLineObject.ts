import Phaser from "phaser";
import gameImage from "../assets/game_main/*.png";

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
        // 歌詞の初期設定
        for (let i = 0;  i < lyrics.length; i++) {
            this.lyricLine[i] = this.scene.add.text(
                0,
                636,
                lyrics[i].getText(),
                {
                    font: "32px Arial",
                }
            ).setVisible(false);
            this.lyricLine[i].setStroke(lyrics[i].color, 4);
        }

        // 最初に表示する歌詞のセット
        for (let i = 0; i < lyrics.length; i++) {
            this.lyricLine[i].x = 180 + this.textLineLength * 35;
            this.lyricLine[i].setStroke(lyrics[i].color, 4);
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

        // 打ち出した歌詞は削除
        this.lyricLine[currentLyricIndex].setVisible(false);
        this.lyricLine[currentLyricIndex].destroy(true);

        // 打ち出した分だけ既存の歌詞を進める
        let lyricLineLength = 0;
        for (let i = currentLyricIndex + 1; i < this.lyricLineAddPos; i++) {
            this.lyricLine[i].x = 180 + lyricLineLength * 35;
            if (this.lyricLine[i].text.match(/^[A-Za-z0-9]*$/)) {
                lyricLineLength += this.lyricLine[i].text.length/2;
            } else {
                lyricLineLength += this.lyricLine[i].text.length;
            }
        }

        // 残りの歌詞を追加する
        for (let i = this.lyricLineAddPos; i < lyrics.length; i++) {
            // 下部の歌詞表示上限判定
            if (lyricLineLength > 17) {
                break;
            }
            this.lyricLine[i].x = 180 + lyricLineLength * 35;
            this.lyricLine[i].setVisible(true);
            this.lyricLine[i].setStroke(lyrics[i].color, 4);
            if (lyrics[i].getText().match(/^[A-Za-z0-9]*$/)) {
                lyricLineLength += lyrics[i].getText().length/2;
            } else {
                lyricLineLength += lyrics[i].getText().length;
            }
            this.lyricLineAddPos++;
        }
    }
}
