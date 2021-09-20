import Phaser from "phaser";
import image from "../assets/*.png";
export default class SplashScene extends Phaser.Scene {
    constructor() {
        super({
            key: "SplashScene",
        });
    }

    preload(): void {
        this.load.image("splash01", image["splash01"]);
        this.load.image("splash02", image["splash02"]);
    }

    create(): void {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.add.image(640, 360, "splash01");
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.cameras.main.fadeIn(1000, 0, 0, 0);
                this.add.image(640, 360, "splash02");
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
                    this.input.on("pointerdown", () => {
                    this.cameras.main.fadeOut(1000, 0, 0, 0);
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                            this.scene.start("TitleScene");
                        });
                    });
                });
            });
        });
    }
}