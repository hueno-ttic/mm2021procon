import Phaser from "phaser";
import image from "../assets/*.png";
export default class SplashScene extends Phaser.Scene {
  constructor() {
    super({
      key: "SplashScene",
    });
  }

  preload(): void {
    this.load.image("splash", image.splash);
  }

  create(): void {
    const splash = this.add.image(640, 360, "splash");
    this.input.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });
  }
}
