import Phaser from "phaser";
import Lyric from "../Lyric";
import LaneHeartObject from "../object/LaneHeartObject";
import AudienceObject from "../object/AudienceObject";
import TimeProgressBarObject from "../object/TimeProgressBarObject";
import TextaliveApiManager from "../TextaliveApiManager";
import TimeInfoObject from "../object/TimeInfoObject";
import UIPauseButtonObject from "../object/UIPauseButtonObject";
import TutorialObject from "../object/TutorialObject";
import LyricLineObject from "../object/LyricLineObject";
import HeartEffect from "../object/HeartEffect";
import TouchEffect from "../object/TouchEffect";
import DepthDefine from "../object/DepthDefine";
import { buildMusicInfo } from "../factory/MusicFactory";
import DebugInfo from "../object/DebugInfo";

import image from "../assets/*.png";
import gameImage from "../assets/game_main/*.png";
import artistImage from "../assets/live_artist/*.png";
import uiImage from "../assets/ui/*.png";
import soundSe from "../assets/sound/se/*.wav";
import Visualizer from "./audioVisualizer/app/presenter/visualizer";

export default class GameMain extends Phaser.Scene {
    private musics = buildMusicInfo();
    public frameCount = 0;

    public api: TextaliveApiManager;

    public musicStart = false;

    public firstLane: number = 120;
    public secondLane: number = 320;
    public thirdLane: number = 520;

    public lanePosition = [];

    // レーンごとのスコア
    public laneScoreSet: Array<number>;
    static readonly LANE_SIZE: number = 3;

    // 観客
    public audience: Array<Array<AudienceObject>>;
    static readonly AUDIENCE_SET_SIZE: number = 6;

    // タッチした際の座標
    public gameTouchX;
    public gameTouchY;

    // APIから取得した歌詞情報
    public lyrics;

    // 流れる歌詞データを格納しておく
    public textData = [];
    // 流れる歌詞を走査するときの出発点(計算時間短縮のため)
    public indexStart: number = 0;
    // 歌詞の進むスピード
    public counter = 30;

    // 歌詞の出現するY座標(キャラの位置と同意)
    public lyricY;

    // ハートオブジェクト
    private laneHeartObjectArray: Array<LaneHeartObject>;
    private heartParticleArray: Array<HeartEffect>;
    static readonly LANE_HEART_OBJECT_ARRAY_SIZE: number = 3;

    // ハートのX座標
    public heartX = 120;

    // ゲームのスコア
    public score: number = 0;
    public scoreText;

    // 動作オブジェクト
    public mikuImg;

    // ラインオブジェクト
    public r: number = 0;
    public firstLaneLine;
    public secondLaneLine;
    public thirdLaneLine;

    // 歌詞表示部分
    private lyricLineObject: LyricLineObject;

    public initFlag: Boolean = true;

    private selectedMusicId: number;

    // タッチエフェクトの表示時間
    private touchEffect: TouchEffect;

    // タッチ時のSE
    private touchSe: Phaser.Sound.BaseSound;

    // プログレスバー
    private timeProgressBar: TimeProgressBarObject;

    // 曲の進行時間
    private timeInfo: TimeInfoObject;

    // チュートリアル関連
    private tutorial: TutorialObject;

    // ポーズボタン
    private pauseButton: UIPauseButtonObject;

    // Visuzlizer
    private visualizer: Visualizer;

    // --------------------------------
    // デバッグ用
    private enableDebugInfo: boolean;
    private debugInfo: DebugInfo;

    constructor() {
        super({ key: "GameMain" });
    }

