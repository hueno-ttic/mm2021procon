import Phaser from "phaser";
import images from "../assets/music_select/*.png";
import jpeg_images from "../assets/thumbnail/*.jpeg";
import no_image from "../assets/thumbnail/no_image_thumbnail.png";
import { buildMusicInfo } from "../factory/MusicFactory";
import GameMain from "./GameMain";
import music from "../assets/sound/music/*.wav";

export default class MusicSelectScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MusicSelect",
        });
    }

    private musicInfoText: Phaser.GameObjects.Text;
    private selectedMusicId: number;
    private musics = buildMusicInfo();
    private thumbnail: Phaser.GameObjects.Image;

    // メニューの音楽
    private menuMusic: Phaser.Sound.BaseSound;

    preload(): void {
        this.load.image("music_frame", images["music_frame"]);
        this.load.image("music_select_box", images["music_select_box"]);
        this.load.image("first_note", images["first_note"]);
        this.load.image("first_note_thumbnail", no_image);
        this.load.image("usomo", images["usomo"]);
        this.load.image("usomo_thumbnail", jpeg_images["usomo_thumbnail"]);
        this.load.image("sonokokoro", images["sonokokoro"]);
        this.load.image(
            "sonokokoro_thumbnail",
            jpeg_images["sonokokoro_thumbnail"]
        );
        this.load.image("natsu", images["natsu"]);
        this.load.image("natsu_thumbnail", jpeg_images["natsu_thumbnail"]);
        this.load.image("hisoka", images["hisoka"]);
        this.load.image("hisoka_thumbnail", jpeg_images["hisoka_thumbnail"]);
        this.load.image("freedom", images["freedom"]);
        this.load.image("freedom_thumbnail", jpeg_images["freedom_thumbnail"]);
        this.load.image("back_ground", images["back_ground"]);
        this.load.image("title", images["music_select_title"]);
        this.load.image("decide", images["decide"]);
        this.load.audio("menu_music", music.menu);
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
        this.selectedMusicId = defaultMusic.id;
        this.registry.set("selectedMusic", defaultMusic.id);
        this.musicInfoText = this.add
            .text(45, 620, `${defaultMusic.title}/${defaultMusic.author}`, {
                fontFamily: "Makinas-4-Square",
            })
            .setStroke("#ffffff", 2)
            .setFontSize(40);

        this.thumbnail = this.add
            .image(420, 350, `${defaultMusic.label}_thumbnail`)
            .setDisplaySize(790, 440);

        // 楽曲選択用のボックスを配置する
        var dispBoxX = 1000;
        var additionalBoxX = 0;
        var dispBoxY = 40;

        this.menuMusic = this.sound.add("menu_music", {
            loop: true,
            volume: 0.5,
        });
        if (this.menuMusic) {
            this.menuMusic.play();
        }

        this.musics.forEach((music, index) => {
            if (index == 0 || index == 5) {
                additionalBoxX = 75;
            } else if (index == 1 || index == 4) {
                additionalBoxX = 25;
            } else {
                additionalBoxX = 0;
            }
            dispBoxY += 85;
            const image = this.add.image(
                dispBoxX + additionalBoxX,
                dispBoxY,
                music.label
            );
            image.setScale(0.6);
            image.setInteractive();

            image.on("pointerdown", () => {
                this.registry.set("selectedMusic", music.id);
                this.selectedMusicId = music.id;
                this.musicInfoText.setText(`${music.title}/${music.author}`);
                this.thumbnail.setTexture(`${music.label}_thumbnail`);
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
}
