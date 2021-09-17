import Phaser from "phaser";
import images from "../assets/title/*.png";
import music from "../assets/sound/music/*.ogg";
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'TitleScene',
    })
  }


  // タイトルの音楽
  private titleMusic: Phaser.Sound.BaseSound;

  private back_title;
  private click_start;
  private r = 0;

  preload(): void {
    // imageの読み込み
    this.load.image('back_ground', images['back_ground']);
    this.load.image('project_mirai', images['project_mirai']);
    this.load.image('sub_title', images['sub_title']);
    this.load.image('back_title', images['back_title']);
    this.load.image('click_start', images['click_start']);
    this.load.audio('title_music', music['title']);
  }

  create(): void {
    this.add.image(500, 350, 'back_ground');

    var gameTitle = this.add.image(640, 230, 'project_mirai');
    gameTitle.setDisplaySize(950, 90);
    this.add.image(640, 315, 'sub_title');

    this.back_title = this.add.image(640, 570, 'back_title');
    this.back_title.setInteractive();
    this.back_title.on('pointerdown', () => {
      this.titleMusic.stop();
      this.scene.start('MusicSelect');
    });
    this.back_title.scaleY = this.back_title.scaleY * 0.7;
    
    this.click_start = this.add.image(640, 570, 'click_start');
    this.click_start.scale = this.click_start.scale * 0.7;

    this.click_start.on('pointerdown', () => {
      this.titleMusic.stop();
      this.scene.start('MusicSelect');
      
    });

    this.titleMusic = this.sound.add('title_music', { loop: true ,volume: 0.5 });
    if (this.titleMusic) {
      this.titleMusic.play();
    }
    // TODO 最上面に透明な画像を被せて、キャラクターセレクト画面への遷移処理の実装を1回だけにする
  }
  
  update() {

    this.back_title.alpha = Math.abs(Math.sin(this.r));
    this.click_start.alpha = Math.abs(Math.sin(this.r));
    if (this.r >= 360) {
      this.r = 0;
    } else {
      this.r += 0.05;
    }
  }
}