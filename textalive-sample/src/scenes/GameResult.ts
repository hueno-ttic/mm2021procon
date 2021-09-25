import Phaser from "phaser";
import DepthDefine from "../object/DepthDefine";
import { MusicInfo } from "../interface/MusicInfo";
import { buildMusicInfo } from "../factory/MusicFactory";
import ResultScoreObject from "../object/ResultScoreObject";
import TotalResultObject from "../object/TotalResultObject";
import ScoreCounter from "../object/ScoreCounter";

import imageResult from "../assets/result/*.png";
import music from "../assets/sound/music/*.wav";

export default class GameResultScene extends Phaser.Scene {
    // 選曲情報
    private _musicInfo: MusicInfo;

    // 背景
    private _backgroundImage: Phaser.GameObjects.Image;

    // キャプチャ
    private _resultImage: Phaser.GameObjects.Image;

    // サムネイル
    private _thumbnailImage: Phaser.GameObjects.Image;

    // スコア
    private _scoreBackgroundImage: Phaser.GameObjects.Image;
    private _scoreImage: Phaser.GameObjects.Image;
    private _resultScores: ResultScoreObject[];
    private _total: TotalResultObject;

    // 楽曲情報テキスト
    private _selectSongText: Phaser.GameObjects.Text;

    // リザルト
    private _playResultImage: Phaser.GameObjects.Image;

    // ボタン
    private _moveSelectMusicButtonBgImage: Phaser.GameObjects.Image;
    private _moveSelectMusicButtonImage: Phaser.GameObjects.Image;

    // サウンド
    private _bgm: Phaser.Sound.BaseSound;

    static readonly SCORE_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle =
        {
            font: "18px Arial",
        };

    constructor() {
        super({
            key: "GameResult",
        });
    }

    init() {
        // 選曲情報
        this._musicInfo = buildMusicInfo()
            .filter((music) => music.id === this.registry.get("selectedMusic"))
            .pop();

        // 背景
        this._backgroundImage = null;

        // キャプチャ
        this._resultImage = null;

        // サムネイル
        this._thumbnailImage = null;

        // スコア
        this._scoreBackgroundImage = null;
        this._scoreImage = null;
        this._resultScores = new Array<ResultScoreObject>(2);
        for (let i = 0; i < this._resultScores.length; i++) {
            this._resultScores[i] = new ResultScoreObject();
        }
        this._total = new TotalResultObject();

        // 楽曲情報テキスト
        this._selectSongText = null;

        // リザルト
        this._playResultImage = null;

        // ボタン
        this._moveSelectMusicButtonBgImage = null;
        this._moveSelectMusicButtonImage = null;

        // サウンド
        this._bgm = null;
    }

    preload(): void {
        // 背景
        this.load.image("bg_image", imageResult.result_background);

        // キャプチャ
        this.load.image("result_image", imageResult.result_result);

        // サムネイル
        //this.load.image(`${this._musicInfo.label}_thumbnail`, `http://img.youtube.com/vi/${this._musicInfo.youTubeKey}/maxresdefault.jpg`);

        // スコア
        this.load.image("score_bg", imageResult.result_score_background);
        this.load.image("score_image", imageResult.result_score);
        this.load.image("score_excellent", imageResult.result_score_excellent);
        this.load.image("score_bad", imageResult.result_score_bad);
        this.load.image("score_total", imageResult.result_score_total);
        this.load.image("line", imageResult.result_line);
        this.load.image("lane_1", imageResult.result_lane_1);
        this.load.image("lane_2", imageResult.result_lane_2);
        this.load.image("lane_3", imageResult.result_lane_3);
        this.load.image("count", imageResult.result_count);

        // リザルト
        this.load.image("result_cleared", imageResult.result_cleared);
        this.load.image("result_failed", imageResult.result_failed);

        // ボタン
        this.load.image(
            "button_select_music_bg",
            imageResult.result_button_background
        );
        this.load.image(
            "button_select_music_image",
            imageResult.result_move_musicselect
        );

        // サウンド
        this.load.audio("result_music", music.result);
    }

