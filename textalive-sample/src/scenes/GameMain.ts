import Phaser from "phaser";
import LaneHeartObject from "../object/LaneHeartObject";
import AudienceObject from "../object/AudienceObject";
import GameResultScene from "./GameResult";
import TimeProgressBarObject from "../object/TimeProgressBarObject";
import TextaliveApiManager from "../TextaliveApiManager";
import TimeInfoObject from "../object/TimeInfoObject";
import UIPauseButtonObject from "../object/UIPauseButtonObject";
import TutorialObject from "../object/TutorialObject";
import LyricLineObject from "../object/LyricLineObject";
import ScoreCounter from "../object/ScoreCounter";
import HeartEffect from "../object/HeartEffect";
import TouchEffect from "../object/TouchEffect";
import DepthDefine from "../object/DepthDefine";
import LyricLogicObject from "../object/LyricLogicObject";
import LiveArtistObject from "../object/LiveArtistObject";
import { buildMusicInfo } from "../factory/MusicFactory";
import DebugInfo from "../object/DebugInfo";

import image from "../assets/*.png";
import gameImage from "../assets/game_main/*.png";
import uiImage from "../assets/ui/*.png";
import soundSe from "../assets/sound/se/*.wav";
import Visualizer from "./audioVisualizer/app/presenter/visualizer";

export default class GameMain extends Phaser.Scene {
    private musics = buildMusicInfo();
    public frameCount = 0;

    public api: TextaliveApiManager;

    public musicStart = false;
    public sceneChangeStatus = "";

    public firstLane: number = 120;
    public secondLane: number = 320;
    public thirdLane: number = 520;

    public lanePosition = [];

    // レーンごとのスコア
    public laneScoreArray: Array<ScoreCounter>;
    static readonly LANE_SIZE: number = 3;

    // 観客
    private audienceObject: AudienceObject;
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

    // ハートのX座標
    public heartX = 120;

    // ゲームのスコア
    public score: number = 0;
    public scoreText;

    // ラインオブジェクト
    public r: number = 0;
    public firstLaneLine;
    public secondLaneLine;
    public thirdLaneLine;

    // 曲情報
    private selectedMusic;

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

    private lyricLogicObject: LyricLogicObject;
    // ライブアーティスト
    private liveArtist: LiveArtistObject;

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

        this.selectedMusic = this.musics
            .filter((music) => music.id === this.selectedMusicId)
            .pop();

        this.api = new TextaliveApiManager(
            this.selectedMusic.url,
            this.selectedMusic.playerVideoOptions
        );
        this.api.init();

        this.touchEffect = new TouchEffect();

        this.lyricY = this.firstLane;

        this.laneHeartObjectArray = new Array(GameMain.LANE_SIZE);
        this.heartParticleArray = new Array(GameMain.LANE_SIZE);
        for (let i = 0; i < GameMain.LANE_SIZE; i++) {
            this.laneHeartObjectArray[i] = new LaneHeartObject();
            this.heartParticleArray[i] = new HeartEffect();
        }

        // 観客
        this.audienceObject = new AudienceObject(this);

        // レーンのy座標
        this.lanePosition[0] = 120;
        this.lanePosition[1] = 320;
        this.lanePosition[2] = 520;

