import Lyric from "../Lyric";
import TextaliveApiManager from "../TextaliveApiManager";
import image from "../assets/*.png";

// クリック箇所のY座標を保存
var touchY = 5;

export default class GameMain extends Phaser.Scene {

    public frameCount = 0;

    public api;

    public firstLane = 100;
    public secondLane = 300;
    public thirdLane = 500;

    // APIから取得した歌詞情報
    public lyrics;

    // 流れる歌詞データを格納しておく
    public textData = [];
    // 流れる歌詞を走査するときの出発点(計算時間短縮のため)
    public indexStart = 0;
    // 歌詞の進むスピード
    public counter = 30;

    // 歌詞の出現するY座標(キャラの位置と同意)
    public lyricY;

    // ハートのX座標
    public heartX = 150;

    // ゲームのスコア
    public score = 0;
    public scoreText;

    // 動作オブジェクト
    public mikuImg;

    // ラインオブジェクト
    public firstLaneHeart;
    public secondLaneHeart;
    public thirdLaneHeart;

    // ハートオブジェクト
    public firstLaneLine;
    public secondLaneLine;
    public thirdLaneLine;

    // 歌詞表示部分
    public lyricLine = [];
    public lyricLineStartPos = 0;



    public initFlag = true;



    constructor() {
        super({ key: 'GameMain' })
    }

    preload(): void {
        console.log("preload()");
        var url = "https://www.youtube.com/watch?v=bMtYf3R0zhY";
        this.api = new TextaliveApiManager(url);
        this.api.init();
        this.load.image('backImg', image['back_img']);
        //var backImage = document.createElement("https://img.youtube.com/vi/bMtYf3R0zhY/mqdefault.jpg");
        //backImage.src =  "https://img.youtube.com/vi/bMtYf3R0zhY/mqdefault.jpg";
        //this.load.image('backImg', backImage);

        // 操作キャラ
        this.load.image('miku', image['mini_miku']);

        // ハート
        this.load.image('heart_red', image['heart_red']);
        this.load.image('heart_yellow', image['heart_yellow']);
        this.load.image('heart_green', image['heart_green']);
        this.load.image('heart_blue', image['heart_blue']);

        // ライン
        this.load.image('line_red', image['line_red']);
        this.load.image('line_yellow', image['line_yellow']);
        this.load.image('line_green', image['line_green']);
        this.load.image('line_blue', image['line_blue']);

    }

    create(): void {
        console.log("create()");
        // 背景
        var backImg = this.add.image(500, 350, 'backImg');
        backImg.alpha = 0.5;

        // ミクの設定
        this.lyricY = this.firstLane;
        this.mikuImg = this.add.image(900, this.lyricY, 'miku');
        this.mikuImg.scaleX = this.mikuImg.scaleX * 0.6;
        this.mikuImg.scaleY = this.mikuImg.scaleY * 0.6;

        // ハートオブジェクト
        var scale = 0.9;
        this.firstLaneHeart = this.add.image(this.heartX, this.firstLane, 'heart_red');
        this.firstLaneHeart.scaleX = this.firstLaneHeart.scaleX * scale;
        this.firstLaneHeart.scaleY = this.firstLaneHeart.scaleY * scale;
        this.secondLaneHeart = this.add.image(this.heartX, this.secondLane, 'heart_yellow');
        this.secondLaneHeart.scaleX = this.secondLaneHeart.scaleX * scale;
        this.secondLaneHeart.scaleY = this.secondLaneHeart.scaleY * scale;
        this.thirdLaneHeart = this.add.image(this.heartX, this.thirdLane, 'heart_green');
        this.thirdLaneHeart.scaleX = this.thirdLaneHeart.scaleX * scale;
        this.thirdLaneHeart.scaleY = this.thirdLaneHeart.scaleY * scale;

        // ラインのオブジェクト
        var lineScale = 0.9;
        this.firstLaneLine = this.add.image(430, this.firstLane, 'line_red');
        this.firstLaneLine.scaleX = this.firstLaneLine.scaleX * 0.4;
        this.firstLaneLine.scaleY = this.firstLaneLine.scaleY * 0.5;
        this.secondLaneLine = this.add.image(430, this.secondLane, 'line_yellow');
        this.secondLaneLine.scaleX = this.secondLaneLine.scaleX * 0.4;
        this.secondLaneLine.scaleY = this.secondLaneLine.scaleY * 0.5;
        this.thirdLaneLine = this.add.image(430, this.thirdLane, 'line_green');
        this.thirdLaneLine.scaleX = this.thirdLaneLine.scaleX * 0.4;
        this.thirdLaneLine.scaleY = this.thirdLaneLine.scaleY * 0.5;

        // スコアの設定
        var scoreT = this.add.text(30, 625, "Score", { font: '18px Arial' });
        scoreT.setStroke("black", 10);
        this.scoreText = this.add.text(30, 650, String(this.score), { font: '18px Arial' });
        this.scoreText.setStroke("black", 10);

        // 曲の長さを取得
        //this.api

    }

