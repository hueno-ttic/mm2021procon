import { MusicInfo } from "../interface/MusicInfo";

export function buildMusicInfo(): MusicInfo[] {
    let usomo: MusicInfo = {
        id: 1,
        title: "嘘も本当も君だから",
        label: "usomo",
        author: "真島ゆろ",
        url: "https://www.youtube.com/watch?v=Se89rQPp5tk",
    };

    let natsu: MusicInfo = {
        id: 2,
        title: "夏をなぞって",
        label: "natsu",
        author: "シロクマ消しゴム",
        url: "https://www.youtube.com/watch?v=3wbZUkPxHEg",
    };

    let kokoro: MusicInfo = {
        id: 3,
        title: "その心に灯る色は",
        label: "sonokokoro",
        author: "ラテルネ",
        url: "https://www.youtube.com/watch?v=bMtYf3R0zhY",
    };

    let hisoka: MusicInfo = {
        id: 4,
        title: "密かなる交信曲",
        label: "hisoka",
        author: "濁茶",
        url: "https://www.youtube.com/watch?v=Ch4RQPG1Tmo",
    };

    let freedom: MusicInfo = {
        id: 5,
        title: "Freedom!",
        label: "freedom",
        author: "Chiquewa",
        url: "https://www.youtube.com/watch?v=pAaD4Hta0ns",
    };

    let first_note: MusicInfo = {
        id: 6,
        title: "First Note",
        label: "first_note",
        author: "blues",
        url: "https://piapro.jp/t/FDb1",
    };

    return [usomo, natsu, kokoro, hisoka, freedom, first_note];
}
