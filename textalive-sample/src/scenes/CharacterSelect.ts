export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'CharacterSelect',
    })
  }

  create(): void {
    const text = this.add.text(250, 200, 'キャラクター選択');

    text.setInteractive();

    text.on('pointerdown', () => {
      this.scene.start('Main');
    });
  }
}