    update() {

        // シークしている確認
        // console.log(this.api.isVideoSeeking())

        // クリックした際に3レーンのいずれかに移動する
        if (touchY > 0 && touchY < 200) {
            this.lyricY = this.firstLane;
        } else if (touchY >= 250 && touchY < 400) {
            this.lyricY = this.secondLane;
        } else if (touchY >= 450 && touchY < 700) {
            this.lyricY = this.thirdLane;
        }

        // ミクの場所の更新
        this.mikuImg.y = this.lyricY;

        // 曲が流れているときだけ動く
        if (this.api.getPositionTime() != null && this.api.getPositionTime() != 0) {

            // 初回だけ曲が流れたタイミングで歌詞データを取得する
            // (曲が開始しないと曲データがうまくとってこれないため)
            if (this.initFlag) {
                this.lyrics = this.api.getLyrics();
                console.log(this.lyrics);

                this.initFlag = false;
            }
            // 歌詞表示
            this.updateLyricLine();

            const time = this.api.getPositionTime();
            var lyric = this.api.getCurrentLyric(time);
            var lyricText;
            var lyricIndex;
            if (lyric != null) {
                lyricText = lyric.text;
                lyricIndex = lyric.index;
            }

            // 各ラインの色を変更する
            // if (this.api.getIsChorus()) {
            //     var color = "blue";
            //     this.setLaneColor("first", color);
            //     this.setLaneColor("second", color);
            //     this.setLaneColor("third", color);
            // } else {
            //     this.setLaneColor("first", "red");
            //     this.setLaneColor("second", "yellow");
            //     this.setLaneColor("third", "green");
            // }

            // 横に流れる歌詞データの追加
            lyricText = this.api.getCurrentLyricText(time);
            lyricIndex = this.api.getCurrentLyricIndex(time);
            if (typeof this.textData[lyricIndex] === "undefined" && lyricText != null && lyricText != "" && lyricText != " ") {
                this.textData[lyricIndex] = this.add.text(800, this.lyricY - 20, lyricText, { font: '50px Arial' });
                //console.log("out index " + lyricIndex + " text : " + lyricText + " time : " + time);
                this.textData[lyricIndex].setStroke(lyric.color, 10);
                this.lyricLineStartPos++;
            }
        }

        // テキストの描画更新
        for (var i = this.indexStart; i < this.textData.length; i++) {

            // 文字を移動させる
            if ((typeof this.textData[i] !== "undefined")) {
                this.textData[i].x -= this.counter;

                // 一定区間移動したら歌詞を非表示する
                if (this.textData[i].x < this.heartX) {
                    this.indexStart++;
                    //                this.textData[i].setVisible(false);
                    this.textData[i].destroy(this);
                    // score計算を行う
                    this.score = this.calcScore(i, this.score);
                    this.scoreText.setText("Score : " + this.score);
                }
            }
        }
    }

