import Phaser from "phaser";
import Lyric from "../Lyric";
import LaneHeartObject from '../object/LaneHeartObject';
import TimeProgressBarObject from '../object/TimeProgressBarObject';
import TextaliveApiManager from "../TextaliveApiManager";
import MusicSelect from "MusicSelect";
import image from "../assets/*.png";
import artistImage from "../assets/live_artist/*.png";

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

    public musicStart = false;

    public firstLane :number = 120;
    public secondLane :number= 320;
    public thirdLane :number= 520;

    public gameTouchX;
    public gameTouchY; 

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

    // ハートオブジェクト
    private laneHeartObjectArray: Array<LaneHeartObject>;
    static readonly LANE_HEART_OBJECT_ARRAY_SIZE: number = 3;

    // ハートのX座標
    public heartX = 120;

    // ゲームのスコア
    public score:number = 0;
    public scoreText;

    // 動作オブジェクト
    public mikuImg;

    // ラインオブジェクト
    public r:number = 0;
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

    // プログレスバー
    private timeProgressBar: TimeProgressBarObject;

    constructor() {
        super({ key: 'GameMain' })
    }

    init(): void {
        this.musicSelectScene = this.scene.get("MusicSelect") as MusicSelect;
        
        console.log(this.musicSelectScene.selectMusic[2]);
        var url = this.musicSelectScene.selectMusic[2];

        //var url = "https://www.youtube.com/watch?v=bMtYf3R0zhY";
        this.api = new TextaliveApiManager(url);
        this.api.init();

        this.laneHeartObjectArray = new Array(GameMain.LANE_HEART_OBJECT_ARRAY_SIZE);
        for(let i = 0; i < GameMain.LANE_HEART_OBJECT_ARRAY_SIZE; i++) {
            this.laneHeartObjectArray[i] = new LaneHeartObject();
        }

        this.timeProgressBar = new TimeProgressBarObject();
    }

    preload(): void {
        console.log("preload()");
    
        this.load.image('backImg', image['back_img']);
        //var backImage = document.createElement("https://img.youtube.com/vi/bMtYf3R0zhY/mqdefault.jpg");
        //backImage.src =  "https://img.youtube.com/vi/bMtYf3R0zhY/mqdefault.jpg";
        //this.load.image('backImg', backImage);

        // 操作キャラ
        this.load.image('miku', artistImage['live-artist_miku_sd_01_182p']);

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

        // プログレスバー
        TimeProgressBarObject.preload(this.load);
    }

    create(): void {
        console.log("create()");
        // 背景
        var backImg = this.add.image(500, 350, 'backImg');
        backImg.alpha = 0.2;

        // ミクの設定
        this.lyricY = this.firstLane;
        this.mikuImg = this.add.image(1100, this.lyricY, 'miku');

        // ハートオブジェクト
        var scale = 0.5;
        const laneHeartImageParam: [number, number, string][] = [
            [this.heartX, this.firstLane, 'heart_red'],
            [this.heartX, this.secondLane, 'heart_yellow'],
            [this.heartX, this.thirdLane, 'heart_green'],
        ];
        for (let i = 0; i < this.laneHeartObjectArray.length; i++) {
            let image = this.add.image(laneHeartImageParam[i][0], laneHeartImageParam[i][1], laneHeartImageParam[i][2]);
            this.laneHeartObjectArray[i].create({
                image: image,
                scale: scale
            });
        }

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

        circleImg = this.add.image(500 - circleOffset, 5 - circleOffset,'circle');

        this.timeProgressBar.create({
            scene: this,
            posX: 580,
            posY: 625 + TimeProgressBarObject.BAR_SIZE.y * 0.5,
            textalivePlayer: this.api
        });

    }

    update() {


        let pointer = this.input.activePointer;

        if (pointer.isDown) {
            this.gameTouchX = pointer.x;
            this.gameTouchY = pointer.y;

            // パーティクルを発動
            emitter.explode(8, this.gameTouchX, this.gameTouchY);
    
            // タッチエフェクトを表示
            circleImg.setPosition(this.gameTouchX-circleOffset, this.gameTouchY-circleOffset);
            circleImg.setVisible(true);
            circleSwitch = true;
        }

        // ロードが終わり次第、楽曲をスタート
        if (!this.api.player.isPlaying && !this.api.player.isLoading && !this.musicStart) {
            this.api.player.requestPlay();
            this.musicStart = true;

            // プログレスバーを表示
            this.timeProgressBar.maxValue = this.api.player.data.song.length * 1000;
            this.timeProgressBar.setVisible(true);
        }

        if (typeof this.api.player.data.song != "undefined") {
            if (this.api.player.data.song.length-0.5 < (this.api.getPositionTime()/1000)) {
                console.log("完了画面へ");
                this.scene.start('GameResult');
            }
        }

        this.firstLaneLine.alpha = Math.abs(Math.sin(this.r));
        this.secondLaneLine.alpha = Math.abs(Math.sin(this.r));
        this.thirdLaneLine.alpha = Math.abs(Math.sin(this.r));
        if (this.r >= 360) {
            this.r = 0;
        } else {
            this.r += 0.05;
        }

        // ハートの伸縮
        for (let i = 0; i < this.laneHeartObjectArray.length; i++) {
            this.laneHeartObjectArray[i].update();
        }

        // シークしている確認
        // console.log(this.api.isVideoSeeking())

        // クリックした際に3レーンのいずれかに移動する
        if (this.gameTouchY > 0 && this.gameTouchY < 720 / 3) {
            this.lyricY = this.firstLane;
        } else if (this.gameTouchY >= 720 / 3 && this.gameTouchY < 720 / 3 * 2) {
            this.lyricY = this.secondLane;
        } else if (this.gameTouchY >= 720 / 3 * 2 && this.gameTouchY < 720) {
            this.lyricY = this.thirdLane;
        }

        // ミクの場所の更新
        this.tweens.add({
            //tweenを適応させる対象
            targets: this.mikuImg,
            //tweenさせる値
            y: this.lyricY,
            //tweenにかかる時間
            duration: 100,
            //tween開始までのディレイ
            delay: 0,
            //tweenのリピート回数（-1で無限）
            repeat: 0,
            //easingの指定
            ease: 'Linear',
        });

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
                    if (!this.laneHeartObjectArray[0].playAnimationFlag && nowLine == "first") {
                        this.laneHeartObjectArray[0].playStretchHeart();
                        this.setHeartTween(this.laneHeartObjectArray[0].image);
                    }
                    if (!this.laneHeartObjectArray[1].playAnimationFlag && nowLine == "second") {
                        this.laneHeartObjectArray[1].playStretchHeart();
                        this.setHeartTween(this.laneHeartObjectArray[1].image);
                    }
                    if (!this.laneHeartObjectArray[2].playAnimationFlag && nowLine == "third") {
                        this.laneHeartObjectArray[2].playStretchHeart();
                        this.setHeartTween(this.laneHeartObjectArray[2].image);
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

        this.timeProgressBar.update();

    }

    /**
     * スコアの計算を行う
     */
    private calcScore(textIndex: number, score: number): number {

        var textColor = this.textData[textIndex].style.stroke;
        if (this.textData[textIndex].y > 0 && this.textData[textIndex].y < 200) {
            if (this.laneHeartObjectArray[0].image.texture.key.includes(textColor)) {
                score = score + 500;
            } else {
                score = score + 10;
            }
        } else if (this.textData[textIndex].y >= 250 && this.textData[textIndex].y < 400) {
            if (this.laneHeartObjectArray[1].image.texture.key.includes(textColor)) {
                score = score + 500;
            } else {
                score = score + 10;
            }
        } else if (this.textData[textIndex].y >= 450 && this.textData[textIndex].y < 700) {
            if (this.laneHeartObjectArray[2].image.texture.key.includes(textColor)) {
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
            scale: 1.2,
            //tweenにかかる時間
            duration: 150,
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
            scale: (1*0.6)/1.2,
            //tweenにかかる時間
            duration: 200,
            //tween開始までのディレイ
            delay: 150,
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
                this.laneHeartObjectArray[0].image.destroy(true);
                this.laneHeartObjectArray[0].image = this.add.image(this.heartX, this.firstLane, 'heart_' + color);
                this.laneHeartObjectArray[0].image.scaleX *= scale;
                this.laneHeartObjectArray[0].image.scaleY *= scale;

                this.firstLaneLine.destroy(this);
                this.firstLaneLine = this.add.image(430, this.firstLane, 'line_' + color);
                this.firstLaneLine.scaleX = this.firstLaneLine.scaleX * 0.4;
                this.firstLaneLine.scaleY = this.firstLaneLine.scaleY * 0.5;
                break;
            case "second":
                this.laneHeartObjectArray[1].image.destroy(true);
                this.laneHeartObjectArray[1].image = this.add.image(this.heartX, this.secondLane, 'heart_' + color);
                this.laneHeartObjectArray[1].image.scaleX *= scale;
                this.laneHeartObjectArray[1].image.scaleY *= scale;

                this.secondLaneLine.destroy(this);
                this.secondLaneLine = this.add.image(430, this.secondLane, 'line_' + color);
                this.secondLaneLine.scaleX = this.secondLaneLine.scaleX * 0.4;
                this.secondLaneLine.scaleY = this.secondLaneLine.scaleY * 0.5;
                break;
            case "third":
                this.laneHeartObjectArray[2].image.destroy(true);
                this.laneHeartObjectArray[2].image = this.add.image(this.heartX, this.thirdLane, 'heart_' + color);
                this.laneHeartObjectArray[2].image.scaleX *= scale;
                this.laneHeartObjectArray[2].image.scaleY *= scale;

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