import Lyric from "../Lyric";
import TextaliveApiManager from "../TextaliveApiManager";
import MusicSelect from "MusicSelect";
import image from "../assets/*.png";

// クリック箇所のY座標を保存
var touchY = 5;

// クリック箇所のX座標を保存
var touchX = 500;

// パーティクルマネージャーの宣言
var particles;

// エミッタ
var emitter;

// タッチエフェクトの処理
var circleScale = 0;
var circleImg;
var circleSwitch = false;
var circleOffset = 0; // 円の中心を示す値

export default class GameMain extends Phaser.Scene {

    public frameCount = 0;

    public api:TextaliveApiManager;

    public firstLane :number = 120;
    public secondLane :number= 320;
    public thirdLane :number= 520;

    // APIから取得した歌詞情報
    public lyrics;

    // 流れる歌詞データを格納しておく
    public textData = [];
    // 流れる歌詞を走査するときの出発点(計算時間短縮のため)
    public indexStart:number = 0;
    // 歌詞の進むスピード
    public counter = 30;

    // 歌詞の出現するY座標(キャラの位置と同意)
    public lyricY;

    // ハートのX座標
    public heartX = 120;
    public firstLaneHeartScaleFlag = false;
    public firstLaneHeartScaleCount = 0;
    public secondLaneHeartScaleFlag = false;
    public secondLaneHeartScaleCount = 0;
    public thirdLaneHeartScaleFlag = false;
    public thirdLaneHeartScaleCount = 0;

    // ゲームのスコア
    public score:number = 0;
    public scoreText;

    // 動作オブジェクト
    public mikuImg;

    // ラインオブジェクト
    public firstLaneHeart;
    public secondLaneHeart;
    public thirdLaneHeart;
    public r:number = 0;

    // ハートオブジェクト
    public firstLaneLine;
    public secondLaneLine;
    public thirdLaneLine;

    // 歌詞表示部分
    public lyricLine = [];
    public lyricLineStartPos = 0;

    public initFlag: Boolean = true;
    
    private musicSelectScene :MusicSelect; 

    // タッチエフェクトの表示時間
    private circleVisibleCounter = 0;
    
    constructor() {
        super({ key: 'GameMain' })
    }

    preload(): void {
        console.log("preload()");
        this.musicSelectScene = this.scene.get("MusicSelect") as MusicSelect;
        
        console.log(this.musicSelectScene.selectMusic[2]);
        var url = this.musicSelectScene.selectMusic[2];

        //var url = "https://www.youtube.com/watch?v=bMtYf3R0zhY";
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

        // タッチエフェクトに利用するアセット
        this.load.image('star', image['star']);
        this.load.image('circle', image['circle']);
    }

    create(): void {
        console.log("create()");
        // 背景
        var backImg = this.add.image(500, 350, 'backImg');
        backImg.alpha = 0.2;

        // ミクの設定
        this.lyricY = this.firstLane;
        this.mikuImg = this.add.image(1100, this.lyricY, 'miku');
        this.mikuImg.scaleX = this.mikuImg.scaleX * 0.6;
        this.mikuImg.scaleY = this.mikuImg.scaleY * 0.6;


        // ハートオブジェクト
        var scale = 0.5;
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
        this.firstLaneLine = this.add.image(500, this.firstLane, 'line_red');
        this.firstLaneLine.scaleX = this.firstLaneLine.scaleX * 0.53;
        this.firstLaneLine.scaleY = this.firstLaneLine.scaleY * 0.62;
        this.secondLaneLine = this.add.image(500, this.secondLane, 'line_yellow');
        this.secondLaneLine.scaleX = this.secondLaneLine.scaleX * 0.53;
        this.secondLaneLine.scaleY = this.secondLaneLine.scaleY * 0.62;
        this.thirdLaneLine = this.add.image(500, this.thirdLane, 'line_green');
        this.thirdLaneLine.scaleX = this.thirdLaneLine.scaleX * 0.53;
        this.thirdLaneLine.scaleY = this.thirdLaneLine.scaleY * 0.62;

        // スコアの設定
        var scoreT = this.add.text(30, 625, "Score", { font: '18px Arial' });
        scoreT.setStroke("black", 10);
        this.scoreText = this.add.text(30, 650, String(this.score), { font: '18px Arial' });
        this.scoreText.setStroke("black", 10);

        // パーティクル処理
        particles = this.add.particles('star');

        emitter = particles.createEmitter({

            //パーティクルのスケール（2から0へ遷移）
            scale: {
                start: 0.5, end: 0
            },

            //パーティクルの速度（minからmaxの範囲）
            speed: { min: 500, max: 50 },

            blendMode: 'SCREEN',

            frequency: -1,

            //パーティクルの放出数（エミット時に指定するので0を入れておく）
            quantity: 0,

            //パーティクルの寿命
            lifespan: 400

        });

        circleImg = this.add.image(touchX - circleOffset, touchY - circleOffset,'circle');
    }

