import Phaser from "phaser";
import TextaliveApiManager from "../TextaliveApiManager";
import DepthDefine from "./DepthDefine";

export interface DebugInfoCreateParam {
    scene: Phaser.Scene;
    textaliveAppApi: TextaliveApiManager;
}

export default class DebugInfo {
    private _scene: Phaser.Scene;
    private _dispText: Phaser.GameObjects.Text;
    private _textaliveAppApi: TextaliveApiManager;
    private _isVisible: boolean;

    constructor() {
        this.init();
    }

    public init(): void {
        this._scene = null;
        this._dispText = null;
        this._textaliveAppApi = null;
        this._isVisible = false;
    }

    public create(param: DebugInfoCreateParam): void {
        this._scene = param.scene;

        this._dispText = this._scene.add.text(0, 0, "", { font: "20px" });
        this._dispText.setColor("white").setStroke("#000000", 6);
        this._dispText.setDepth(DepthDefine.SYSTEM + 1);

        this.setVisible(this._isVisible);

        this._textaliveAppApi = param.textaliveAppApi;
    }

    public update(): void {
        if (!this._isVisible) {
            return;
        }
        if (!this.isAvailableTextaliveAppApi()) {
            return;
        }

        let dispInfoList = [];
        dispInfoList.push(
            `fps: ${this.getFormatted(this._scene.game.loop.actualFps, 5)}`
        );

        const player = this._textaliveAppApi.player;
        const video = player.video;

        const beat = player.findBeat(player.timer.position);
        dispInfoList.push(`ビート間隔[ms]: ${beat ? beat.duration : "----"}`);
        dispInfoList.push(`ビート数: ${beat ? beat.length : "----"}`);
        dispInfoList.push(
            `1小節[ms]: ${beat ? beat.duration * beat.length : "----"}`
        );
        dispInfoList.push(
            `BPM: ${beat ? ((60 * 1000) / beat.duration).toFixed(2) : "----"}`
        );

        dispInfoList.push(
            `サビ: ${
                player.findChorus(player.timer.position) ? "True" : "False"
            }`
        );

        const chord = player.findChord(player.timer.position);
        dispInfoList.push(`コード： ${chord ? chord.name : "----"}`);

        const word = video.findWord(player.timer.position);
        dispInfoList.push(
            `声量(time): ${this.getFormatted(
                player.getVocalAmplitude(player.timer.position)
            )}`
        );
        let wordAmplitude = 0;
        if (word) {
            wordAmplitude =
                (player.getVocalAmplitude(word.startTime) +
                    player.getVocalAmplitude(word.endTime) +
                    player.getVocalAmplitude(
                        (word.startTime + word.endTime) / 2
                    )) /
                3;
        }
        dispInfoList.push(`声量(word): ${this.getFormatted(wordAmplitude)}`);

        const va = player.getValenceArousal(player.timer.position);
        dispInfoList.push(
            `V/A(time): 感情価 ${this.getFormatted(
                va.v,
                4
            )}, 覚醒度 ${this.getFormatted(va.a, 4)}`
        );

        this._dispText.setText(dispInfoList);
    }

    private getFormatted(val: number, len?: number, fix?: number): string {
        if (!len) {
            len = 8;
        }
        if (!fix) {
            fix = 2;
        }
        return val.toFixed(fix).padStart(len, " ");
    }

    public dispConsoleSongInfo(): void {
        if (!this._isVisible) {
            return;
        }
        if (!this.isAvailableTextaliveAppApi()) {
            console.log("ロードが完了していません");
            return;
        }

        console.log("[DebugInfo] 楽曲情報");

        const player = this._textaliveAppApi.player;
        const video = player.video;
        console.log(
            `歌詞数\n  char: ${video.charCount}\n  word: ${video.wordCount}\n  phrase: ${video.phraseCount}`
        );
        console.log(`最大声量: ${player.getMaxVocalAmplitude()}`);
        console.log(
            `V/A(中央値): 感情価 ${
                player.data.getMedianValenceArousal().v
            }, 覚醒度 ${player.data.getMedianValenceArousal().a}`
        );
    }

    public setVisible(value: boolean): void {
        this._isVisible = value;
        this._dispText.setVisible(value);
    }

    private isAvailableTextaliveAppApi(): boolean {
        return this._textaliveAppApi && !this._textaliveAppApi.player.isLoading;
    }
}
