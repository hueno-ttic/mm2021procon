import Phaser from "phaser";
import GameMain from "../scenes/GameMain";
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
    private _laneImages: Array<Phaser.GameObjects.Image>;
    private _laneScoreTexts: Array<Phaser.GameObjects.Text>;

    constructor() {
        this.init();
    }

    public init(): void {
        this._resultNameImage = null;
        this._underLineImage = null;
        this._laneImages = new Array<Phaser.GameObjects.Image>(GameMain.LANE_HEART_OBJECT_ARRAY_SIZE);
        this._laneScoreTexts = new Array<Phaser.GameObjects.Text>(GameMain.LANE_HEART_OBJECT_ARRAY_SIZE);
    }

    public create(param: ResultScoreObjectCreateParam): void {
        this._resultNameImage = param.scene.add.image(param.posX + 0, param.posY + 0, param.resultNameKey);
        this._resultNameImage.setDepth(0 + param.depth ? param.depth : 0).setOrigin(0.0, 0.5);

        this._underLineImage = param.scene.add.image(param.posX + 0, param.posY + this._resultNameImage.height / 2 + 10, param.underlineKey);
        this._underLineImage.setDepth(0 + param.depth ? param.depth : 0).setOrigin(0.0, 0.5);

        for (let i = 0; i < this._laneImages.length; i++) {
            const posY = this._underLineImage.y + this._underLineImage.height / 2 + 30 + 50 * i;
            let image = param.scene.add.image(param.posX, posY, param.laneKeys[i]);
            image.setDepth(0 + param.depth ? param.depth : 0).setOrigin(0.0, 0.5);
            this._laneImages[i] = image;

            let text = param.scene.add.text(param.posX + 300, posY, param.laneScores[i].toString(), GameResultScene.SCORE_TEXT_STYLE);
            text.setDepth(0 + param.depth ? param.depth : 0).setOrigin(1.0, 0.5);
            this._laneScoreTexts[i] = text;
        }
    }

    public update(): void {
        // pass
    }
}
