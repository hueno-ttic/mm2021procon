/**
 * sample用のプログラム
 */
import { Ease, Player, IVideo } from "textalive-app-api";

const player = new Player({
    app: {
        appAuthor: "TTIC",
        appName: "TextAliveSample",
        
    },
   mediaElement: document.querySelector<HTMLElement>("#media")
});

player.addListener({
    onAppReady,
    onTimerReady,
    onTimeUpdate,
    onThrottledTimeUpdate
});

const playBtn = document.querySelector<HTMLElement>("#play");
const jumpBtn = document.querySelector<HTMLElement>("#jump");
const pauseBtn = document.querySelector<HTMLElement>("#pause");
const rewindBtn = document.querySelector<HTMLElement>("#rewind");
const positionEl = document.querySelector<HTMLElement>("#position strong");

const artistSpan = document.querySelector<HTMLElement>("#artist span");
const songSpan = document.querySelector<HTMLElement>("#song span");
const phraseEl = document.querySelector<HTMLElement>("#container p");
const beatbarEl = document.querySelector<HTMLElement>("#beatbar");

function onAppReady(app) {

    console.log(app);
    if (!app.managed) {
        document.querySelector<HTMLElement>("#control").style.display = "block";
        playBtn.addEventListener("click", () => player.video && player.requestPlay());
        jumpBtn.addEventListener("click", () => player.video && player.requestMediaSeek(player.video.firstPhrase.startTime));
        pauseBtn.addEventListener("click", () => player.video && player.requestPause());
        rewindBtn.addEventListener("click", () => player.video && player.requestMediaSeek(0));
    }
    if (!app.songUrl) {
        player.createFromSongUrl("http://www.youtube.com/watch?v=ygY2qObZv24");
    }

    console.log(app);
 }

function onTimerReady() {
    artistSpan.textContent = player.data.song.artist.name;
    songSpan.textContent = player.data.song.name;

    document
        .querySelectorAll("button")
        .forEach((btn) => (btn.disabled = false));

    let p = player.video.firstPhrase;
    jumpBtn['disabled'] = !p;

    // set `animate` method
    while (p && p.next) {
        p.animate = animatePhrase;
        p = p.next;
    }
}

function onTimeUpdate(position) {

    // show beatbar
    const beat = player.findBeat(position);
    if (!beat) {
        return;
    }
    beatbarEl.style.width = `${Math.ceil(Ease.circIn(beat.progress(position)) * 100)}%`;
}

function onThrottledTimeUpdate(position) {
    positionEl.textContent = String(Math.floor(position));
}

function animatePhrase(now, unit) {

    // show current phrase
    if (unit.contains(now)) {
        phraseEl.textContent = unit.text;
    }
};