import Phaser from "phaser";
import GameMain from "../scenes/GameMain";
import DepthDefine from "./DepthDefine";
import image from "../assets/game_main/*.png";

export default class HeartJudgeEffectObject {
    private gameMain: GameMain;

    constructor(gameMain) {
        this.gameMain = gameMain;
    }

    update(x, y, judge): void {
        if (judge) {
            let excellentImage = this.gameMain.add
                .image(x, y, "excellent")
                .setDepth(DepthDefine.OBJECT + 50);
            excellentImage.scale *= 0.8;
            this.gameMain.tweens.add({
                //tweenを適応させる対象
                targets: excellentImage,
                //tweenさせる値
                x: excellentImage.x + 50,
                y: excellentImage.y - 50,
                alpha: 0,
                //tweenにかかる時間
                duration: 500,
                //tween開始までのディレイ
                delay: 0,
                //tweenのリピート回数（-1で無限）
                repeat: 0,
                //easingの指定
                ease: "Linear",
            });
        } else {
            let badImage = this.gameMain.add
                .image(x, y, "bad")
                .setDepth(DepthDefine.OBJECT + 50);
            badImage.scale *= 0.8;

            this.gameMain.tweens.add({
                //tweenを適応させる対象
                targets: badImage,
                //tweenさせる値
                x: badImage.x + 50,
                y: badImage.y - 50,
                alpha: 0,
                //tweenにかかる時間
                duration: 500,
                //tween開始までのディレイ
                delay: 0,
                //tweenのリピート回数（-1で無限）
                repeat: 0,
                //easingの指定
                ease: "Linear",
            });
        }
    }
}
