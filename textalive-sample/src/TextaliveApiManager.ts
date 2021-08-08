
import Lyric from "./Lyric"

import { Ease, Player, IVideo } from "textalive-app-api";


export default class TextaliveApiManager {

    public player;

    public lyrics = [];

    public playBtn;
    public jumpBtn;
    public pauseBtn;
    public rewindBtn;
    public positionEl;

    public artistSpan;
    public songSpan;
    public phraseEl;
    public beatbarEl;

    constructor() {

        this.playBtn = document.querySelector<HTMLElement>("#play");
        this.jumpBtn = document.querySelector<HTMLElement>("#jump");
        this.pauseBtn = document.querySelector<HTMLElement>("#pause");
        this.rewindBtn = document.querySelector<HTMLElement>("#rewind");
        this.positionEl = document.querySelector<HTMLElement>("#position strong");

        this.artistSpan = document.querySelector<HTMLElement>("#artist span");
        this.songSpan = document.querySelector<HTMLElement>("#song span");
        this.phraseEl = document.querySelector<HTMLElement>("#container p");
        this.beatbarEl = document.querySelector<HTMLElement>("#beatbar");

    }

    public init() {
        console.log("init");

        this.player = new Player({
            app: {
                appAuthor: "TTIC",
                appName: "TextAliveSample",
                token: "GYtUEuVODFiceV7w"
            },
            mediaElement: document.querySelector<HTMLElement>("#media")
        });

        this.player.addListener({
            onAppReady: (app) => this.onAppReady(app),
            onTimerReady: () => this.onTimerReady(),
            onTimeUpdate: (pos) => this.onTimeUpdate(pos),
            onThrottledTimeUpdate: (pos) => this.onThrottledTimeUpdate(pos),
            onVideoReady: (v) => this.onVideoReady(v)
        });
        console.log(this.player);

        console.log("init2");
    }

    // APIへのアクセス準備
    private onAppReady(app) {

        console.log("onAppReady");

        if (!app.managed) {
            document.querySelector<HTMLElement>("#control").style.display = "block";
            this.playBtn.addEventListener("click", () => this.player.video && this.player.requestPlay());
            this.jumpBtn.addEventListener("click", () => this.player.video && this.player.requestMediaSeek(this.player.video.firstPhrase.startTime));
            this.pauseBtn.addEventListener("click", () => this.player.video && this.player.requestPause());
            this.rewindBtn.addEventListener("click", () => this.player.video && this.player.requestMediaSeek(0));
        }
        if (!app.songUrl) {
            // 再生対象となる楽曲URLをセット
            this.player.createFromSongUrl("https://www.youtube.com/watch?v=XSLhsjepelI");
        }
    }

    // APIアクセス時に最初に呼ばれて動画情報をすべてとってきて設定する
    public onVideoReady(v) {
        // 歌詞のセットアップ
        if (v.firstChar) {
            var c = v.firstChar;
            while (c) {
                this.lyrics.push(new Lyric(c));
                c = c.next;

            }
        }
    }

    // APIアクセス後に動画情報設定
    public onTimerReady() {
        console.log("onTimerReady");

        // 楽曲情報
        this.artistSpan.textContent = this.player.data.song.artist.name;
        this.songSpan.textContent = this.player.data.song.name;

        // 動画が読み込めたのでボタンを表示
        document
            .querySelectorAll("button")
            .forEach((btn) => (btn.disabled = false));
    }

    // 再生中に呼び出され続けて画面の状態をupdateする
    public onTimeUpdate(position) {

        console.log("onTimeUpdate");

        // 現在再生されている時のBeat情報を取得
        const beat = this.player.findBeat(position);
        if (!beat) {
            return;
        }
        this.beatbarEl.style.width = `${Math.ceil(Ease.circIn(beat.progress(position)) * 100)}%`;

        var p = this.player.videoPosition;
        for (var i = 0; i < this.lyrics.length; i++) {
            if (p > this.lyrics[i].startTime && p < this.lyrics[i].endTime) {
                console.log("発話中の単語：" + this.lyrics[i].text);
                console.log("videoPosition : " + this.player.videoPosition);
                // 画面表示用設定
                this.phraseEl.textContent = this.lyrics[i].text;
            }
        }
    }

    public onThrottledTimeUpdate(position) {
        console.log("onThrottledTimeUpdate");
        console.log("position : " + position);
        this.positionEl.textContent = String(Math.floor(position));
        console.log("onThrottledTimeUpdate Text : " + this.positionEl.textContent);

    }
}