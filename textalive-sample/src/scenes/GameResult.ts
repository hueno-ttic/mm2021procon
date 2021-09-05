export default class GameResultScene extends Phaser.Scene {
    constructor() {
      super({
        key: 'GameResult',
      })
    }
  
    create(): void {
      const text = this.add.text(250, 200, 'スタートに戻る');
  
      text.setInteractive();
  
      text.on('pointerdown', () => {
        this.scene.start('TitleScene');
      });
    }
  }
  