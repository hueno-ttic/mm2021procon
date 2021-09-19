const MAX_TIME = 300 * 100; // 周波数情報の最大時間( 300sec )

export default class GainRepository {
    private readonly size: number;
    private readonly gains: number[][];

    constructor(size: number) {
        this.size = size;
        this.gains = [];

        // TODO: 一旦ランダムな波形情報をつかう。実際はjsonから読み込む
        for(let i = 0; i < MAX_TIME; i++) {
            const gainList = [];
            for(let j = 0; j < this.size; j++) {
                gainList.push(Math.random());
            }
            this.gains.push(gainList);
        }
    }

    public getGain(position: number, width: number = 3): number[][] {
        return Array.from(
            {length: width * 2},
            (v, k) =>
                this.getGainByPosition(position - width + k)
        )
    }

    private getGainByPosition(position: number): number[] {
        return (position >= 0)? this.gains[Math.floor(position / 10)] : Array<number>(this.size).fill(0.0);
    }
}