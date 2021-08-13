import Lyric from "../Lyric";
import TextaliveApiManager from "../TextaliveApiManager"

// クリック箇所のY座標を保存
var touchY = 5;


export default class GameMain extends Phaser.Scene {
    public api;

    public textData = [];

    public indexStart = 0;

    public counter = 10;

    // 歌詞の出現するY座標
    public lyricY = 60;

    // ゲームのスコア
    public score = 0;
    public scoreText;


    constructor() {
        super({ key: 'Main' })
    }

    preload() {
        console.log("preload()");
        this.api = new TextaliveApiManager();
        this.api.init();
    }

    create() {
        console.log("create()");
        this.scoreText = this.add.text(50, 500, "Score : " + this.score , { font: '30px Arial' });
    }

    update() {

        // クリックした際に3レーンのいずれかに移動する
        if (touchY > 0 && touchY < 120) {
            this.lyricY = 60;
        } else if (touchY >= 120 && touchY < 240) {
            this.lyricY = 180;
        } else if (touchY >= 241 && touchY < 400) {
            this.lyricY = 300;
        }

        // 曲が流れているときだけ動く
        if (this.api.getPositionTime() != null && this.api.getPositionTime() != 0) {
            // 若干速めに表示するために500ms追加する
            const time = this.api.getPositionTime() + 500;
            var lyric = this.api.getCurrentLyric(time);
            var lyricText;
            var lyricIndex;
            if (lyric != null ) { 
                lyricText = lyric.text;
                lyricIndex = lyric.index;
            }
            // lyricText = this.api.getCurrentLyricText(time);
            // lyricIndex = this.api.getCurrentLyricIndex(time);

            // 歌詞データの追加
            if ( lyricText != null) {
                this.textData[lyricIndex] = this.add.text(595, this.lyricY, lyricText, { font: '30px Arial' });
            }
        }

        // テキストの描画更新
        console.log("this.indexStart : " + this.indexStart);
        for (var i = this.indexStart; i < lyricIndex; i++) {
            if (typeof this.textData[i] === "undefined") {
                continue;
            }
            // 一定区間移動したら歌詞を非表示する
            if (this.textData[i].x < 15) {
                //this.indexStart++;
                this.textData[i].setVisible(false);
                // score計算を行う
                this.score = this.calcScore(this.score);
                this.scoreText.setText("Score : " + this.score);
            }
            // 文字を移動させる
            if ((typeof this.textData[i] !== "undefined")) {
                console.log(typeof this.textData[i].x);
                this.textData[i].x -= this.counter;
            }
            // console.log("テキストの座標：" + this.textData[i].x + "," + this.textData[i].y);
            // console.log("current text update data : " + lyric);
        }
    }

    //  
    private calcScore(score:number) : number{

        score = score + 100;
        return score;
    }
}


var touchHandler = function (e) {
    var x = 0, y = 0;
    if (e.touches && e.touches[0]) {

        x = e.touches[0].clientX;
        y = e.touches[0].clientY;

    }
    else if (e.clientX && e.clientY) {

        x = e.clientX;
        y = e.clientY;
    }
    touchY = y;
    console.log("タッチx座標 : " + x);
    console.log("タッチy座標 : " + y);
};

// タッチイベント
window.addEventListener('touchstart', touchHandler, false);
// クリックイベント
window.addEventListener('click', touchHandler, false);