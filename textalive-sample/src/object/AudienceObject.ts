import Phaser from "phaser";
import GameMain from "../scenes/GameMain";
import image from "../assets/audience/*.png";
import DepthDefine from "../object/DepthDefine";

const AUDIENCE_SET_SIZE_X = 25;
const AUDIENCE_SET_SIZE_Y = 5;

export default class AudienceObject {
    // public audience: Phaser.GameObjects.Image;
    // public audienceY = 0;
    // public textAliveApi;
    // public gameMain;
    // public laneIndex;
    // public audienceIndex;

    private gameMain;

    private firstLane;
    private secondLane;
    private thirdLane;

    constructor(gameMain: GameMain) {
        this.gameMain = gameMain;

        this.firstLane = Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => {
            return Array.from(new Array(AUDIENCE_SET_SIZE_Y), () =>
                new Array(AUDIENCE_SET_SIZE_X).fill(null)
            );
        });
        this.secondLane = Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => {
            return Array.from(new Array(AUDIENCE_SET_SIZE_Y), () =>
                new Array(AUDIENCE_SET_SIZE_X).fill(null)
            );
        });
        this.thirdLane = Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => {
            return Array.from(new Array(AUDIENCE_SET_SIZE_Y), () =>
                new Array(AUDIENCE_SET_SIZE_X).fill(null)
            );
        });
    }
    preload() {
        this.gameMain.load.image("audience_a", image["audience_a"]);
        this.gameMain.load.image("audience_b", image["audience_b"]);
        this.gameMain.load.image("audience_c", image["audience_c"]);
        this.gameMain.load.image("audience_d", image["audience_d"]);
    }

    create() {
        this.addAudience(this.firstLane, 1000, 70);
        this.addAudience(this.secondLane, 1000, 270);
        this.addAudience(this.thirdLane, 1000, 470);
    }

    addAudience(laneAudience, baseX, baseY) {
        let diffY = 25;
        let diffX = 30;
        for (let i = 0; i < AUDIENCE_SET_SIZE_Y; i++) {
            for (let j = 0; j < AUDIENCE_SET_SIZE_X; j++) {
                laneAudience[i][j] = this.gameMain.add
                    .image(baseX - j * diffX, baseY + i * diffY, "audience_a")
                    .setDepth(DepthDefine.OBJECT + i);
                laneAudience[i][j].scale *= 0.03;
                laneAudience[i][j].alpha = 0.5;
            }
        }
    }

    update(laneScoreSet) {
        //console.log(laneScoreSet);
        // for (let j = 0; j < GameMain.LANE_SIZE; j++) {
        //     for (let i = 0; i < GameMain.AUDIENCE_SET_SIZE; i++) {
        //         if (this.audience[j][i].updateAlpha(laneScoreSet[j])) {
        //             break;
        //         }
        //     }
        // }
    }

    // constructor(laneIndex:number, index:number) {
    //     this.laneIndex = laneIndex;
    //     this.audienceIndex = index;
    // }

    // 観客を設置する
    // public createAudience(image: Phaser.GameObjects.Image) {
    //     this.audience = image;
    //     // 画像の大きさを調整したらこちらのscaleの指定は削除する
    //     this.audience.scale *= 0.75;
    //     // alpha値の初期化
    //     this.audience.alpha = 0.0;
    // }

    // // 観客を出現させる
    // public isVisibleAudience(x: number, y: number, audienceNum: number) {
    //     this.gameMain.firstLaneAudience = this.gameMain.add.image(x, y, 'audience' + audienceNum);
    //     // alpha値の初期化
    //     this.gameMain.firstLaneAudience.alpha = 0;
    // }

    // // スコアに合わせ観客のalphaを更新する
    // public updateAlpha(score): Boolean {
    //     //console.log("index " +this.audienceIndex+" alpha : "+this.audience.alpha + "score : "+score);
    //     // 後ろのビジュアライザーが見える程度(alpha = 0.5)に観客がくっきり表示されているか
    //     if (this.audience.alpha >= 0.5) {
    //         return false;
    //     }
    //     // 得点に応じて観客をはっきり表示させる
    //     this.audience.alpha = score / (this.audienceIndex + 1) * 0.002;
    //     return true;
    // }
}
