export default class MusicList {
  musicInfoList = [];

  constructor() {
    this.musicInfoList[0] = [
      '嘘も本当も君だから',
      '真島ゆろ',
      'https://www.youtube.com/watch?v=Se89rQPp5tk',
    ];
    this.musicInfoList[1] = [
      '夏をなぞって',
      'シロクマ消しゴム',
      'https://www.youtube.com/watch?v=3wbZUkPxHEg',
    ];
    this.musicInfoList[2] = [
      'その心に灯る色は',
      'ラテルネ',
      'https://www.youtube.com/watch?v=bMtYf3R0zhY',
    ];
    this.musicInfoList[3] = [
      '密かなる交信曲',
      '濁茶',
      'https://www.youtube.com/watch?v=Ch4RQPG1Tmo',
    ];
    this.musicInfoList[4] = [
      'Freedom!',
      'Chiquewa',
      'https://www.youtube.com/watch?v=pAaD4Hta0ns',
    ];
    this.musicInfoList[5] = ['First Note', 'blues', 'https://piapro.jp/t/FDb1'];
  }

  getMusicInfoList() {
    return this.musicInfoList;
  }
}
