import Phaser from "phaser";
import GameMain from "../scenes/GameMain";
import artistImage from "../assets/live_artist/*.png";

export default class AudienceObject {
    public gameMain: GameMain;
    public artist: Phaser.GameObjects.Image;
    public artistY = 0;

    constructor(gameMain: GameMain) {
        this.init(gameMain);
    }

    init(gameMain: GameMain) {
        this.gameMain = gameMain;
    }

    preload() {
        this.gameMain.load.image(
            "miku",
            artistImage["live-artist_miku_sd_01_182p"]
        );
        this.gameMain.load.image(
            "luka",
            artistImage["live-artist_ruka_sd_01_182p"]
        );
    }

    create(selectedMusic) {
        this.artistY = this.gameMain.firstLane;
        // 曲の種類によって出し分ける
        if (selectedMusic.id === 5) {
            this.artist = this.gameMain.add.image(1130, this.artistY, "luka");
        } else {
            this.artist = this.gameMain.add.image(1130, this.artistY, "miku");
        }
    }

    update(artistY: number) {
        // ライブアーティストの場所の更新
        this.gameMain.tweens.add({
            //tweenを適応させる対象
            targets: this.artist,
            //tweenさせる値
            y: artistY,
            //tweenにかかる時間
            duration: 100,
            //tween開始までのディレイ
            delay: 0,
            //tweenのリピート回数（-1で無限）
            repeat: 0,
            //easingの指定
            ease: "Linear",
        });
    }
}
