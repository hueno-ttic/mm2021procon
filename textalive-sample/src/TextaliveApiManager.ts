import Lyric from "./Lyric"

import { Ease, Player, IVideo, NullGraphicsDriver } from "textalive-app-api";

export default class TextaliveApiManager {

    public player;

    public lyrics = [];

    public positionTime: Number;

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

        this.beatbarEl = document.querySelector<HTMLElement>("#beatbar");

    }

    public init():void {

        this.player = new Player({
            app: {
                appAuthor: "TTIC",
                appName: "TextAliveSample",
                token: "GYtUEuVODFiceV7w"
            },
            mediaElement: document.querySelector<HTMLElement>("#media")
    });

        // バッググラウンドで実行する機能をListenerに登録
        this.player.addListener({
            onAppReady: (app) => this.onAppReady(app),
            onTimerReady: () => this.onTimerReady(),
            onTimeUpdate: (pos) => this.onTimeUpdate(pos),
            onThrottledTimeUpdate: (pos) => this.onThrottledTimeUpdate(pos),
            onVideoReady: (v) => this.onVideoReady(v)
        });
        console.log(this.player);
    }

    // APIへのアクセス準備
    private onAppReady(app):void {

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
            this.player.createFromSongUrl("https://www.youtube.com/watch?v=Se89rQPp5tk");
        }
    }

    // APIアクセス時に最初に呼ばれて動画情報をすべてとってきて設定する
    public onVideoReady(v):void {
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
    public onTimerReady():void {
        console.log("onTimerReady");

        // 楽曲情報

        // 動画が読み込めたのでボタンを表示
        document
            .querySelectorAll("button")
            .forEach((btn) => (btn.disabled = false));
    }

    // 再生中に呼び出され続けて画面の状態をupdateする
    public onTimeUpdate(position):void {

        // 現在再生されている時のBeat情報を取得
        const beat = this.player.findBeat(position);
        if (!beat) {
            return;
        }
        this.beatbarEl.style.width = `${Math.ceil(Ease.circIn(beat.progress(position)) * 100)}%`;

        // 発話の500ms先の歌詞データを取得
        var p = this.player.videoPosition + 500;
        for (var i = 0; i < this.lyrics.length; i++) {
            if (p > this.lyrics[i].startTime && p < this.lyrics[i].endTime) {
                //console.log("発話中の単語：" + this.lyrics[i].text);
                //console.log("videoPosition : " + this.player.videoPosition);
                // 画面表示用設定
                //this.phraseEl.textContent = this.lyrics[i].text;
                //this.updateLyricData(this.lyrics[i]);
                console.log("lyrics point x : "+this.lyrics[i].x+ "  y : "+this.lyrics[i].y);
            }
        }

        //console.log("setPositionTime "+ position);
        this.positionTime = position;

    }

    public onThrottledTimeUpdate(position):void {
        // console.log("onThrottledTimeUpdate");
        // console.log("position : " + position);
        // this.positionEl.textContent = String(Math.floor(position));
        // console.log("onThrottledTimeUpdate Text : " + this.positionEl.textContent);
    }

    public getCurrentLyric(positoinTime : number): string {

        for (var i = 0; i < this.lyrics.length; i++) {
            if (positoinTime > this.lyrics[i].startTime && positoinTime < this.lyrics[i].endTime) {
                // 画面表示用設定
                var currentText = this.lyrics[i].text;
                //this.phraseEl.textContent = currentText;
                //this.updateLyricData(this.lyrics[i]);
                console.log("lyrics point x : "+this.lyrics[i].x+ "  y : "+this.lyrics[i].y);

                return currentText;
            }
        }

        // 見つからない場合は空文字
        return "";
    }

    public getPositionTime() : Number{
        return this.positionTime;
    }
}