//必要なimport
import * as Phaser from "phaser";
import GameMain from "./scenes/main";
import TextaliveApiManager from "./TextaliveApiManager"

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
   // private _player: TextaliveApiManager;

    constructor() { }

    public initialize() {
     //   this._player = new TextaliveApiManager();

        //windowイベントで、ロードされたらゲーム開始
        window.addEventListener("load", () => {
            console.log("start");
            var gameApp = new Game();
        });

        // // // バッググラウンドで実行する機能をListenerに登録
        // this._player.player.addListener({
        //     onAppReady: (app) => this._player.player.onAppReady(app),
        //     onTimerReady: () => this._player.player.onTimerReady(),
        //     onTimeUpdate: (pos) => this._player.player.onTimeUpdate(pos),
        //     onThrottledTimeUpdate: (pos) => this._player.player.onThrottledTimeUpdate(pos),
        //     onVideoReady: (v) => this._player.player.onVideoReady(v)
        // });
       // console.log(this._player.player);
    }
}

new Main().initialize();