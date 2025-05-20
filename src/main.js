import { Start } from './scenes/Start.js';
import { Connections } from './scenes/connections.js';
import { Wordle } from './scenes/wordle.js';
import { Strands } from './scenes/strands.js';
import { MiniCrossword } from './scenes/minicrossword.js';

const config = {
    type: Phaser.AUTO,//tried WebGL first, then Canvas if not available
    title: 'NYT Gamez',
    parent: 'game-container',
    width: 900,//500,
    height: 1600,//800,
    pixelArt: false,
    scene: [
        Start,
        Connections,
        Wordle,
        Strands,
        MiniCrossword
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}
new Phaser.Game(config);
            