import TextaliveApiManager from "../TextaliveApiManager"

export default class GameMain extends Phaser.Scene {
    public api;

    constructor() {
      super({key: 'Main'})
    }

    preload() {
        console.log("init main");
        this.api = new TextaliveApiManager();
        this.api.init();
    
        console.log("preload()");
    }

    create() {
        console.log("create()");

        let start = this.add.text(150, 150, 'Phaser 3');
        let text = this.add.text(5, 5, "text", { font: '30px Arial'});
    }

    update() {
        const time = this.api.getPositionTime();
        console.log("game update()");
        console.log("position time : "+time);
        var text = this.api.getCurrentLyric(time);
       
        console.log("current text update data : "+text);
    }
  }