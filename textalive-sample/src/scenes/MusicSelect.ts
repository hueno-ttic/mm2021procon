import Phaser from "phaser";
import images from "../assets/music_select/*.png";
import no_image from "../assets/thumbnail/no_image_thumbnail.png";
import { buildMusicInfo } from "../factory/MusicFactory";
import GameMain from "./GameMain";
import music from "../assets/sound/music/*.wav";

interface displayPosition {
    displayX: number;
    displayY: number;
}
export default class MusicSelectScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MusicSelect",
        });
    }

    private musicInfoText: Phaser.GameObjects.Text;
    private musics = buildMusicInfo();
    private thumbnail: Phaser.GameObjects.Image;
    private selectedFrame: Phaser.GameObjects.Image;

    // メニューの音楽
    private menuMusic: Phaser.Sound.BaseSound;

    preload(): void {
        this.load.image("music_frame", images["music_frame"]);
        this.load.image("music_select_box", images["music_select_box"]);
        this.load.image("first_note", images["first_note"]);
        this.load.image("usomo", images["usomo"]);
        this.load.image("sonokokoro", images["sonokokoro"]);
        this.load.image("natsu", images["natsu"]);
        this.load.image("hisoka", images["hisoka"]);
        this.load.image("freedom", images["freedom"]);
        this.load.image("back_ground", images["back_ground"]);
        this.load.image("title", images["music_select_title"]);
        this.load.image("decide", images["decide"]);
        this.load.audio("menu_music", music.menu);
        this.load.image("no_image", no_image);
        this.load.image("selected_frame", images["selected_frame"]);
        this.musics.forEach((music) => {
            this.load.image(
                `${music.label}_thumbnail`,
                `http://img.youtube.com/vi/${music.youTubeKey}/maxresdefault.jpg`
            );
        });
    }

    create(): void {
        this.add.image(640, 360, "back_ground").setDisplaySize(1280, 720);
        this.add.image(180, 70, "title");

        // 円を描画する
        const circle = this.add.graphics();
        circle.lineStyle(3, 0x000000, 0.6).strokeCircle(1350, 350, 350);

        const defaultMusic = this.musics
            .filter((music) => music.id === 1)
            .pop();
        this.registry.set("selectedMusic", defaultMusic.id);
        this.musicInfoText = this.add
            .text(45, 620, `${defaultMusic.title}/${defaultMusic.author}`, {
                fontFamily: "Makinas-4-Square",
            })
            .setStroke("#000000", 2)
            .setFontSize(40);

        this.thumbnail = this.add
            .image(
                420,
                350,
                this.textures.get(`${defaultMusic.label}_thumbnail`) ===
                    this.textures.get("__MISSING")
                    ? "no_image"
                    : `${defaultMusic.label}_thumbnail`
            )
            .setDisplaySize(790, 440);

        this.menuMusic = this.sound.add("menu_music", {
            loop: true,
            volume: 0.5,
        });
        if (this.menuMusic) {
            this.menuMusic.play();
        }

        this.selectedFrame = this.add
            .image(1075, 125, "selected_frame")
            .setScale(1.05);
        this.tweens.add({
            targets: this.selectedFrame,
            alpha: 0,
            duration: 1000,
            ease: "Power0",
            repeat: -1,
        });

        // 楽曲選択用のボックスを配置する
        this.musics.forEach((music, index) => {
            const musicPosition = this.calcMusicPosition(index);
            const image = this.add.image(
                musicPosition.displayX,
                musicPosition.displayY,
                music.label
            );
            image.setScale(0.6);
            image.setInteractive();

            image.on("pointerdown", () => {
                this.registry.set("selectedMusic", music.id);
                this.musicInfoText.setText(`${music.title}/${music.author}`);
                this.thumbnail.setTexture(
                    this.textures.get(`${music.label}_thumbnail`) ===
                        this.textures.get("__MISSING")
                        ? "no_image"
                        : `${music.label}_thumbnail`
                );
                this.thumbnail.setDisplaySize(790, 440);
                this.selectedFrame.setPosition(
                    musicPosition.displayX,
                    musicPosition.displayY
                );
            });
        });

        const decideButton = this.add
            .image(1140, 640, "decide")
            .setInteractive();
        decideButton.on("pointerdown", () => {
            this.moveGameMain();
        });
    }

    private moveGameMain() {
        if (this.game.scene.getScene("GameMain")) {
            this.scene.remove("GameMain");
        }
        this.menuMusic.stop();
        this.scene.add("GameMain", GameMain);
        this.scene.start("GameMain");
    }

    private calcMusicPosition(index: number): displayPosition {
        var dispBoxX = 1000;
        var additionalBoxX = 0;
        var dispBoxY = 40;
        var additionalBoxY = 85;
        switch (index) {
            case 0:
            case 5:
                additionalBoxX = 75;
                break;
            case 1:
            case 4:
                additionalBoxX = 25;
                break;
            default:
                additionalBoxX = 0;
                break;
        }
        return {
            displayX: dispBoxX + additionalBoxX,
            displayY: dispBoxY + additionalBoxY * (index + 1),
        };
    }
}
