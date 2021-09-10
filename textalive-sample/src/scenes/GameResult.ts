export default class GameResultScene extends Phaser.Scene {
    constructor() {
      super({
        key: 'GameResult',
      })
    }
  
    create(): void {
      const text = this.add.text(250, 200, '曲選択に戻る');
  
      text.setInteractive();
  
      text.on('pointerdown', () => {
        this.scene.start('MusicSelect');
      });
    }
  }
  