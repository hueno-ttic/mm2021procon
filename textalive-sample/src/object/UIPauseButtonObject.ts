import TextaliveApiManager from "../TextaliveApiManager";
import UIImageButtonObject from "./UIImageButtonObject";

export interface UIPauseButtonObjectCreateParam {
    scene: Phaser.Scene;
    pauseImageKey: string;
    playImageKey: string;
    startImageKey: string;
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

    public init(): void {
        this._button = null;
        this._textaliveManager = null;
    }

    public create(param: UIPauseButtonObjectCreateParam): void {
        const imageKeyMap = new Map<string, string>([
            ["pause", param.pauseImageKey],
            ["play", param.playImageKey],
            ["start", param.startImageKey],
        ]);

        this._button = new UIImageButtonObject();
        this._button.create({
            scene: param.scene,
            imageKeyMap,
            posX: param.posX,
            posY: param.posY,
            firstStatusName: "pause",
        });
        this._button.responseObject.on("pointerdown", () => {
            this.pointerdown();
        });

        this._textaliveManager = param.textaliveManager;
    }

    private pointerdown(): void {
        if (
            !this._textaliveManager ||
            this._textaliveManager.player.isLoading
        ) {
            return;
        }

        if (this._textaliveManager.player.isPlaying) {
            this._setStatus("play");
        } else {
            this._setStatus("pause");
        }
    }

    public setStatus(status: string): void {
        this._setStatus(status);
    }

    private _setStatus(status: string): void {
        this._button.status = status;
        switch (status) {
            case "play":
                this._textaliveManager.player.requestPause();
                break;
            case "pause":
                this._textaliveManager.player.requestPlay();
                break;
        }
    }

    public setVisible(value: boolean): void {
        this._button.setVisible(value);
    }

    get status(): string {
        return this._button.status;
    }
}
