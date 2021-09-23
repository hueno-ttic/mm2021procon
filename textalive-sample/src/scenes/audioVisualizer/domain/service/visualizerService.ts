import GainRepository from "../../infrastructure/repository/GainRepository";

const TIME_SMOOTH = 20; // x 10msの時間で平滑化する

export default class visualizerService {
    private readonly size: number;
    private readonly repository: GainRepository;

    constructor(size: number) {
        this.size = size;
        this.repository = new GainRepository(this.size);
    }

    public getGain(position: number): number[] {
        // データソースからゲインを取得して [時間][周波数] の行列から [周波数][時間] の行列に変換する
        const gains = this.transpose(this.repository.getGain(position ?? 0.0, TIME_SMOOTH));

        // 周波数ごとにスムージングして出力
        return gains.map((gain) => this.smoothing(gain));
    }

    /**
     * 入力された値を平滑化する
     * @param value
     * @private
     */
    private smoothing(value: number[]): number {
        return Math.max(...value);
        // 平均を取る
        return value.reduce((acc, val) => acc + val / value.length, 0);
    }

    /**
     * 配列の行列を入れ替える
     * @param array
     * @private
     */
    private transpose(array: number[][]): number[][] {
        return array[0].map((_, column) => array.map((row) => row[column]));
    }
}
