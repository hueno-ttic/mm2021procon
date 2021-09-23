import visualizerService from "../../domain/service/visualizerService";
import * as Phaser from "phaser";

const POINT_SIZE = 128; // FFTの分割サイズ
const POSITION = { x: 70, y: 400 }; // 左下端の座標
const SIZE = { width: 800, height: 300 }; // 描画サイズ

export default class Visualizer {
    private readonly scene: Phaser.Scene;
    private readonly service: visualizerService;
    private readonly rects: Phaser.GameObjects.Rectangle[];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.service = new visualizerService(POINT_SIZE);
        this.rects = this.getRectPos(0).map((v) =>
            this.scene.add.rectangle(v.x, v.y, v.width, v.height, 0xff00ff)
        );
    }

    init() {}

    update(position: number) {
        const points = this.getRectPos(position);
        points.forEach((value, index) => {
            this.rects[index].setPosition(value.x, value.y);
            this.rects[index].displayWidth = value.width;
            this.rects[index].displayHeight = value.height;
        });
    }

    private getRectPos(position: number): {
        x: number;
        y: number;
        width: number;
        height: number;
    }[] {
        const width = SIZE.width / POINT_SIZE;

        const gains = this.service.getGain(position);

        const positions = gains.map((gain, index) => {
            // そのままの値だとメリハリが足りないので、tanhを掛けて補正する
            const tuned_gain =   Math.tanh(gain) / Math.tanh(1.0);
            const height = 1 + SIZE.height * tuned_gain;

            return {
                x: POSITION.x + index * width,
                y: POSITION.y - height / 2,
                width,
                height,
            };
        });

        return positions;
    }
}
