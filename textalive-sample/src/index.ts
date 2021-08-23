//必要なimport
import * as Phaser from "phaser";
import CharacterSelectScene from "./scenes/CharacterSelect";
import TitleScene from "./scenes/TitleScene";
import GameMain from "./GameMain";

//ゲームの基本設定
const config: Phaser.Types.Core.GameConfig = {
    title: "sampleLyric",    //タイトル
    version: "0.0.1",       //バージョン
    width: 1000,             //画面幅
    height: 700,            //画面高さ
    parent: "game",          //DOM上の親
    type: Phaser.AUTO,      //canvasかwebGLかを自動選択
    scene: [TitleScene, GameMain, CharacterSelectScene]
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