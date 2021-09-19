// 必要なimport
import * as Phaser from "phaser";
import SplashScene from "./scenes/SplashScene";
import TitleScene from "./scenes/TitleScene";
import GameMain from "./scenes/GameMain";
import GameResult from "./scenes/GameResult";
import MusicSelectScene from "./scenes/MusicSelect";

// ゲームの基本設定
const config: Phaser.Types.Core.GameConfig = {
  title: "sampleLyric", // タイトル
  version: "0.0.1", // バージョン
  width: 1280, // 画面幅
  height: 720, // 画面高さ
  parent: "game", // DOM上の親
  type: Phaser.AUTO, // canvasかwebGLかを自動選択
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  scene: [SplashScene, TitleScene, GameMain, MusicSelectScene, GameResult],
};

// ゲームメインのクラス
export class Game extends Phaser.Game {
  constructor() {
    super(config);
  }
}

class Main {
  constructor() {}
  initialize() {
    // windowイベントで、ロードされたらゲーム開始
    window.addEventListener("load", () => {
      console.log("start");
      const gameApp = new Game();
    });
  }
}

new Main().initialize();