    /**
     * スコアの計算を行う
     */
    private calcScore(textIndex: number, score: number): number {

        var textColor = this.textData[textIndex].style.stroke;
        if (this.textData[textIndex].y > 0 && this.textData[textIndex].y < 200) {
            if (this.firstLaneHeart.texture.key.includes(textColor)) {
                score = score + 500;
            } else {
                score = score + 10;
            }
        } else if (this.textData[textIndex].y >= 250 && this.textData[textIndex].y < 400) {
            if (this.secondLaneHeart.texture.key.includes(textColor)) {
                score = score + 500;
            } else {
                score = score + 10;
            }
        } else if (this.textData[textIndex].y >= 450 && this.textData[textIndex].y < 700) {
            if (this.thirdLaneHeart.texture.key.includes(textColor)) {
                score = score + 500;
            } else {
                score = score + 10;
            }
        }

        return score;
    }


    private updateLyricLine() {

        var textLengthLine1 = 0;
        // 前回の表示を削除
        for (var i = 0 ; i < this.lyricLine.length; i++) {
            this.lyricLine[i].destroy(this);
        }
        // 表示する歌詞の更新
        for (var i = this.lyricLineStartPos; i < this.lyrics.length ; i++) {
            var textLength = this.lyrics[i].getText().length;

            if (this.lyrics[i].getText() != "" && this.lyrics[i].getText() != " ") {
                
                this.lyricLine[i] = this.add.text(150 + (textLengthLine1 * 30), 600, this.lyrics[i].getText(), { font: '25px Arial' });
                this.lyricLine[i].setStroke(this.lyrics[i].color, 5);
                textLengthLine1 += textLength;
            }
            // 一定の長さになったら歌詞の連結をやめる
            if (textLengthLine1 > 15) {
                break;
            }
        }

    }

    /**
     *  レーンの色を可変にする
     */
    private setLaneColor(laneName: String, color: String) {

        var scale = 0.9;
        switch (laneName) {
            case "first":
                this.firstLaneHeart.destroy(this);
                this.firstLaneHeart = this.add.image(this.heartX, this.firstLane, 'heart_' + color);
                this.firstLaneHeart.scaleX = this.firstLaneHeart.scaleX * scale;
                this.firstLaneHeart.scaleY = this.firstLaneHeart.scaleY * scale;
                this.firstLaneLine.destroy(this);
                this.firstLaneLine = this.add.image(430, this.firstLane, 'line_' + color);
                this.firstLaneLine.scaleX = this.firstLaneLine.scaleX * 0.4;
                this.firstLaneLine.scaleY = this.firstLaneLine.scaleY * 0.5;
                break;
            case "second":
                this.secondLaneHeart.destroy(this);
                this.secondLaneHeart = this.add.image(this.heartX, this.secondLane, 'heart_' + color);
                this.secondLaneHeart.scaleX = this.secondLaneHeart.scaleX * scale;
                this.secondLaneHeart.scaleY = this.secondLaneHeart.scaleY * scale;
                this.secondLaneLine.destroy(this);
                this.secondLaneLine = this.add.image(430, this.secondLane, 'line_' + color);
                this.secondLaneLine.scaleX = this.secondLaneLine.scaleX * 0.4;
                this.secondLaneLine.scaleY = this.secondLaneLine.scaleY * 0.5;
                break;
            case "third":
                this.thirdLaneHeart.destroy(this);
                this.thirdLaneHeart = this.add.image(this.heartX, this.thirdLane, 'heart_' + color);
                this.thirdLaneHeart.scaleX = this.thirdLaneHeart.scaleX * scale;
                this.thirdLaneHeart.scaleY = this.thirdLaneHeart.scaleY * scale;

                this.thirdLaneLine.destroy(this);
                this.thirdLaneLine = this.add.image(430, this.thirdLane, 'line_' + color);
                this.thirdLaneLine.scaleX = this.thirdLaneLine.scaleX * 0.4;
                this.thirdLaneLine.scaleY = this.thirdLaneLine.scaleY * 0.5;
                break;
            default:
                console.log("定義されていないレーンです");
                break;
        }


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