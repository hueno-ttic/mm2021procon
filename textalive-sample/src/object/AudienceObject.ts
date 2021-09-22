import GameMain from "../scenes/GameMain";
import image from "../assets/audience/*.png";
import DepthDefine from "../object/DepthDefine";

const AUDIENCE_SET_SIZE_X = 25;
const AUDIENCE_SET_SIZE_Y = 5;

export default class AudienceObject {
    private gameMain;
    private firstLane;
    private secondLane;
    private thirdLane;
    private firstLaneCounter;
    private secondLaneCounter;
    private thirdLaneCounter;

    constructor(gameMain: GameMain) {
        this.gameMain = gameMain;

        this.firstLane = Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => {
            return Array.from(new Array(AUDIENCE_SET_SIZE_Y), () =>
                new Array(AUDIENCE_SET_SIZE_X).fill(null)
            );
        });
        this.secondLane = Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => {
            return Array.from(new Array(AUDIENCE_SET_SIZE_Y), () =>
                new Array(AUDIENCE_SET_SIZE_X).fill(null)
            );
        });
        this.thirdLane = Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => {
            return Array.from(new Array(AUDIENCE_SET_SIZE_Y), () =>
                new Array(AUDIENCE_SET_SIZE_X).fill(null)
            );
        });
        this.firstLaneCounter = 0;
        this.secondLaneCounter = 0;
        this.thirdLaneCounter = 0;
    }
    preload() {
        this.gameMain.load.image("audience_a", image["audience_a"]);
        this.gameMain.load.image("audience_b", image["audience_b"]);
        this.gameMain.load.image("audience_c", image["audience_c"]);
        this.gameMain.load.image("audience_d", image["audience_d"]);
    }

    create() {
        this.addAudience(this.firstLane, 1000, 70);
        this.addAudience(this.secondLane, 1000, 270);
        this.addAudience(this.thirdLane, 1000, 470);
    }

    addAudience(laneAudience, baseX, baseY) {
        let diffY = 25;
        let diffX = 30;
        for (let i = 0; i < AUDIENCE_SET_SIZE_Y; i++) {
            for (let j = 0; j < AUDIENCE_SET_SIZE_X; j++) {
                let audience = this.getAudienceType();
                laneAudience[i][j] = this.gameMain.add
                    .image(baseX - j * diffX, baseY + i * diffY, audience)
                    .setDepth(DepthDefine.OBJECT + i);
                laneAudience[i][j].scale *= 0.03;
                laneAudience[i][j].alpha = 0.0;
            }
        }
    }

    getAudienceType(): string {
        let audience;
        const num = Math.floor(Math.random() * 3);
        switch (num) {
            case 0:
                audience = "audience_a";
                break;
            case 1:
                audience = "audience_b";
                break;
            case 2:
                audience = "audience_c";
                break;
            case 3:
                audience = "audience_d";
                break;
        }
        return audience;
    }

    update(lane: string) {
        let maxAudience = AUDIENCE_SET_SIZE_X * AUDIENCE_SET_SIZE_Y;
        if (lane === "first" && this.firstLaneCounter < maxAudience) {
            this.updateAudience(this.firstLane, this.firstLaneCounter);
            this.firstLaneCounter++;
        } else if (lane === "second" && this.secondLaneCounter < maxAudience) {
            this.updateAudience(this.secondLane, this.secondLaneCounter);
            this.secondLaneCounter++;
        } else if (lane === "third" && this.thirdLaneCounter < maxAudience) {
            this.updateAudience(this.thirdLane, this.thirdLaneCounter);
            this.thirdLaneCounter++;
        }
    }

    updateAudience(laneAudience, counter) {
        let numX = Math.floor(Math.random() * AUDIENCE_SET_SIZE_X);
        let numY = Math.floor(Math.random() * AUDIENCE_SET_SIZE_Y);
        if (laneAudience[numY][numX].alpha === 0) {
            laneAudience[numY][numX].alpha = 0.5;
            return;
        } else {
            for (let i = -1; i < 1; i++) {
                for (let j = -1; j < 1; j++) {
                    if (numY+i > 0 && numY+i < AUDIENCE_SET_SIZE_Y && numX+i > 0 && numX+i < AUDIENCE_SET_SIZE_X) {
                        if (laneAudience[numY][numX].alpha === 0) {
                            laneAudience[numY][numX].alpha = 0.5;
                            return;
                        }
                    }
                }
            }
            this.updateAudience(laneAudience, counter);                 
        }
    }
}
