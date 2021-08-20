import Lyric from "./Lyric";
import TextaliveApiManager from "./TextaliveApiManager";
import image from "./assets/*.png";

// クリック箇所のY座標を保存
var touchY = 5;

export default class GameMain extends Phaser.Scene {
    public api;

    public firstLane = 100;
    public secondLane = 300;
    public thirdLane = 500;

    public textData = [];

    public indexStart = 0;

    public counter = 15;

    // 歌詞の出現するY座標
    public lyricY = 60;

    // ハートのX座標
    public heartX = 150;


    // ゲームのスコア
    public score = 0;
    public scoreText;

    // 動作オブジェクト
    public mikuImg;

    constructor() {
        super({ key: 'GameMain' })
    }

    preload() :void {
        console.log("preload()");

        // this.load.baseURL = "http://localhost:1234/assets";
        // this.load.crossOrigin = 'anonymous';
        this.api = new TextaliveApiManager();
        this.api.init();
        this.load.image('backImg', image['back_img']);

        this.load.image('miku', image['mini_miku']);
        this.load.image('heartRed1', image['heart_red']);
        this.load.image('heartRed2', image['heart_red']);
        this.load.image('heartRed3', image['heart_red']);
        this.load.image('lineRed1', image['line_red']);
        this.load.image('lineRed2', image['line_red']);
        this.load.image('lineRed3', image['line_red']);
    }

    create() : void{
        console.log("create()");
        console.log(this);
        this.add.image(500, 350, 'backImg');

        // ミクの設定
        this.mikuImg = this.add.image(900, this.lyricY, 'miku');
        this.mikuImg.scaleX = this.mikuImg.scaleX * 0.6;
        this.mikuImg.scaleY = this.mikuImg.scaleY * 0.6;

        // ハートの設定
        var scale = 0.9;
        var firstLaneHeart =  this.add.image(this.heartX, this.firstLane, 'heartRed1');
        firstLaneHeart.scaleX = firstLaneHeart.scaleX * scale;
        firstLaneHeart.scaleY = firstLaneHeart.scaleY * scale;
        var secondLaneHeart = this.add.image(this.heartX, this.secondLane, 'heartRed2');
        secondLaneHeart.scaleX = secondLaneHeart.scaleX * scale;
        secondLaneHeart.scaleY = secondLaneHeart.scaleY * scale;
        var thirdLaneHeart = this.add.image(this.heartX, this.thirdLane, 'heartRed3');
        thirdLaneHeart.scaleX = thirdLaneHeart.scaleX * scale;
        thirdLaneHeart.scaleY = thirdLaneHeart.scaleY * scale;

        // ラインの枠
        var lineScale = 0.9;
        var firstLaneLine =  this.add.image(430, this.firstLane, 'lineRed1');
        firstLaneLine.scaleX = firstLaneLine.scaleX * 0.4;
        firstLaneLine.scaleY = firstLaneLine.scaleY * 0.5;
        var secondLaneLine =  this.add.image(430, this.secondLane, 'lineRed2');
        secondLaneLine.scaleX = secondLaneLine.scaleX * 0.4;
        secondLaneLine.scaleY = secondLaneLine.scaleY * 0.5;
        var thirdLaneLine =  this.add.image(430, this.thirdLane, 'lineRed3');
        thirdLaneLine.scaleX = thirdLaneLine.scaleX * 0.4;
        thirdLaneLine.scaleY = thirdLaneLine.scaleY * 0.5;


        // スコアの設定
        var scoreT = this.add.text(30, 625, "Score" , { font: '18px Arial' });
        scoreT.setStroke("black", 10);
        this.scoreText = this.add.text(30, 650, String(this.score) , { font: '18px Arial' });
        this.scoreText.setStroke("black", 10);
        
        
    }

    update() {
        // クリックした際に3レーンのいずれかに移動する
        if (touchY > 0 && touchY < 200) {
            this.lyricY = this.firstLane;
        } else if (touchY >= 250 && touchY < 400) {
            this.lyricY = this.secondLane;
        } else if (touchY >= 450 && touchY < 700) {
            this.lyricY = this.thirdLane;
        }

        // ミクの場所の更新
        this.mikuImg.y = this.lyricY;

        // 曲が流れているときだけ動く
        if (this.api.getPositionTime() != null && this.api.getPositionTime() != 0) {
            // 若干速めに表示するために500ms追加する
            const time = this.api.getPositionTime() + 500;
            var lyric = this.api.getCurrentLyric(time);
            var lyricText;
            var lyricIndex;
            if (lyric != null ) { 
                lyricText = lyric.text;
                lyricIndex = lyric.index;
            }
            // lyricText = this.api.getCurrentLyricText(time);
            // lyricIndex = this.api.getCurrentLyricIndex(time);

            // 歌詞データの追加
            if ( lyricText != null) {                
                this.textData[lyricIndex] = this.add.text(900, this.lyricY - 20, lyricText, { font: '50px Arial' });
                this.textData[lyricIndex].setStroke("black", 10);
            }
        }

        // テキストの描画更新
        for (var i = this.indexStart; i < lyricIndex; i++) {
            if (typeof this.textData[i] === "undefined") {
                continue;
            }
            // 一定区間移動したら歌詞を非表示する
            if (this.textData[i].x < this.heartX) {
                this.indexStart++;
                this.textData[i].setVisible(false);
                // score計算を行う
                this.score = this.calcScore(this.score);
                this.scoreText.setText("Score : " + this.score);
            }
            // 文字を移動させる
            if ((typeof this.textData[i] !== "undefined")) {
                //console.log(typeof this.textData[i].x);
                this.textData[i].x -= this.counter;
            }
            // console.log("テキストの座標：" + this.textData[i].x + "," + this.textData[i].y);
            // console.log("current text update data : " + lyric);
        }
    }

    //  
    private calcScore(score:number) : number{

        score = score + 100;
        return score;
    }
}


var touchHandler = function (e) {
    var x = 0, y = 0;
    if (e.touches && e.touches[0]) {

        x = e.touches[0].clientX;
        y = e.touches[0].clientY;

    }
    else if (e.clientX && e.clientY) {

        x = e.clientX;
        y = e.clientY;
    }
    touchY = y;
    console.log("タッチx座標 : " + x);
    console.log("タッチy座標 : " + y);
};

// タッチイベント
window.addEventListener('touchstart', touchHandler, false);
// クリックイベント
window.addEventListener('click', touchHandler, false);