    init(): void {
        this.selectedMusicId = this.registry.get("selectedMusic");
        console.log(`選択楽曲id ${this.selectedMusicId}`);

        const selectedMusic = this.musics
            .filter((music) => music.id === this.selectedMusicId)
            .pop();

        var url = selectedMusic.url;

        //var url = "https://www.youtube.com/watch?v=bMtYf3R0zhY";
        this.api = new TextaliveApiManager(url);
        this.api.init();

        this.touchEffect = new TouchEffect();

        this.laneHeartObjectArray = new Array(
            GameMain.LANE_HEART_OBJECT_ARRAY_SIZE
        );
        this.heartParticleArray = new Array(
            GameMain.LANE_HEART_OBJECT_ARRAY_SIZE
        );
        for (let i = 0; i < GameMain.LANE_HEART_OBJECT_ARRAY_SIZE; i++) {
            this.laneHeartObjectArray[i] = new LaneHeartObject();
            this.heartParticleArray[i] = new HeartEffect();
        }

        // 観客
        this.audience = new Array();
        for (let j = 0; j < GameMain.LANE_SIZE; j++) {
            this.audience[j] = new Array(GameMain.AUDIENCE_SET_SIZE);
            for (let i = 0; i < GameMain.AUDIENCE_SET_SIZE; i++) {
                this.audience[j][i] = new AudienceObject(j, i);
            }
        }
        // レーンのy座標
        this.lanePosition[0] = 120;
        this.lanePosition[1] = 320;
        this.lanePosition[2] = 520;

        // スコアの初期化
        this.laneScoreSet = new Array();
        for (let i = 0; i < GameMain.LANE_SIZE; i++) {
            this.laneScoreSet[i] = 0;
        }

        this.timeProgressBar = new TimeProgressBarObject();
        this.timeInfo = new TimeInfoObject();

        // チュートリアル
        this.tutorial = new TutorialObject();

        // ボタン
        this.pauseButton = new UIPauseButtonObject();

        this.lyricLineObject = new LyricLineObject(this);

        // Visualizer
        this.visualizer = new Visualizer(this);
        this.visualizer.init();

        // --------------------------------
        // デバッグ用
        this.enableDebugInfo = false;
        if (this.enableDebugInfo) {
            this.debugInfo = new DebugInfo();
        } else {
            this.debugInfo = null;
        }
    }

    preload(): void {
        console.log("preload()");

        // 背景画像
        this.load.image("backImg", gameImage["whiteback"]);
        this.load.image("stage", gameImage["Stage"]);
        this.load.image("miscBackground", gameImage["MiscBackground"]);

        // チュートリアル素材
        this.load.image("tutorialDescription", image["TutorialDescription"]);
        this.load.image("frame", image["TutorialSquare"]);
        this.load.image("tapstart", image["Tapstart"]);

        // 操作キャラ
        this.load.image("miku", artistImage["live-artist_miku_sd_01_182p"]);

        // ハート
        this.load.image("heart_red", image["heart_red"]);
        this.load.image("heart_yellow", image["heart_yellow"]);
        this.load.image("heart_green", image["heart_green"]);
        this.load.image("heart_blue", image["heart_blue"]);

        // ライン
        this.load.image("line_red", gameImage["Lane03"]);
        this.load.image("line_yellow", gameImage["Lane02"]);
        this.load.image("line_green", gameImage["Lane01"]);
        this.load.image("line_blue", gameImage["Lane04"]);

        //観客
        this.load.image("audience", image["audience"]);
        this.load.image("bar1", image["bar1"]);

        // タッチエフェクトに利用するアセット
        this.load.image("star", image["star"]);
        this.load.image("circle", image["circle"]);

        this.load.image("effect_heart_hit", gameImage["effect_hit"]);
        this.load.image(
            "effect_heart_hit_circle",
            gameImage["effect_heart_hit_circle"]
        );

        this.load.audio("touch_se", soundSe["decide"]);

        // プログレスバー
        TimeProgressBarObject.preload(this.load);

        // ボタン
        this.load.image("button_play", uiImage["start"]);
        this.load.image("button_pause", uiImage["pause"]);
    }

