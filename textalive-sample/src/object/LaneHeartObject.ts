import Phaser from 'phaser';

export interface LaneHeartObjectCreateParam {
    image: Phaser.GameObjects.Image;
    scale: number;
}

export default class LaneHeartObject {
    private _image: Phaser.GameObjects.Image;
    private _scaleCount: number;
    private _scaleFlag: boolean;

    static readonly STRETCH_ANIMATION_FRAME: number = 15;

    constructor() {
        this.init();
    }

    public init(): void {
        this._image = null;
        this._scaleCount = 0;
        this._scaleFlag = false;
    }

    public update(): void {
        this.stretchHeart();
    }

    public create(param: LaneHeartObjectCreateParam): void {
        this.image = param.image;
        this.image.scaleX *= param.scale;
        this.image.scaleY *= param.scale;
    }

    // 伸縮アニメーション処理
    private stretchHeart(): void {
        // ハートの伸縮判定
        if (this._scaleFlag) {
            this._scaleCount++;
            if (this._scaleCount > LaneHeartObject.STRETCH_ANIMATION_FRAME) {
                this._scaleFlag = false;
                this._scaleCount = 0;
            }
        }
    }

    get image(): Phaser.GameObjects.Image {
        return this._image;
    }

    set image(image: Phaser.GameObjects.Image) {
        if (this._image) {
            this._image.destroy(true);
        }
        this._image = image;
    }

    get scaleFlag(): boolean {
        return this._scaleFlag;
    }

    set scaleFlag(flag: boolean) {
        this._scaleFlag = flag;
    }

}