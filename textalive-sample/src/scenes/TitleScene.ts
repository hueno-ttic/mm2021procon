export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Title',
    })
  }

  create(): void {
    const text = this.add.text(250, 200, '押したらキャラクター選択');

    text.setInteractive();

    text.on('pointerdown', () => {
      this.scene.start('CharacterSelect');
    });
  }
}
