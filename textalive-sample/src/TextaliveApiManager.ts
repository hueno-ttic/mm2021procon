import Lyric from './Lyric';
import CharText from './CharText';

import { Ease, Player, IVideo, NullGraphicsDriver } from 'textalive-app-api';

export default class TextaliveApiManager {
  private musicUrl: string;

  private player: Player;

  private lyrics: Lyric[] = [];
  private charText: CharText[] = [];

  private positionTime: Number;

  playBtn;
  jumpBtn;
  pauseBtn;
  rewindBtn;
  positionEl;

  artistSpan;
  songSpan;
  beatbarEl;

  private isChorus: Boolean;

  progressBase;
  progressSeek;
  progressBar;
  isProgressSeeking;

  constructor(url: string) {
    this.musicUrl = url;
    this.playBtn = document.querySelector<HTMLElement>('#play');
    this.jumpBtn = document.querySelector<HTMLElement>('#jump');
    this.pauseBtn = document.querySelector<HTMLElement>('#pause');
    this.rewindBtn = document.querySelector<HTMLElement>('#rewind');
    this.positionEl = document.querySelector<HTMLElement>('#position strong');
    this.beatbarEl = document.querySelector<HTMLElement>('#beatbar');

    // シークバー
    this.progressBase = document.querySelector('#progressBase');
    this.progressSeek = document.querySelector('#progressSeek');
    this.progressBar = document.querySelector('#progressBar');
    this.isProgressSeeking = true;
  }

  init(): void {
    this.player = new Player({
      app: {
        appAuthor: 'TTIC',
        appName: 'TextAliveSample',
        token: 'GYtUEuVODFiceV7w',
      },
      mediaElement: document.querySelector<HTMLElement>('#media'),
      valenceArousalEnabled : true, // 覚醒度と感情価の取得
      vocalAmplitudeEnabled : true // 声量情報の取得
    });

    // バッググラウンドで実行する機能をListenerに登録
    this.player.addListener({
      onAppReady:app => this.onAppReady(app),
      onTimerReady: () => this.onTimerReady(),
      onTimeUpdate:pos => this.onTimeUpdate(pos),
      onVideoReady:v => this.onVideoReady(v),
    });
    console.log(this.player);
  }

  // APIへのアクセス準備
  private onAppReady(app): void {
    console.log('onAppReady');

    if (!app.managed) {
      document.querySelector<HTMLElement>('#control').style.display = 'block';
      this.playBtn.addEventListener(
        'click',
        () => this.player.video && this.player.requestPlay()
      );
      this.jumpBtn.addEventListener(
        'click',
        () =>
          this.player.video &&
          this.player.requestMediaSeek(this.player.video.firstPhrase.startTime)
      );
      this.pauseBtn.addEventListener(
        'click',
        () => this.player.video && this.player.requestPause()
      );
      this.rewindBtn.addEventListener(
        'click',
        () => this.player.video && this.player.requestMediaSeek(0)
      );
    }
    if (!app.songUrl) {
      // 再生対象となる楽曲URLをセット
      this.player.createFromSongUrl(this.musicUrl);
    }
  }

  // APIアクセス時に最初に呼ばれて動画情報をすべてとってきて設定する
  onVideoReady(v): void {
    let lyricIndex = 0;
    // 歌詞のセットアップ
    // 歌詞一文字ごと
    if (v.firstChar) {
      let c = v.firstChar;
      while (c) {
        this.charText.push(new CharText(c, lyricIndex));
        c = c.next;
        lyricIndex++;
      }
    }
    // 歌詞の区切りごと
    let w = this.player.video.firstWord;
    let wordIndex = 0;
    while (w) {
      // 歌詞の色変え
      const num = Math.floor(Math.random() * 3);
      let color;
      switch (num) {
        case 0:
          color = 'red';
          break;
        case 1:
          color = 'green';
          break;
        case 2:
          color = 'yellow';
          break;
        default:
          color = 'blue';
          break;
      }

      if (this.getIsChorus()) {
        color = 'blue';
      }

      // 歌詞ごとの覚醒度と感情価を設定
      var valenceArousal = this.player.getValenceArousal(w.startTime);
      // 単語情報を格納
      this.lyrics.push(new Lyric(w, wordIndex, color, valenceArousal));
      // 次の単語へ
      w = w.next;
      wordIndex++;
    }
  }

