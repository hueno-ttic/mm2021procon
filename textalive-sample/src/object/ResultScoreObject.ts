import Phaser from 'phaser';
import GameMain from '../scenes/GameMain';
import GameResultScene from '../scenes/GameResult';

export interface ResultScoreObjectCreateParam {
  scene: Phaser.Scene;
  resultNameKey: string;
  underlineKey: string;
  laneKeys: string[];
  laneScores: number[];
  depth?: number;
  posX: number;
  posY: number;
}

export default class ResultScoreObject {
  private _resultNameImage: Phaser.GameObjects.Image;
  private _underLineImage: Phaser.GameObjects.Image;
  private _laneImages: Phaser.GameObjects.Image[];
  private _laneScoreTexts: Phaser.GameObjects.Text[];

  constructor() {
    this.init();
  }

  init(): void {
    this._resultNameImage = null;
    this._underLineImage = null;
    this._laneImages = new Array<Phaser.GameObjects.Image>(
      GameMain.LANE_HEART_OBJECT_ARRAY_SIZE
    );
    this._laneScoreTexts = new Array<Phaser.GameObjects.Text>(
      GameMain.LANE_HEART_OBJECT_ARRAY_SIZE
    );
  }

  create(param: ResultScoreObjectCreateParam): void {
    this._resultNameImage = param.scene.add.image(
      param.posX,
      param.posY,
      param.resultNameKey
    );
    this._resultNameImage
      .setDepth(param.depth ? param.depth : 0)
      .setOrigin(0, 0.5);

    this._underLineImage = param.scene.add.image(
      param.posX,
      param.posY + this._resultNameImage.height / 2 + 10,
      param.underlineKey
    );
    this._underLineImage
      .setDepth(param.depth ? param.depth : 0)
      .setOrigin(0, 0.5);

    for (let i = 0; i < this._laneImages.length; i++) {
      const posY =
        this._underLineImage.y + this._underLineImage.height / 2 + 30 + 50 * i;
      const image = param.scene.add.image(
        param.posX + 10,
        posY,
        param.laneKeys[i]
      );
      image.setDepth(param.depth ? param.depth : 0).setOrigin(0, 0.5);
      this._laneImages[i] = image;

      const text = param.scene.add.text(
        param.posX + 300,
        posY,
        param.laneScores[i].toString(),
        GameResultScene.SCORE_TEXT_STYLE
      );
      text.setDepth(param.depth ? param.depth : 0).setOrigin(1, 0.5);
      this._laneScoreTexts[i] = text;
    }
  }

  update(): void {
    // pass
  }
}
