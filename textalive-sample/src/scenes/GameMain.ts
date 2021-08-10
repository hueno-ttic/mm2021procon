import TextaliveApiManager from "../TextaliveApiManager"

export default class GameMain extends Phaser.Scene {
    public api;

    public textData;

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
        this.textData.setText( text);
        console.log("current text update data : "+text);
    }
  }