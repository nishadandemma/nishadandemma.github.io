import { BOARD } from "./minicrossword/board.js";
import Box from "./minicrossword/box.js";
import Key from "./minicrossword/keys.js";
//import MiniHelper from "./minicrossword/minicrosswordsHelper.js";

export class MiniCrossword extends Phaser.Scene {
    constructor() {
        super('MiniCrossword');
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
        this.addKeyboard();
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

    addTitle() {
      this.add.bitmapText(this.center_width, 100, "nougat", "MINICROSSWORD", 100).setOrigin(0.5);//.setDropShadow(3, 4, 0x222222, 0.7);
    }

    createBoard() {
      this.squares = [];
      //let boxY = 0;
      //let boxX = 56;
      let x = this.center_width - (60*3.5);
      let y = 150;
      //this.backboard = new Phaser.GameObjects.Rectangle(this, 35, 145, 350, 350, 0x000000).setOrigin(0.5);
      //this.add(this.backboard);
      this.add.rectangle(this.center_width, 300, 370, 370, 0x000000).setOrigin(0.5);
      for (let i = 0; i < BOARD.length; i++) {
        this.squares.push([]);
        for (let j = 0; j < BOARD[0].length; j++) {
            let letter = BOARD[i][j];
            const box = new Box(this, x, y, letter);
            this.squares[i].push(box);
            x+=60+10
        }
        x = this.center_width - (60*3.5)
        y += 60+10
      }
    }

    addKeyboard () {
      const alphabet = "qwertyuiop-asdfghjkl-zxcvbnm";
      this.keyboard = {};
      let stepY = 0;
      let stepX = 0;// -32;
      let x = 0;//-32;
      let y = 0;
      let level = 1;
      //this.add.rectangle(250, 740, 500, 200, 0x4d4d4d).setOrigin(0.5);
      alphabet.split("").forEach((letter, i) => {
        const isDash = letter === "-";
        //x = stepX ;
        switch (level) {
          case 1:
            x = stepX;
            break;
          case 2:
            x = stepX + 43;
            break;
          case 3:
            x = stepX + 129;
            break;
        }
        stepY += isDash ? 86 : 0//48 : 0 
        stepX = isDash ? 0 : stepX + 86//48;
        y = 640 + stepY;

        if (isDash) {
          level = level + 1;
          return;
        }
        const key = new Key(this, x, y, letter)
        this.keyboard[letter] = key;
      })

      //this.helpText = this.add.bitmapText(this.center_width, 630, "mario", "", 30).setTint(0x4d4d4d).setOrigin(0.5)
    }


}