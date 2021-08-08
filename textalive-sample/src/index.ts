import TextaliveApiManager from "./TextaliveApiManager"

/**
 * sample用のプログラム
 */
class Main {
    public api;

    public run() {
        this.api = new TextaliveApiManager();
        console.log("init main");
        this.api.init();
    }
}

const main = new Main();

main.run();