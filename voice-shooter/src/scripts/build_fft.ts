import { POINT_SIZE } from "../scenes/audioVisualizer/app/constants/constants";
import * as fs from "fs";
import BuildFftRepository from "../scenes/audioVisualizer/infrastructure/repository/BuildFftRepository";

const ROOT_PATH = "src/assets/fft/";
const READ_PATH = ROOT_PATH + "raw/";
const WRITE_PATH = ROOT_PATH + "build/";

const repository = new BuildFftRepository(POINT_SIZE);

fs.readdirSync(READ_PATH).map((file) => {
    const path = READ_PATH + file;
    const gains = JSON.parse(fs.readFileSync(path).toString()) as number[][];
    const converted = repository.convertFftData(gains);
    const writePath = WRITE_PATH + file;

    fs.writeFileSync(writePath, JSON.stringify(converted));
});