        // スコアの初期化
        this.laneScoreArray = new Array(GameMain.LANE_SIZE);
        for (let i = 0; i < GameMain.LANE_SIZE; i++) {
            this.laneScoreArray[i] = new ScoreCounter();
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

        // 歌詞の色付けロジック
        this.lyricLogicObject = new LyricLogicObject(this.api);
        // ライブアーティスト
        this.liveArtist = new LiveArtistObject(this);

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
        this.liveArtist.preload();

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
        this.audienceObject.preload();

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

        // ライブアーティストの設定
        this.liveArtist.create(this.selectedMusic);

        // スコアの設定
        this.scoreText = this.add.text(30, 650, "Score：0", {
            font: "18px Arial",
        });
        this.scoreText.setStroke("#161616", 4);

        // 観客の設定
        this.audienceObject.create();

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

        // visualizer
        this.visualizer.create();

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

            // 歌詞の色付け
            this.lyricLogicObject.setLyricColor();

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
                this.changeNextScene();
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

        // クリックした際に3レーンのいずれかに移動する
        const touchLaneIndex = this.getLaneIndex(this.gameTouchY);
        if (-1 < touchLaneIndex) {
            const moveLanePos = [
                this.firstLane,
                this.secondLane,
                this.thirdLane,
            ];
            this.lyricY = moveLanePos[touchLaneIndex];
        }

        // 操作しているアーティストの位置更新
        if (this.api.player.isPlaying) {
            this.liveArtist.update(this.lyricY);
        }

        // 曲がスタートしてから動く
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
                this.textData[lyricIndex].setDepth(DepthDefine.OBJECT + 10);
                // 歌詞表示の更新
                this.lyricLineObject.updateLyricLine(this.lyrics, lyricIndex);
                // 観客の表示情報を更新
                // todo スコアによって出し方を変えるかもしれない
                if (this.lyricY === this.firstLane) {
                    this.audienceObject.update("first");
                } else if (this.lyricY === this.secondLane) {
                    this.audienceObject.update("second");
                } else if (this.lyricY === this.thirdLane) {
                    this.audienceObject.update("third");
                }
            }
        }

        // テキストの描画更新
        for (let i = this.indexStart; i < this.textData.length; i++) {
            // 文字を移動させる
            if (typeof this.textData[i] !== "undefined") {
                this.textData[i].x -= this.counter;

                // 一定区間移動したら歌詞を非表示する
                if (this.textData[i].x < this.heartX) {
                    this.indexStart++;
                    const laneIndex = this.getLaneIndex(this.textData[i].y);
                    if (
                        -1 < laneIndex &&
                        !this.laneHeartObjectArray[laneIndex].playAnimationFlag
                    ) {
                        this.laneHeartObjectArray[laneIndex].playStretchHeart();
                        this.setHeartTween(
                            this.laneHeartObjectArray[laneIndex].image
                        );
                        this.heartParticleArray[laneIndex].explode();
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
        const laneIndex = this.getLaneIndex(this.textData[textIndex].y);
        if (-1 < laneIndex) {
            const laneColor = ["#ff8e1e", "#ffdc00", "#47ff47"]; // todo: 歌詞の色付け処理との紐づけ
            const isSuccess = laneColor[laneIndex].includes(
                this.textData[textIndex].style.stroke
            );
            score += isSuccess ? 50 : 10;

            if (isSuccess) {
                this.laneScoreArray[laneIndex].addSuccess();
            } else {
                this.laneScoreArray[laneIndex].addFailed();
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

    // y座標からレーンのインデックス取得
    private getLaneIndex(posY: number): number {
        for (let i = 0; i < this.lanePosition.length; i++) {
            const laneHeightHalf =
                (this.firstLaneLine.height * this.firstLaneLine.scaleY) / 2;
            const lanePos = this.lanePosition[i];
            if (
                lanePos - laneHeightHalf < posY &&
                posY < lanePos + laneHeightHalf
            ) {
                return i;
            }
        }
        return -1;
    }

    private changeNextScene(): void {
        switch (this.sceneChangeStatus) {
            case "":
                console.log("完了画面へ");
                if (this.game.scene.getScene("GameResult")) {
                    console.log("GameResult remove");
                    this.scene.remove("GameResult");
                    this.sceneChangeStatus = "Request_Remove";
                } else {
                    console.log("既に removed");
                    this.sceneChangeStatus = "Removed";
                }
                break;
            case "Request_Remove":
                if (!this.game.scene.getScene("GameResult")) {
                    this.sceneChangeStatus = "Removed";
                }
                break;
            case "Removed":
                this.scene.add("GameResult", GameResultScene);
                this.sceneChangeStatus = "Request_Add";
                break;
            case "Request_Add":
                if (this.game.scene.getScene("GameResult")) {
                    this.sceneChangeStatus = "Added";
                }
                break;
            case "Added":
                this.scene.start("GameResult");
                this.sceneChangeStatus = "Request_Start";
                break;
        }
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