    create(): void {
        console.log("create()");
        // --------------------------------
        // オブジェクトの生成
        // 背景
        let backImg = this.add
            .image(640, 360, "backImg")
            .setDepth(DepthDefine.BACK_GROUND);
        const lineX = 20;

        // ラインのオブジェクト
        this.firstLaneLine = this.add
            .image(lineX, this.firstLane, "line_red")
            .setOrigin(0, 0.5);
        this.secondLaneLine = this.add
            .image(lineX, this.secondLane, "line_yellow")
            .setOrigin(0, 0.5);
        this.thirdLaneLine = this.add
            .image(lineX, this.thirdLane, "line_green")
            .setOrigin(0, 0.5);
        let stage = this.add.image(lineX, 325, "stage").setOrigin(0, 0.5);

        let miscBackground = this.add
            .image(lineX, stage.height, "miscBackground")
            .setOrigin(0, 0);

        // ミクの設定
        this.lyricY = this.firstLane;
        this.mikuImg = this.add.image(1130, this.lyricY, "miku");

        // スコアの設定
        this.scoreText = this.add.text(30, 650, "Score：0", {
            font: "18px Arial",
        });
        this.scoreText.setStroke("#161616", 4);

        // 観客の設定
        for (let j = 0; j < GameMain.LANE_SIZE; j++) {
            for (let i = 0; i < GameMain.AUDIENCE_SET_SIZE; i++) {
                this.audience[j][i].createAudience(
                    this.add.image(
                        880 - 110 * i,
                        this.lanePosition[j],
                        "audience"
                    )
                );
            }
        }

        // ハートオブジェクト
        const heartDepth = DepthDefine.OBJECT + 1;
        const laneHeartImageParam: [number, number, string][] = [
            [this.heartX, this.firstLane, "heart_red"],
            [this.heartX, this.secondLane, "heart_yellow"],
            [this.heartX, this.thirdLane, "heart_green"],
        ];
        for (let i = 0; i < this.laneHeartObjectArray.length; i++) {
            let image = this.add.image(
                laneHeartImageParam[i][0],
                laneHeartImageParam[i][1],
                laneHeartImageParam[i][2]
            );
            image.setDepth(heartDepth);
            this.laneHeartObjectArray[i].create({
                image: image,
                scale: 0.5,
            });
        }
        for (let i = 0; i < this.heartParticleArray.length; i++) {
            this.heartParticleArray[i].create({
                scene: this,
                particleKey: "effect_heart_hit",
                circleKey: "effect_heart_hit_circle",
                depth: heartDepth - 1,
                posX: laneHeartImageParam[i][0],
                posY: laneHeartImageParam[i][1],
            });
        }

        // パーティクル処理
        this.touchEffect.create({
            scene: this,
            particleKey: "star",
            circleKey: "circle",
        });
        this.touchSe = this.sound.add("touch_se", { volume: 0.5 });

        this.timeProgressBar.create({
            scene: this,
            posX: 570,
            posY: 695,
            textalivePlayer: this.api,
        });
        this.timeProgressBar.setVisible(true);

        this.timeInfo.create({
            scene: this,
            posX: 87,
            posY: 695,
            textalivePlayer: this.api,
        });
        this.timeInfo.setVisible(true);

        this.pauseButton.create({
            scene: this,
            pauseImageKey: "button_pause",
            playImageKey: "button_play",
            posX: 1200,
            posY: 670,
            textaliveManager: this.api,
        });
        this.pauseButton.setVisible(false);

        // チュートリアル
        this.tutorial.createImage(
            this.add
                .image(640, 360, "tutorialDescription")
                .setDepth(DepthDefine.UI_OBJECT),
            this.add.image(160, 225, "frame").setDepth(DepthDefine.UI_OBJECT),
            this.add.image(640, 650, "tapstart").setDepth(DepthDefine.UI_OBJECT)
        );

        // --------------------------------
        // Input処理
        this.input.on("pointerdown", () => {
            this.pointerdown();
        });

        // --------------------------------
        // デバッグ用
        if (this.enableDebugInfo) {
            this.debugInfo.create({
                scene: this,
                textaliveAppApi: this.api,
            });
            this.debugInfo.setVisible(true);
        }
    }