  // APIアクセス後に動画情報設定
  onTimerReady(): void {
    // シークバー
    this.setProgressChorus();

    console.log('onTimerReady');

    // 楽曲情報

    // 動画が読み込めたのでボタンを表示
    document
      .querySelectorAll('button')
      .forEach(btn => (btn.disabled = false));
  }

  // 再生中に呼び出され続けて画面の状態をupdateする
  onTimeUpdate(position): void {
    if (!this.isProgressSeeking) {
      this.setProgress(position / this.player.video.duration);
    }

    // 現在再生されている時のBeat情報を取得
    const beat = this.player.findBeat(position);
    if (!beat) {
      return;
    }
    this.beatbarEl.style.width = `${Math.ceil(
      Ease.circIn(beat.progress(position)) * 100
    )}%`;

    // サビかどうかを取得(サビならtrue)
    // console.log(this.player.findBeat(position));
    this.isChorus = this.player.findChorus(position) != null;

    this.positionTime = position;
  }

  getLyrics() {
    return this.lyrics;
  }

  getCurrentLyric2(positoinTime: number): Lyric {
    console.log(this.lyrics);

    // 見つからない場合は空文字
    return null;
  }

  getCurrentLyric(positoinTime: number): Lyric {
    // console.log(this.lyrics);
    for (let i = 0; i < this.lyrics.length; i++) {
      if (
        positoinTime > this.lyrics[i].startTime &&
        positoinTime < this.lyrics[i].endTime
      ) {
        return this.lyrics[i];
      }
    }

    // 見つからない場合は空文字
    return null;
  }

  getCurrentLyricText(positoinTime: number): string {
    for (let i = 0; i < this.lyrics.length; i++) {
      if (
        positoinTime > this.lyrics[i].startTime &&
        positoinTime < this.lyrics[i].endTime
      ) {
        // 画面表示用設定
        const currentText = this.lyrics[i].text;
        return currentText;
      }
    }

    // 見つからない場合は空文字
    return '';
  }

  getCurrentLyricIndex(positoinTime: number): number {
    for (let i = 0; i < this.lyrics.length; i++) {
      if (
        positoinTime > this.lyrics[i].startTime &&
        positoinTime < this.lyrics[i].endTime
      ) {
        // 画面表示用設定
        const currentIndex = this.lyrics[i].index;
        return currentIndex;
      }
    }

    // 見つからない場合は空文字
    return null;
  }

  getPositionTime(): Number {
    return this.positionTime;
  }

  getLyricsLength(): Number {
    return this.lyrics.length;
  }

  getMusicLength(): Number {
    return 0;
  }

  // public isVideoSeeking() : Boolean {
  //     return this.player.isVideoSeeking();
  // }

  /**
   * 楽曲ががしていたポジションならTrueを返す
   */
  getIsChorus(): Boolean {
    return this.isChorus;
  }

  setProgress(val) {
    this.progressBar.style.width = `${val * 100}%`;
  }

  setProgressChorus() {
    if (this.player.video) {
      const choruses = this.player.getChoruses();
      for (let i = choruses.length - 1; i >= 0; i--) {
        const chorusNode = document.createElement('div');
        chorusNode.className = 'progressChorus';
        chorusNode.style.left = `${
          (choruses[i].startTime / this.player.video.duration) * 100
        }%`;
        chorusNode.style.width = `${
          (choruses[i].duration / this.player.video.duration) * 100
        }%`;
        this.progressBase.insertBefore(
          chorusNode,
          this.progressBase.firstChild
        );
      }
    }
  }
}
