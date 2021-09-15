import Lyric from './Lyric';
import CharText from './CharText';

import { Ease, Player, IVideo, NullGraphicsDriver, PlayerEventListener} from 'textalive-app-api';

export default class TextaliveApiManager {
  private musicUrl: string;

  public player: Player;
  public playerEventListener: PlayerEventListener;

  private lyrics: Lyric[] = [];
  private charText: CharText[] = [];

  private positionTime: number;

  videoEnd: Boolean = false;

  private isChorus: Boolean;

  constructor(url: string) {
    this.musicUrl = url;
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
      onThrottledTimeUpdate:pos => this.onThrottledTimeUpdate(pos)
    });
    console.log(this.player);
  }

  // APIへのアクセス準備
  private onAppReady(app): void {
    console.log('onAppReady');

    if (!app.songUrl) {
      // 再生対象となる楽曲URLをセット
      this.player.createFromSongUrl(this.musicUrl);
    }
  }

  // 動画の再生位置が変更されたときに呼ばれる
  onThrottledTimeUpdate(position) {
    this.positionTime = position;
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
    console.log('onTimerReady');
  }

  // 再生中に呼び出され続けて画面の状態をupdateする
  onTimeUpdate(position): void {
    // 現在再生されている時のBeat情報を取得
    const beat = this.player.findBeat(position);
    if (!beat) {
      return;
    }

    // サビかどうかを取得(サビならtrue)
    // console.log(this.player.findBeat(position));
    this.isChorus = this.player.findChorus(position) != null;

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

  getPositionTime(): number {
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

}
