//必要なimport
import * as Phaser from "phaser";
import GameMain from "./scenes/GameMain";

//ゲームの基本設定
const config: Phaser.Types.Core.GameConfig = {
    title: "sampleLyric",    //タイトル
    version: "0.0.1",       //バージョン
    width: 320,             //画面幅
    height: 240,            //画面高さ
    parent: "game",          //DOM上の親
    type: Phaser.AUTO,      //canvasかwebGLかを自動選択
    scene: [GameMain]
};

//ゲームメインのクラス
export class Game extends Phaser.Game {
    constructor() {
        super(config);
    }
}

class Main {
    constructor() { }
    public initialize() {
        //windowイベントで、ロードされたらゲーム開始
        window.addEventListener("load", () => {
            console.log("start");
            var gameApp = new Game();
        });
    }
}

new Main().initialize();