export default class BuildFftRepository {
    private readonly size: number;

    constructor(size: number) {
        this.size = size;
    }

    public convertFftData(gains: number[][]) {
        return gains.map((gain) => this.reduceArray(gain, this.size));
    }

    /**
     * 周波数成分をserviceで読み込める形に畳み込む
     * @param originArray
     * @param targetSize
     */
    private reduceArray(originArray: number[], targetSize: number): number[] {
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
