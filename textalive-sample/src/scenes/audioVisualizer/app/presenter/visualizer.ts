import visualizerService from "../../domain/service/visualizerService";
import * as Phaser from "phaser";
import { POINT_SIZE } from "../constants/constants";

const POSITION = { x: 1240, y: 30 }; // 右上端の座標
const SIZE = { width: 205, height: 590 }; // 描画サイズ

const SCREEN_POSITION = { x: 1245, y: 38 }; // 左上端の座標
const SCREEN_SIZE = {
    width: 22,
    height: 570,
}; // 描画サイズ

export default class Visualizer {
    private readonly scene: Phaser.Scene;
    private readonly service: visualizerService;
    private rects: Phaser.GameObjects.Rectangle[];
    private screen: Phaser.GameObjects.Rectangle[];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.service = new visualizerService(POINT_SIZE);
        this.rects = [];
        this.screen = [];
    }

    create() {
        const gains = this.service.getGain(0);
        this.getRectPos(gains).forEach((v) =>
            this.rects.push(
                this.scene.add.rectangle(
                    v.x,
                    v.y,
                    v.width,
                    v.height,
                    v.color,
                    0.2
                )
            )
        );

        this.getScreenPos(gains).forEach((v, index) =>
            this.screen.push(
                this.scene.add
                    .rectangle(v.x, v.y, v.width, v.height, v.color, 0.9)
                    .setDisplayOrigin(0, 0)
                    .setRotation(
                        (0.29 * Math.PI * (index - POINT_SIZE / 2)) /
                            (POINT_SIZE - 1)
                    )
            )
        );
    }

    update(position: number) {
        const gains = this.service.getGain(position);

        this.getRectPos(gains).forEach((value, index) => {
            this.rects[index]?.setPosition(value.x, value.y);
            this.rects[index]?.displayWidth = value.width;
            this.rects[index]?.displayHeight = value.height;
            this.rects[index]?.fillColor = value.color;
        });

        this.getScreenPos(gains).forEach((value, index) => {
            this.screen[index]?.setPosition(value.x, value.y);
            this.screen[index]?.displayWidth = value.width;
            this.screen[index]?.displayHeight = value.height;
            this.screen[index]?.fillColor = value.color;
        });
    }

    private getScreenPos(gains: number[]): {
        x: number;
        y: number;
        width: number;
        height: number;
        color: number;
    }[] {
        const height = SCREEN_SIZE.height / POINT_SIZE;
        const brightness = Math.min(
            1.0,
            0.5 +
                8 *
                    gains.reduce(
                        (prev, current) => prev + current / gains.length
                    )
        );

        return gains.map((gain, index) => {
            // そのままの値だとメリハリが足りないので、tanhを掛けて補正する
            const tuned_gain = Math.tanh(gain) / Math.tanh(1.0);
            const width = Math.min(
                1 + SCREEN_SIZE.width * tuned_gain * 1.5,
                SCREEN_SIZE.width
            );

            return {
                x: SCREEN_POSITION.x, //+ width / 2,
                y: SCREEN_POSITION.y + height * index,
                width,
                height,
                color: this.getColor(index, brightness),
            };
        });
    }

    private getRectPos(gains: number[]): {
        x: number;
        y: number;
        width: number;
        height: number;
        color: number;
    }[] {
        const height = SIZE.height / POINT_SIZE;
        const brightness = Math.min(
            1.0,
            0.5 +
                8 *
                    gains.reduce(
                        (prev, current) => prev + current / gains.length
                    )
        );

        return gains.map((gain, index) => {
            // そのままの値だとメリハリが足りないので、tanhを掛けて補正する
            const tuned_gain = Math.tanh(gain) / Math.tanh(1.0);
            const width = Math.min(
                1 + SIZE.width * tuned_gain * 1.5,
                SIZE.width
            );

            return {
                x: POSITION.x - width / 2,
                y: POSITION.y + height * index,
                width,
                height,
                color: this.getColor(index, brightness),
            };
        });
    }

    private getColor(index: number, brightness: number) {
        const red = [255, 109, 30];
        const yellow = [246, 205, 11];
        const green = [41, 255, 12];
        const blue = [4, 180, 254];
        const colors = [red, yellow, green];

        const grad = index / POINT_SIZE;
        const percent1 = Math.max(1 - grad * 3, 0); // 33.3% まで緩やかに下り残りは0
        const percent3 = Math.max(grad * 3 - 2, 0); // 66.6% までは0で緩やかに1に近づく
        const percent2 = 1 - percent1 - percent3; // のこり
        const percents = [percent1, percent2, percent3];

        return [0, 1, 2]
            .map((colorId) => {
                return percents
                    .map(
                        (percent, index) =>
                            colors[index][colorId] * percent * brightness
                    )
                    .map((val) => Math.floor(val))
                    .reduce((prev, val) => prev + val, 0);
            })
            .reduce((prev, val, index) => prev + (val << (8 * (2 - index))), 0);
    }
}
