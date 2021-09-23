import axios, { AxiosResponse } from "axios";
import fft from "../../../../assets/fft/*.data";

export default class GainRepository {
    private readonly size: number;
    private gains: number[][];

    constructor(size: number) {
        this.size = size;
        this.gains = [[]];

        // TODO: 一旦固定のJSON 実際は曲ごとにJSONを読み分ける
        (async () => {
            const response = await axios.get<
                number[][],
                AxiosResponse<number[][]>
            >(fft["fft"]);
            this.gains = response.data.map((gain, idx) =>
                this.reduceArray(gain, this.size, idx)
            );
        })();
    }

    public getGain(position: number, width: number = 3): number[][] {
        return Array.from({ length: width * 2 }, (v, k) =>
            this.getGainByPosition(position - width + k)
        );
    }

    private getGainByPosition(position: number): number[] {
        const index = Math.floor(position / 10);

        // gainにデータがあればそれを返却
        if (
            position >= 0 &&
            this.gains.length > index &&
            this.gains[index] &&
            this.gains[index].length > 0
        ) {
            return this.gains[index];
        }

        // データがないときは0埋めしたゲインを返却
        return Array<number>(this.size).fill(0.0);
    }

    /**
     * 周波数成分をserviceで読み込める形に畳み込む
     * @param originArray
     * @param targetSize
     */
    private reduceArray(originArray: number[], targetSize, index): number[] {
        // データに不足がある場合は0埋め
        if (!originArray) {
            return Array<number>(this.size).fill(0.0);
        }

        const size = originArray.length / targetSize;
        return Array.from({ length: targetSize }, (_, idx) =>
            originArray.slice(
                // 配列の範囲を超えてスライスしないようにする
                Math.min(0, (idx - 1) * size),
                Math.min(idx * size, originArray.length)
            )
        )
            .map((array) => array.map((v) => Math.abs((v - 128) / 128))) // 周波数領域ごとのゲインを正規化
            .map((array) => this.avg(array)); // 周波数ごとのゲインを平滑化
    }

    // 平均を取る
    private avg(value: number[]): number {
        return value.reduce((acc, val) => acc + val / value.length, 0);
    }
}