    update() {
        // タッチイベントの取得
        let pointer = this.input.activePointer;

        // チュートリアルの終了判定
        if (pointer.isDown && this.tutorial.tutorialCounter > 50) {
            this.tutorial.end();
            // 一時停止ボタンの表示
            this.pauseButton.setVisible(true);
        }
        // チュートリアルが終わるまでゲームを始めない
        if (!this.tutorial.tutorialFlag) {
            this.tutorial.flashing();
            return;
        }

        if (pointer.isDown) {
            this.gameTouchX = pointer.x;
            this.gameTouchY = pointer.y;

            // パーティクルを発動
            this.touchEffect.explodeStar(8, this.gameTouchX, this.gameTouchY);
        }

        // チュートリアルから一定のインターバル後
        // ロードが終わり次第、楽曲をスタート
        this.tutorial.gameStartCounter++;
        if (
            !this.api.player.isPlaying &&
            !this.api.player.isLoading &&
            !this.musicStart &&
            this.tutorial.gameStartCounter > 100
        ) {
            this.api.player.requestPlay();
            this.musicStart = true;

            // プログレスバーを表示
            this.timeProgressBar.maxValue =
                this.api.player.data.song.length * 1000;

            // 曲の進行時間
            this.timeInfo.songLength = this.api.player.data.song.length * 1000;
            this.timeInfo.dispTime = true;

            // 楽曲情報をコンソール出力
            if (this.enableDebugInfo) {
                this.debugInfo.dispConsoleSongInfo();
            }
        }

        if (typeof this.api.player.data.song != "undefined") {
            if (
                this.api.player.data.song.length - 0.5 <
                this.api.getPositionTime() / 1000
            ) {
                console.log("完了画面へ");
                this.scene.start("GameResult");
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
        const moveLanePos = [this.firstLane, this.secondLane, this.thirdLane];
        for (let i = 0; i < this.lanePosition.length; i++) {
            const laneHeightHalf =
                (this.firstLaneLine.height * this.firstLaneLine.scaleY) / 2;
            const lanePos = this.lanePosition[i];
            if (
                lanePos - laneHeightHalf < this.gameTouchY &&
                this.gameTouchY < lanePos + laneHeightHalf
            ) {
                this.lyricY = moveLanePos[i];
                break;
            }
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
            ease: "Linear",
        });

        // 観客の表示情報を更新
        for (let j = 0; j < GameMain.LANE_SIZE; j++) {
            for (let i = 0; i < GameMain.AUDIENCE_SET_SIZE; i++) {
                if (this.audience[j][i].updateAlpha(this.laneScoreSet[j])) {
                    break;
                }
            }
        }

        // 曲が流れているときだけ動く
        if (
            this.api.getPositionTime() != null &&
            this.api.getPositionTime() != 0
        ) {
            // 初回だけ曲が流れたタイミングで歌詞データを取得する
            // (曲が開始しないと曲データがうまくとってこれないため)
            if (this.initFlag) {
                this.lyrics = this.api.getLyrics();
                console.log(this.lyrics);
                // 最初に表示する分の歌詞だけ表示状態にする
                this.lyricLineObject.initLyricLine(this.lyrics);
                // 初期化処理の終了フラグ
                this.initFlag = false;
            }

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
            if (
                typeof this.textData[lyricIndex] === "undefined" &&
                lyricText != null &&
                lyricText != "" &&
                lyricText != " "
            ) {
                this.textData[lyricIndex] = this.add.text(
                    800,
                    this.lyricY - 20,
                    lyricText,
                    { font: "50px Arial" }
                );
                this.textData[lyricIndex].setStroke(lyric.color, 10);
                // 歌詞表示の更新
                this.lyricLineObject.updateLyricLine(this.lyrics, lyricIndex);
            }
        }

        // テキストの描画更新
        for (var i = this.indexStart; i < this.textData.length; i++) {
            // 文字を移動させる
            if (typeof this.textData[i] !== "undefined") {
                this.textData[i].x -= this.counter;

                // 一定区間移動したら歌詞を非表示する
                if (this.textData[i].x < this.heartX) {
                    this.indexStart++;
                    var wordY = this.textData[i].y;
                    var nowLine = "";
                    if (wordY > 0 && wordY < 720 / 3) {
                        nowLine = "first";
                    } else if (wordY >= 720 / 3 && wordY < (720 / 3) * 2) {
                        nowLine = "second";
                    } else if (wordY >= (720 / 3) * 2 && wordY < 720) {
                        nowLine = "third";
                    }
                    if (
                        !this.laneHeartObjectArray[0].playAnimationFlag &&
                        nowLine == "first"
                    ) {
                        this.laneHeartObjectArray[0].playStretchHeart();
                        this.setHeartTween(this.laneHeartObjectArray[0].image);
                        this.heartParticleArray[0].explode();
                    }
                    if (
                        !this.laneHeartObjectArray[1].playAnimationFlag &&
                        nowLine == "second"
                    ) {
                        this.laneHeartObjectArray[1].playStretchHeart();
                        this.setHeartTween(this.laneHeartObjectArray[1].image);
                        this.heartParticleArray[1].explode();
                    }
                    if (
                        !this.laneHeartObjectArray[2].playAnimationFlag &&
                        nowLine == "third"
                    ) {
                        this.laneHeartObjectArray[2].playStretchHeart();
                        this.setHeartTween(this.laneHeartObjectArray[2].image);
                        this.heartParticleArray[2].explode();
                    }

                    // 歌詞の削除
                    this.textData[i].destroy(this);
                    // score計算を行う
                    this.score = this.calcScore(i, this.score);
                    this.scoreText.setText("Score : " + this.score);
                }
            }
        }

        this.timeProgressBar.update();
        this.timeInfo.update();
        this.visualizer.update(this.api.getPositionTime());

        // --------------------------------
        // デバッグ用
        if (this.enableDebugInfo) {
            this.debugInfo.update();
        }
    }

    /**
     * スコアの計算を行う
     */
    private calcScore(textIndex: number, score: number): number {
        var textColor = this.textData[textIndex].style.stroke;
        if (
            this.textData[textIndex].y > 0 &&
            this.textData[textIndex].y < 200
        ) {
            if (
                this.laneHeartObjectArray[0].image.texture.key.includes(
                    textColor
                )
            ) {
                score = score + 50;
                this.laneScoreSet[0] += 50;
            } else {
                score = score + 10;
                this.laneScoreSet[0] += 10;
            }
        } else if (
            this.textData[textIndex].y >= 250 &&
            this.textData[textIndex].y < 400
        ) {
            if (
                this.laneHeartObjectArray[1].image.texture.key.includes(
                    textColor
                )
            ) {
                score = score + 50;
                this.laneScoreSet[1] += 50;
            } else {
                score = score + 10;
                this.laneScoreSet[1] += 10;
            }
        } else if (
            this.textData[textIndex].y >= 450 &&
            this.textData[textIndex].y < 700
        ) {
            if (
                this.laneHeartObjectArray[2].image.texture.key.includes(
                    textColor
                )
            ) {
                score = score + 50;
                this.laneScoreSet[2] += 50;
            } else {
                score = score + 10;
                this.laneScoreSet[2] += 10;
            }
        }

        return score;
    }

    private setHeartTween(heartObject) {
        this.tweens.add({
            //tweenを適応させる対象
            targets: heartObject,
            //tweenさせる値
            scale: 1.05,
            //tweenにかかる時間
            duration: 100,
            //tween開始までのディレイ
            delay: 0,
            //tweenのリピート回数（-1で無限）
            repeat: 0,
            //easingの指定
            ease: "Linear",
        });
        this.tweens.add({
            //tweenを適応させる対象
            targets: heartObject,
            //tweenさせる値
            scale: (1 * 0.6) / 1.05,
            //tweenにかかる時間
            duration: 100,
            //tween開始までのディレイ
            delay: 100,
            //tweenのリピート回数（-1で無限）
            repeat: 0,
            //easingの指定
            ease: "Linear",
        });
    }

    private pointerdown(): void {
        if (this.touchSe) {
            this.touchSe.play();
        }

        const pointer = this.input.activePointer;
        if (pointer) {
            this.touchEffect.explodeCircle(1, pointer.x, pointer.y);
        }
    }
}
