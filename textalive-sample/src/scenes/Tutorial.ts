import Phaser from "phaser";
import image from "../assets/*.png";

export default class TutorialScene extends Phaser.Scene {
    constructor() {
      super({
        key: 'Tutorial',
      })
    }
    public tutorialDescription;
    public frame;
    public r;
    public timer;

    init() {
        this.r = 0;
        this.timer = 0;
    }
    preload(): void {
        // 背景画像
        this.load.image('tutorialDescription', image['TutorialDescription']);
        this.load.image('frame', image['TutorialSquare']);
        this.load.image('tapstart', image['Tapstart']);
    }

    create(): void {
        this.tutorialDescription = this.add.image(640, 360, 'tutorialDescription');
        this.frame = this.add.image(640, 360, 'frame');
        this.frame.scaleX *= 9;
        this.frame.scaleY *= 5.8;
        this.add.image(1000, 650, 'tapstart');
    }

    update() {
        this.frame.alpha = Math.abs(Math.sin(this.r));
        if (this.r >= 360 ) {
          this.r = 0;
        } else {
          this.r += 0.05;
        }
        // タッチイベントの取得
        let pointer = this.input.activePointer;
        if (pointer.isDown && this.timer > 50) {
            this.scene.start('GameMain');
        }
        this.timer++;
        console.log(this.timer);
    }
  }