    create(): void {
        // 背景
        this._backgroundImage = this.add.image(
            this.game.scale.gameSize.width / 2,
            this.game.scale.gameSize.height / 2,
            "bg_image"
        );
        this._backgroundImage.setDepth(DepthDefine.BACK_GROUND);

        // キャプチャ
        this._resultImage = this.add.image(100, 50, "result_image");
        this._resultImage.setDepth(DepthDefine.OBJECT);

        // サムネイル
        this._thumbnailImage = this.add
            .image(420, 350, `${this._musicInfo.label}_thumbnail`)
            .setDepth(DepthDefine.OBJECT)
            .setScale(0.6, 0.6);

        // スコア画像と背景
        const scoreDepth = DepthDefine.OBJECT;
        this._scoreBackgroundImage = this.add.image(
            1040,
            this._thumbnailImage.y -
                (this._thumbnailImage.height * this._thumbnailImage.scaleY) /
                    2 -
                10,
            "score_bg"
        );
        this._scoreBackgroundImage
            .setDepth(scoreDepth - 1)
            .setOrigin(0.5, 0)
            .setDisplaySize(394, 460);

        this._scoreImage = this.add.image(
            this._scoreBackgroundImage.x,
            this._scoreBackgroundImage.y + 25,
            "score_image"
        );

        // レーンごとのリザルト
        const result = this.registry.get("gameResult") as GameScore;
        const laneScores = [
            result.laneScore.map((score) => score.success),
            [
                result.laneScore.reduce((sum, value) => {
                    return sum + value.failed;
                }, 0),
            ],
        ];
        const resultNameKeys = ["score_excellent", "score_bad"];
        const laneKeys = [["lane_1", "lane_2", "lane_3"], ["count"]];
        for (let i = 0; i < this._resultScores.length; i++) {
            this._resultScores[i].create({
                scene: this,
                resultNameKey: resultNameKeys[i],
                underlineKey: "line",
                laneKeys: laneKeys[i],
                laneScores: laneScores[i],
                depth: scoreDepth,
                posX: this._scoreBackgroundImage.x - 180,
                posY:
                    this._scoreBackgroundImage.y +
                    this._scoreImage.height +
                    30 +
                    200 * i,
            });
        }

        // スコア
        this._total.create({
            scene: this,
            totalImageKey: "score_total",
            underLineKey: "line",
            totalResult: result.totalScore,
            depth: scoreDepth,
            posX: this._scoreBackgroundImage.x - 180,
            posY:
                this._scoreBackgroundImage.y +
                this._scoreImage.height +
                30 +
                200 * this._resultScores.length +
                -60,
        });

        // 楽曲情報
        this._selectSongText = this.add.text(
            45,
            this.game.scale.gameSize.height - 100,
            `${this._musicInfo.title}/${this._musicInfo.author}`,
            { fontFamily: "Makinas-4-Square" }
        );
        this._selectSongText
            .setDepth(DepthDefine.OBJECT)
            .setStroke("#000000", 2)
            .setFontSize(40);

        // リザルト
        this._playResultImage = this.add.image(
            this._scoreBackgroundImage.x,
            this._scoreBackgroundImage.y - 40,
            "result_cleared"
        );
        this._playResultImage.setDepth(DepthDefine.OBJECT + 1);

        // ボタン
        const buttonDepth = DepthDefine.UI_OBJECT;
        this._moveSelectMusicButtonBgImage = this.add.image(
            this._scoreBackgroundImage.x,
            this._selectSongText.y + this._selectSongText.height / 2,
            "button_select_music_bg"
        );
        this._moveSelectMusicButtonBgImage.setDepth(buttonDepth - 1);
        this._moveSelectMusicButtonBgImage.setInteractive();
        this._moveSelectMusicButtonBgImage.on("pointerdown", () => {
            this._bgm.stop();
            this.scene.start("MusicSelect");
        });

        this._moveSelectMusicButtonImage = this.add.image(
            this._scoreBackgroundImage.x,
            this._selectSongText.y + this._selectSongText.height / 2,
            "button_select_music_image"
        );
        this._moveSelectMusicButtonImage.setDepth(buttonDepth);

        // サウンド
        this._bgm = this.sound.add("result_music", {
            loop: true,
        });
        this._bgm.play();
    }

    update(): void {
        for (let i = 0; i < this._resultScores.length; i++) {
            this._resultScores[i].update();
        }

        this._total.update();
    }
}

interface GameScore {
    laneScore: ScoreCounter[];
    totalScore: number;
}