    update() {

        // ロードが終わり次第、楽曲をスタート
        if (!this.api.player.isPlaying && !this.api.player.isLoading) {
            this.api.player.requestPlay();
        }

        this.firstLaneLine.alpha = Math.abs(Math.sin(this.r));
        this.secondLaneLine.alpha = Math.abs(Math.sin(this.r));
        this.thirdLaneLine.alpha = Math.abs(Math.sin(this.r));
        if (this.r >= 360) {
            this.r = 0;
        } else {
            this.r += 0.05;
        }

        // ハートの伸縮判定
        if (this.firstLaneHeartScaleFlag) {
            this.firstLaneHeartScaleCount++;
            if (this.firstLaneHeartScaleCount > 30) {
                this.firstLaneHeartScaleFlag = false;
                this.firstLaneHeartScaleCount = 0;
            }
        }
        if (this.secondLaneHeartScaleFlag) {
            this.secondLaneHeartScaleCount++;
            if (this.secondLaneHeartScaleCount > 30) {
                this.secondLaneHeartScaleFlag = false;
                this.secondLaneHeartScaleCount = 0;
            }
        }
        if (this.thirdLaneHeartScaleFlag) {
            this.thirdLaneHeartScaleCount++;
            if (this.thirdLaneHeartScaleCount > 30) {
                this.thirdLaneHeartScaleFlag = false;
                this.thirdLaneHeartScaleCount = 0;
            }
        }

        // シークしている確認
        // console.log(this.api.isVideoSeeking())

        // クリックした際に3レーンのいずれかに移動する
        if (touchY > 0 && touchY < 720 / 3) {
            this.lyricY = this.firstLane;
        } else if (touchY >= 720 / 3 && touchY < 720 / 3 * 2) {
            this.lyricY = this.secondLane;
        } else if (touchY >= 720 / 3 * 2 && touchY < 720) {
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
                    var wordY = this.textData[i].y
                    var nowLine = "";
                    if (wordY > 0 && wordY < 720 / 3) {
                        nowLine = "first";
                    } else if (wordY >= 720 / 3 && wordY < 720 / 3 * 2) {
                        nowLine = "second";
                    } else if (wordY >= 720 / 3 * 2 && wordY < 720) {
                        nowLine = "third";
                    }
                    if (!this.firstLaneHeartScaleFlag && nowLine == "first") {
                        this.firstLaneHeartScaleFlag = true;
                        this.setHeartTween(this.firstLaneHeart);
                    }
                    if (!this.secondLaneHeartScaleFlag && nowLine == "second") {
                        this.secondLaneHeartScaleFlag = true;
                        this.setHeartTween(this.secondLaneHeart);
                    }
                    if (!this.thirdLaneHeartScaleFlag && nowLine == "third") {
                        this.thirdLaneHeartScaleFlag = true;
                        this.setHeartTween(this.thirdLaneHeart);
                    }

                    // 歌詞の削除
                    this.textData[i].destroy(this);
                    // score計算を行う
                    this.score = this.calcScore(i, this.score);
                    this.scoreText.setText("Score : " + this.score);
                }
            }
        }

        // 円の表示秒数の間カウント
        if (this.circleVisibleCounter <= 6 && circleSwitch) {
            this.circleVisibleCounter++;
            circleScale += 0.08;
            circleImg.setAlpha(1.0);
            circleImg.scale = circleScale;

        }
        else {
            this.circleVisibleCounter = 0;
            circleScale = 0.01;
            circleImg.setVisible(false);
            circleSwitch = false;
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
        for (var i = 0; i < this.lyricLine.length; i++) {
            this.lyricLine[i].destroy(this);
        }
        // 表示する歌詞の更新
        for (var i = this.lyricLineStartPos; i < this.lyrics.length; i++) {
            var textLength = this.lyrics[i].getText().length;

            if (this.lyrics[i].getText() != "" && this.lyrics[i].getText() != " ") {

                this.lyricLine[i] = this.add.text(180 + (textLengthLine1 * 35), 636, this.lyrics[i].getText(), { font: '32px Arial' });
                this.lyricLine[i].setStroke(this.lyrics[i].color, 5);
                textLengthLine1 += textLength;
            }
            // 一定の長さになったら歌詞の連結をやめる
            if (textLengthLine1 > 15) {
                break;
            }
        }

    }

    private setHeartTween(heartObject) {
        this.tweens.add({
            //tweenを適応させる対象
            targets: heartObject,
            //tweenさせる値
            scale: 1.25,
            //tweenにかかる時間
            duration: 300,
            //tween開始までのディレイ
            delay: 0,
            //tweenのリピート回数（-1で無限）
            repeat: 0,
            //easingの指定
            ease: 'Linear',
        });
        this.tweens.add({
            //tweenを適応させる対象
            targets: heartObject,
            //tweenさせる値
            scale: (1*0.5)/1.25,
            //tweenにかかる時間
            duration: 300,
            //tween開始までのディレイ
            delay: 300,
            //tweenのリピート回数（-1で無限）
            repeat: 0,
            //easingの指定
            ease: 'Linear',
        });
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
    touchX = x;
    console.log("タッチx座標 : " + x);
    console.log("タッチy座標 : " + y);

    // パーティクルを発動
    emitter.explode(8, touchX, touchY);
    
    // タッチエフェクトを表示
    circleImg.setPosition(touchX-circleOffset,touchY-circleOffset);
    circleImg.setVisible(true);
    circleSwitch = true;
};

// タッチイベント
window.addEventListener('touchstart', touchHandler, false);
// クリックイベント
window.addEventListener('click', touchHandler, false);