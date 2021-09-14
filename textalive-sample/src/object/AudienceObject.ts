import Phaser from 'phaser';
import GameMain from '../scenes/GameMain';

export default class AudienceObject {

    public audience : Phaser.GameObjects.Image;
    public audienceY = 0;
    public textAliveApi;
    public gameMain;
    public laneIndex;
    public audienceIndex;

    constructor(laneIndex:number, index:number) {
        this.laneIndex = laneIndex;
        this.audienceIndex = index;
    }

    // 観客を設置する
    public createAudience(image: Phaser.GameObjects.Image) {
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
        //console.log("index " +this.audienceIndex+" alpha : "+this.audience.alpha + "score : "+score);
        // 後ろのビジュアライザーが見える程度(alpha = 0.5)に観客がくっきり表示されているか
        if (this.audience.alpha >= 0.5) {
            return false;
        }
        // 得点に応じて観客をはっきり表示させる
        this.audience.alpha = score/(this.audienceIndex+1) * 0.002; 
        return true;
    }
}