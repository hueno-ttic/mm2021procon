import Phaser from 'phaser';
import GameMain from '../scenes/GameMain';

export default class AudienceObject {

    public audience : Phaser.GameObjects.Image;
    public audienceY = 0;
    public textAliveApi;
    public gameMain;
    public index;


    // constructor(gameMain : GameMain) {
    //     this.gameMain = gameMain;
    // }

    constructor(index:number) {
        this.index = index;
    }

    // 観客を設置する
    public createAudience(image) {
        this.audience = image;
        this.audience.scale *= 0.75;
        // alpha値の初期化
        this.audience.alpha = 0.0;
    }

    // 観客を出現させる
    public isVisibleAudience(x:number, y:number, audienceNum:number) {
        this.gameMain.firstLaneAudience = this.gameMain.add.image(x, y, 'audience'+audienceNum);
        // alpha値の初期化
        this.gameMain.firstLaneAudience.alpha = 0;
    }

    // スコアに合わせ更新する
    public updateAlpha(score) :Boolean {
        console.log("index " +this.index+" alpha : "+this.audience.alpha + "score : "+score);
        // すでにくっきり表示されている
        if (this.audience.alpha >= 1) {
            return false;
        }

        this.audience.alpha = score/(this.index+1) * 0.005;
        return true;
    }
}