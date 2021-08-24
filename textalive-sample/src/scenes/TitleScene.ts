import images from "../assets/title/*.png";
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Title',
    })
  }

  preload(): void {
    // imageの読み込み
    this.load.image('back_ground', images['back_ground']);
    this.load.image('project_mirai', images['project_mirai']);
    this.load.image('sub_title', images['sub_title']);
    this.load.image('back_tile', images['back_tile']);
    this.load.image('click_start', images['click_start']);
  }

  create(): void {
    this.add.image(500, 350, 'back_ground');

    var gameTitle = this.add.image(500, 250, 'project_mirai');
    gameTitle.setDisplaySize(950, 90);
    this.add.image(500, 350, 'sub_title');

    var back_tile = this.add.image(500, 450, 'back_tile');
    back_tile.setInteractive();
    back_tile.on('pointerdown', () => {
      this.scene.start('CharacterSelect');
    });

    var click_start = this.add.image(500, 450, 'click_start');

    click_start.on('pointerdown', () => {
      this.scene.start('CharacterSelect');
    });

    // TODO 最上面に透明な画像を被せて、キャラクターセレクト画面への遷移処理の実装を1回だけにする
  }
}
