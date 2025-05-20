// "Every great game begins with a single scene. Let's make this one unforgettable!"
import { LETTERS } from "./strands/letters.js";
import Tile from "./strands/tiles.js";
//import StrandsHelper from "./strands/strandsHelper.js";

const words = ["aaaaaaa", "bbbbb", "ccccccc", "dddd", "eeeeeee", "ffffff", "gggg"];
const spanagram = "xxxxxxxx"

export class Strands extends Phaser.Scene {
    constructor() {
        super('Strands');
    }

    init(data) {
        this.name = data.name;
        this.number = data.number;
    }

    preload() {
        this.load.image('background', 'assets/background9x16.png');
    }

    create() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.enabled = true;
        this.background = this.add.tileSprite(this.center_width, this.center_height, 900, 1600, 'background');
        this.addMenuButton();
        this.addTitle();
        this.createBoard();
        this.guess = [];
        this.wordGuess = "";
        //this.strands = new StrandsHelper(words, spanagram);
        this.lastTile = null;
    }

    addMenuButton() {
        this.menuButton = this.add
            .bitmapText(75, 25, "nougat", "<Menu", 45)
            .setOrigin(0.5)
            .setTint(0xff0000)
          //  .setDropShadow(2, 3, 0x693600, 0.7);
        this.menuButton.setInteractive();
        this.menuButton.on("pointerdown", () => {
            //this.sound.add("move").play(); //maybe add sound effects when clicked?
            this.scene.start("Start")
        });
        this.menuButton.on("pointerover", () => {
            this.menuButton.setTint(0x3e6875);
        });
        this.menuButton.on("pointerout", () => {
            this.menuButton.setTint(0xff0000);
        });

    }

    createBoard() {
      this.tiles = [];
      //let boxY = 0;
      //let boxX = 56;
      let x = this.center_width - (60*4);
      let y = 150;
      let ind = 0
      //this.add.rectangle(250, 740, 500, 200, 0x4d4d4d).setOrigin(0.5);
      for (let i = 0; i < LETTERS.length; i++) {
        this.tiles.push([]);
        for (let j = 0; j < LETTERS[0].length; j++) {
            let letter = LETTERS[i][j];
            const tile = new Tile(this, x, y, letter);
            this.tiles[i].push(tile);
            x+=60+10
        }
        x = this.center_width - (60*4)
        y += 60+10
      }
    }

    addTitle() {
      this.add.bitmapText(this.center_width, 100, "nougat", "STRANDS", 100).setOrigin(0.5);//.setDropShadow(3, 4, 0x222222, 0.7);
    }

    addGuess(letter) {
        this.guess.push(letter);
    }

    removeGuess() {
        this.guess.splice(-1, 1);
    }

    getGuess() {
        return this.guess;
    }

    guessIt() {
        for (let i = 0; i < this.guess.length; i++) {
            this.wordGuess = this.wordGuess + this.guess[i].letter
        }
        if (spanagram === this.wordGuess) {
            for (let i = 0; i < this.guess.length; i++) {
                this.guess[i].setColor(0xe69407)
            }
        }
        else if (words.includes(this.wordGuess)) {
            for (let i = 0; i < this.guess.length; i++) {
                this.guess[i].setColor(0xf3f925)
            }
        }
        else {
            for (let i = 0; i < this.guess.length; i++) {
                this.guess[i].setColor(0xa5ed1f)
            }
        }
        this.cleanUp();
    }

    cleanUp() {
        this.guess = [];
        this.wordGuess = "";
        this.lastTile = null;
    }
}
