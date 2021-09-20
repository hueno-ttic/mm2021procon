import Phaser from "phaser";
import images from "../assets/music_select/*.png";
import { buildMusicInfo } from "../factory/MusicFactory";

export default class MusicSelectScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MusicSelect",
        });
    }

    private musicInfoText;
    private selectedMusicId: number;
    private musics = buildMusicInfo();

    preload(): void {
        this.load.image("music_frame", images["music_frame"]);
        this.load.image("music_select_box", images["music_select_box"]);
        this.load.image("first_note", images["01_first_note"]);
        this.load.image("usomo", images["02_usomo"]);
        this.load.image("sonokokoro", images["03_sonokokoro"]);
        this.load.image("natsu", images["04_natsu"]);
        this.load.image("hisoka", images["05_hisoka"]);
        this.load.image("freedom", images["06_freedom"]);
    }

    create(): void {
        this.add
            .text(50, 70, "Music Select", { font: "32px" })
            .setColor("white")
            .setStroke("#00bfff", 2);

        // 画面全体スケールに対して0.625
        // xは画面サイズから0.33倍した位置
        // yは画面サイズから0.486倍した位置
        this.add.image(420, 350, "music_frame").setDisplaySize(800, 450);

        // 円を描画する
        const circle = this.add.graphics();
        circle.lineStyle(3, 0xffffff, 0.6).strokeCircle(1350, 350, 350);

        // 楽曲選択用のボックスを配置する
        var dispBoxX = 950;
        var additionalBoxX = 0;
        var dispBoxY = 50;

        this.musicInfoText = this.add.text(45, 600, "楽曲を選択してください", {
            fontFamily: "Makinas-4-Square",
        });

        this.musicInfoText.scale *= 2;

        this.musics.forEach((music, index) => {
            if (index == 0 || index == 5) {
                additionalBoxX = 75;
            } else if (index == 1 || index == 4) {
                additionalBoxX = 25;
            } else {
                additionalBoxX = 0;
            }
            dispBoxY += 80;
            const image = this.add.image(
                dispBoxX + additionalBoxX,
                dispBoxY,
                music.label
            );
            image.setDisplaySize(300, 80);
            image.setInteractive();

            image.on("pointerdown", () => {
                if (music.id === this.selectedMusicId) {
                    this.moveGameMain();
                    return;
                }

                this.registry.set("selectedMusic", music.id);
                this.selectedMusicId = music.id;
                this.musicInfoText.setText(`${music.title}/${music.author}`);
            });
        });

        this.musicInfoText.scale *= 2;
        const text = this.add.text(
            700,
            650,
            "クリックしてゲーム画面へ遷移する"
        );
        text.setInteractive();
        text.on("pointerdown", () => {
            console.log(
                "this.scene.isActive('GameMain') : " +
                    this.scene.isActive("GameMain")
            );
            this.moveGameMain();
        });
    }

    private moveGameMain() {
        if (this.scene.isActive("GameMain")) {
            this.scene.remove("GameMain");
        }
        this.scene.start("GameMain");
    }
}
