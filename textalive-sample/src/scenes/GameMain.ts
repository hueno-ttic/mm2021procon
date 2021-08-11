import TextaliveApiManager from "../TextaliveApiManager"

export default class GameMain extends Phaser.Scene {
    public api;

    public textData;

    public counter = 5;

    constructor() {
      super({key: 'Main'})
    }

    preload() {
        console.log("preload()");
        this.api = new TextaliveApiManager();
        this.api.init();
    }

    create() {
        console.log("create()");
        this.textData = this.add.text(5, 5, "text", { font: '30px Arial'});
    }

    update() {
        const time = this.api.getPositionTime();
        console.log("game update()");
        var text = this.api.getCurrentLyric(time);
        // textdataの更新
        this.textData.setText(text);
        // 550以上になったら折り返す
        if (this.textData.x > 550) {
            this.counter *= -1;  
        }
        // 5以下になったら折り返す
        if (this.textData.x < 5) {
            this.counter *= -1;
        }
        // 文字を移動させる
        this.textData.x += this.counter;
        console.log("テキストの座標：" + this.textData.x + "," + this.textData.y);
        console.log("current text update data : " + text);
    }
  }