export default class StrandsHelper {// extends Phaser.Scene {
    constructor(words, spanagram) {
      //  super('WordleHelper');
        this.words = words;
        this.spanagram = spanagram;
        this.outcome = "playing";
        this.init();
    }
}