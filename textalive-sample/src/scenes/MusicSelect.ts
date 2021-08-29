import images from "../assets/music_select/*.png";

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MusicSelect',
    })
  }

  preload(): void {
    this.load.image('music_frame', images['music_frame']);
    this.load.image('music_select_box', images['music_select_box']);
  }

  create(): void {
    this.add.text(10, 10, 'Music Select').setColor('white').setStroke('blue', 2);

    this.add.image(300, 350, 'music_frame').setDisplaySize(500, 270);

    // 円を描画する
    var circle = this.add.graphics();
    circle.lineStyle(5, 0xffffff, 1.0).strokeCircle(1100, 350, 350);

    // 楽曲選択用のボックスを配置する
    var dispBoxX = 650;
    var additionalBoxX = 0;
    var dispBoxY = 0;
    for (let index = 0; index < 6; index++) {
      if (index == 0 || index == 5) {
        additionalBoxX = 75;
      } else if (index == 1 || index == 4) {
        additionalBoxX = 25;
      } else {
        additionalBoxX = 0;
      }
      dispBoxY+= 100;
      this.add.image(dispBoxX + additionalBoxX, dispBoxY, 'music_select_box')
        .setDisplaySize(200, 75);
    }

    const text = this.add.text(700, 650, 'クリックしてゲーム画面へ遷移する');
    text.setInteractive();
    text.on('pointerdown', () => {
      this.scene.start('GameMain');
    });
  }
}
