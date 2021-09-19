import TextaliveApiManager from '../TextaliveApiManager';
import UIImageButtonObject from './UIImageButtonObject';

export interface UIPauseButtonObjectCreateParam {
  scene: Phaser.Scene;
  pauseImageKey: string;
  playImageKey: string;
  imageDepth?: number;
  posX: number;
  posY: number;
  textaliveManager: TextaliveApiManager;
}

export default class UIPauseButtonObject {
  private _button: UIImageButtonObject;
  private _textaliveManager: TextaliveApiManager;

  constructor() {
    this.init();
  }

  init(): void {
    this._button = null;
    this._textaliveManager = null;
  }

  create(param: UIPauseButtonObjectCreateParam): void {
    const imageKeyMap = new Map<string, string>([
      ['pause', param.pauseImageKey],
      ['play', param.playImageKey],
    ]);

    this._button = new UIImageButtonObject();
    this._button.create({
      scene: param.scene,
      imageKeyMap,
      posX: param.posX,
      posY: param.posY,
      firstStatusName: 'pause',
    });
    this._button.responseObject.on('pointerdown', () => {
      this.pointerdown();
    });

    this._textaliveManager = param.textaliveManager;
  }

  private pointerdown(): void {
    if (!this._textaliveManager || this._textaliveManager.player.isLoading) {
      return;
    }

    if (this._textaliveManager.player.isPlaying) {
      this._button.status = 'play';
      this._textaliveManager.player.requestPause();
    } else {
      this._button.status = 'pause';
      this._textaliveManager.player.requestPlay();
    }
  }

  setVisible(value: boolean): void {
    this._button.setVisible(value);
  }
}
