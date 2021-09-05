export default class MusicList {
    
    public musicInfoList = [];

    constructor () {
        this.musicInfoList[0]= ["嘘も本当も君だから","真島ゆろ","https://youtu.be/Se89rQPp5tk"];
        this.musicInfoList[1]= ["夏をなぞって","シロクマ消しゴム","https://youtu.be/3wbZUkPxHEg"];
        this.musicInfoList[2]= ["その心に灯る色は","ラテルネ","https://youtu.be/bMtYf3R0zhY"];
        this.musicInfoList[3]= ["密かなる交信曲","濁茶","https://youtu.be/Ch4RQPG1Tmo"];
        this.musicInfoList[4]= ["Freedom!","Chiquewa","https://youtu.be/pAaD4Hta0ns"];
        this.musicInfoList[5]= ["First Note","blues","https://piapro.jp/t/FDb1"];
    }

    public getMusicInfoList() {
        return this.musicInfoList;
    }
}
