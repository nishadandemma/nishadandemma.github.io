// "Every great game begins with a single scene. Let's make this one unforgettable!"
import { LETTERS_SAT } from "./strands/letters.js";
import { LETTERS_SUN } from "./strands/letters.js";
import { PLACE } from "./strands/letters.js";
import Tile from "./strands/tiles.js";
import Connector from "./strands/connector.js";
//import StrandsHelper from "./strands/strandsHelper.js";

let LETTERS = [];
let words = [];
let spanagram = ""
let themeWord = ""


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
        this.loadLetters();
        this.createBoard();
        this.guess = [];
        this.currentConnectors = [];
        this.connectors = [];
        this.wordGuess = "";
        this.addButtons();
        //this.strands = new StrandsHelper(words, spanagram);
        this.lastTile = null;
        this.addResult();
        this.correct = 0;
        this.leftToGuess = ["aaaaaaa", "bbbbb", "ccccccc", "dddd", "eeeeeee", "ffffff", "gggg"];
        this.leftToGuess.push(spanagram);
        this.addUpdateText();
        this.addTheme();
        //console.log(this.isReal("real"));
    }

    addTheme () {
        this.theme = this.add.sprite(this.center_width, 275, "theme").setOrigin(0.5);
        this.today = this.add.bitmapText(this.center_width, 300, "lemonmilk", themeWord, 45).setOrigin(0.5).setTint(0xff0000)
    }

    loadLetters () {
        const today = new Date();
        const day = today.getDate();
        if (day % 2 == 0) {
            LETTERS = LETTERS_SAT;
            words = ["aaaaaaa", "bbbbb", "ccccccc", "dddd", "eeeeeee", "ffffff", "gggg"];
            spanagram = "xxxxxxxx"
            themeWord = "Letters..."
        }
        else if (day % 2 !== 0) {
            LETTERS = LETTERS_SUN;
            words = ["aaaaaaa", "bbbbb", "ccccccc", "dddd", "eeeeeee", "ffffff", "gggg"];
            spanagram = "xxxxxxxx"
            themeWord = "Letters..."
        }
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

    addButtons() {
        this.hint = this.add.sprite(200, 1405, "ellipse").setOrigin(0.5).setDisplaySize(225, 75);
        this.hintButton = this.add
            .bitmapText(200, 1400, "lemonbold", "Hint", 36)
            .setOrigin(0.5)
            .setTint(0x050cf8 )
          //  .setDropShadow(2, 3, 0x693600, 0.7);
        this.hintButton.setInteractive();
        this.hintButton.on("pointerdown", () => {
            this.getHint(); 
        });
    }

    createBoard() {
      this.tiles = [];
      //let boxY = 0;
      //let boxX = 56;
      let x = this.center_width - (90*2.5 + 30* 2.5);
      let y = 450;
      let ind = 0
      //this.add.rectangle(250, 740, 500, 200, 0x4d4d4d).setOrigin(0.5);
      for (let i = 0; i < LETTERS.length; i++) {
        this.tiles.push([]);
        for (let j = 0; j < LETTERS[0].length; j++) {
            let letter = LETTERS[i][j];
            const tile = new Tile(this, x, y, letter);
            this.tiles[i].push(tile);
            x+=90+30
        }
        x = this.center_width - (90*2.5 + 30* 2.5)
        y += 90+30
      }
    }

    addTitle() {
      this.add.bitmapText(this.center_width, 100, "nougat", "STRANDS", 100).setOrigin(0.5);//.setDropShadow(3, 4, 0x222222, 0.7);
    }

    addGuess(letter) {
        if (this.lastTile !== null) {
            let c = new Connector(this, this.lastTile, letter);
            this.currentConnectors.push(c);
        }
        this.guess.push(letter);
    }


    removeGuess() {
        this.guess.splice(-1, 1);
        let ind = this.currentConnectors.length - 1
        this.currentConnectors[ind].getRid();
        this.currentConnectors.splice(-1, 1);
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
                this.guess[i].setColor(0xebb24d);
                if (this.guess[i].hintStatus = "ON") {this.guess[i].endHint()};
                if (i < this.currentConnectors.length) {this.currentConnectors[i].setColor(0xebb24d) }

            }
            this.connectors.push(this.currentConnectors);
            this.correct += 1;
            this.updateUpdateText();
            this.leftToGuess.splice(-1,1);
        }
        else if (words.includes(this.wordGuess)) {
            for (let i = 0; i < this.guess.length; i++) {
                this.guess[i].setColor(0xd18d88)
                if (this.guess[i].hintStatus = "ON") {this.guess[i].endHint()};
                if (i < this.currentConnectors.length) {this.currentConnectors[i].setColor(0xd18d88) }
            }
            this.connectors.push(this.currentConnectors);
            this.correct += 1;
            this.updateUpdateText();
            let currentWord = this.leftToGuess.indexOf(this.wordGuess);
            this.leftToGuess.splice(currentWord, 1);
        }
        else {
            for (let i = 0; i < this.guess.length; i++) {
                this.guess[i].setColor(0xf5ecdc)
                if (i < this.currentConnectors.length) {this.currentConnectors[i].getRid() }
            }
        }
        this.cleanUp();
    }

    cleanUp() {
        if (this.correct === 8) {
            this.enabled = false;
            this.showResult();
        }
        this.guess = [];
        this.wordGuess = "";
        this.lastTile = null;
        this.currentConnectors = [];
    }

    addResult () {
      this.resultText = this.add.bitmapText(this.center_width, 580, "lemonmilk", "", 40).setTint(0x000000).setOrigin(0.5)
    }

    showResult (points = 0) {
      this.resultText.setText("WIN").setAlpha(1).setTint(0xffffff).setScale(2).setDropShadow(3, 4, 0x222222, 0.7);
      this.resultText.setDepth(100);
      this.tweens.add({
        targets: this.resultText,
        scale: { from : 2, to: 3},
        repeat: -1,
        duration: 500,
        yoyo: true
      })
    }

    getHint() {
      console.log(words)
      if (this.leftToGuess.length !== 0) {
        let hint = this.leftToGuess[0];
        let indexHint = words.indexOf(hint);
        console.log(hint)
        console.log(indexHint)
        for (let i = 0; i < LETTERS.length; i++) {
            for (let j = 0; j < LETTERS[0].length; j++) {
                if (PLACE[i][j] === indexHint) {
                    this.tiles[i][j].showHint();
                }
            }
        } 
      } else return

    }

    addUpdateText() {
      this.updateText = this.add.bitmapText(600, 1405, "lemonbold", this.correct + " of 8 theme words found", 25).setTint(0x000000).setOrigin(0.5)
    }

    updateUpdateText() {
        this.updateText.setText(this.correct + " of 8 theme words found")
    }

    // isReal(word) {
    //     const response = fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+ word);
    //     return response.ok;
    // }
} 