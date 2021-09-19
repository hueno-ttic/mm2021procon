import Phaser from "phaser";
import FlowingStarsManager from '../object/FlowingStarsObject';

import image from "../assets/*.png"
import titleImage from "../assets/title/*.png";
import music from "../assets/sound/music/*.wav";

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

  private flowingStars: FlowingStarsManager;

  init(): void {
    this.flowingStars = new FlowingStarsManager();
  }

  preload(): void {
    // imageの読み込み
    this.load.image('back_ground', titleImage['back_ground']);
    this.load.image('project_mirai', titleImage['project_mirai']);
    this.load.image('sub_title', titleImage['sub_title']);
    this.load.image('back_title', titleImage['back_title']);
    this.load.image('click_start', titleImage['click_start']);
    this.load.image('bg_star', titleImage['star']);
    this.load.audio('title_music', music['title']);
  }

  create(): void {
    let bg = this.add.image(500, 350, 'back_ground');
    bg.setDepth(-10);

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

    this.flowingStars.create({
      scene: this,
      starImageKey: 'bg_star',
      imageDepth: -1
    });
    this.flowingStars.setVisible(true);
  }
  
  update() {
    this.back_title.alpha = Math.abs(Math.sin(this.r));
    this.click_start.alpha = Math.abs(Math.sin(this.r));
    if (this.r >= 360) {
      this.r = 0;
    } else {
      this.r += 0.05;
    }

    this.flowingStars.update();
  }
}