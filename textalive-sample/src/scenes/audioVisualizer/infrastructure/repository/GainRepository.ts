const MAX_TIME = 300 * 100; // 周波数情報の最大時間( 300sec )

import fftjson from "../fixture/fft.json";
const analyzed: number[][] = fftjson;

export default class GainRepository {
    private readonly size: number;
    private readonly gains: number[][];

    constructor(size: number) {
        this.size = size;
        this.gains = [];

        // TODO: 一旦固定のJSON 実際は曲ごとにJSONを読み分ける
        this.gains = analyzed.map(this.reduceArray);
    }

    public getGain(position: number, width: number = 3): number[][] {
        return Array.from({ length: width * 2 }, (v, k) =>
            this.getGainByPosition(position - width + k)
        );
    }

    private getGainByPosition(position: number): number[] {
        return position >= 0
            ? this.gains[Math.floor(position / 10)]
            : Array<number>(this.size).fill(0.0);
    }

    /**
     * 周波数成分をserviceで読み込める形に畳み込む
     * @param originArray
     * @param targetSize
     */
    private reduceArray(originArray: number[], targetSize): number[] {
        const size = originArray.length / this.size;
        return Array.from({ length: targetSize }, (_, idx) =>
            originArray.slice(
                // 配列の範囲を超えてスライスしないようにする
                Math.min(0, (idx - 1) * size),
                Math.min(idx * size, originArray.length)
            )
        )
        .map(array => array.map((v) => Math.abs(v - 128))) // 周波数領域ごとのゲインを正規化
        .map(array => this.avg(array)); // 周波数ごとのゲインを平滑化
    }

    // 平均を取る
    private avg(value: number[]): number {
        return value.reduce((acc, val) => acc + val / value.length);
    }
}
