import Phaser from "phaser";
import images from "../assets/music_select/*.png";
import MusicList from "./MusicList";

export default class MusicSelectScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MusicSelect',
    })
  }

  private musicInfoText;
  public selectMusic;

  preload(): void {
    this.load.image('music_frame', images['music_frame']);
    this.load.image('music_select_box', images['music_select_box']);
  }

  create(): void {
    this.add.text(50, 70, 'Music Select', {font: "32px"}).setColor('white').setStroke("#00bfff", 2);

    // 画面全体スケールに対して0.625
    // xは画面サイズから0.33倍した位置
    // yは画面サイズから0.486倍した位置
    this.add.image(420, 350, 'music_frame').setDisplaySize(800, 450);

    // 円を描画する
    var circle = this.add.graphics();
    circle.lineStyle(3, 0xffffff, 0.6).strokeCircle(1350, 350, 350);

    
    // 楽曲選択用のボックスを配置する
    var dispBoxX = 950;
    var additionalBoxX = 0;
    var dispBoxY = 50;
    for (let index = 0; index < 6; index++) {
      if (index == 0 || index == 5) {
        additionalBoxX = 75;
      } else if (index == 1 || index == 4) {
        additionalBoxX = 25;
      } else {
        additionalBoxX = 0;
      }
      dispBoxY+= 80;
      this.add.image(dispBoxX + additionalBoxX, dispBoxY, 'music_select_box')
        .setDisplaySize(240, 75);
    }

    var musicList = new MusicList();
    var musicInfoList = musicList.getMusicInfoList();

    this.selectMusic = musicInfoList[1];

    this.musicInfoText = this.add.text(45, 600, this.selectMusic[0]+"/"+this.selectMusic[1],{ fontFamily: 'Makinas-4-Square' });
    
    this.musicInfoText.scale *= 2;

    const text = this.add.text(700, 650, 'クリックしてゲーム画面へ遷移する');
    text.setInteractive();
    text.on('pointerdown', () => {

      console.log("this.scene.isActive('GameMain') : " + this.scene.isActive('GameMain'));
      if(this.scene.isActive('GameMain')) {
         this.scene.remove('GameMain');
      }
      this.scene.start('GameMain');
    });
  }
}
