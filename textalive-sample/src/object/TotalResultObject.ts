import Phaser from "phaser";
import GameResultScene from '../scenes/GameResult';

export interface TotalResultObjectCreateParam {
    scene: Phaser.Scene;
    totalImageKey: string;
    underLineKey: string;
    totalResult: number;
    depth?: number;
    posX: number;
    posY: number;
}

export default class TotalResultObject {
    private _totalImage: Phaser.GameObjects.Image;
    private _totalResutlText: Phaser.GameObjects.Text;
    private _underLineImage: Phaser.GameObjects.Image;

    constructor() {
        this.init();
    }

    public init(): void {
        this._totalImage = null;
        this._totalResutlText = null;
        this._underLineImage = null;
    }

    public create(param: TotalResultObjectCreateParam): void {
        this._totalImage = param.scene.add.image(param.posX, param.posY, param.totalImageKey);
        this._totalImage.setDepth(param.depth ? param.depth : 0).setOrigin(0.0, 0.5);

        this._totalResutlText = param.scene.add.text(param.posX + 300, param.posY, param.totalResult.toString(), GameResultScene.SCORE_TEXT_STYLE);
        this._totalResutlText.setDepth(param.depth ? param.depth : 0).setOrigin(1.0, 0.5);

        this._underLineImage = param.scene.add.image(param.posX, param.posY + this._totalResutlText.height / 2 + 10, param.underLineKey);
        this._underLineImage.setDepth(param.depth ? param.depth : 0).setOrigin(0.0, 0.5);
    }

    public update(): void {
        // pass
    }
}
