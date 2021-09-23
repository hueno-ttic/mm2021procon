import axios, { AxiosResponse } from "axios";
import fft from "../../../../assets/fft/build/*.data";

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
            this.gains = response.data;
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
}
