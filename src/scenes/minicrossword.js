import { BOARD_SAT } from "./minicrossword/board.js";
import { NUM_SAT } from "./minicrossword/board.js";
import { ACROSS_SAT } from "./minicrossword/board.js";
import { DOWN_SAT } from "./minicrossword/board.js";
import { BOARD_SUN } from "./minicrossword/board.js";
import { NUM_SUN } from "./minicrossword/board.js";
import { ACROSS_SUN } from "./minicrossword/board.js";
import { DOWN_SUN } from "./minicrossword/board.js";
import Box from "./minicrossword/box.js";
import Key from "./minicrossword/keys.js";
//import MiniHelper from "./minicrossword/minicrosswordsHelper.js";

let BOARD = [];
let NUM = [];
let ACROSS = [];
let DOWN = [];

let clues = {};
const today = new Date();
const day = today.getDate();

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
        this.loadBoards();
        this.addClues();
        this.createBoard();
        this.getPopUp();
        this.guessLine = "";
        this.numOfBoxes = (day % 2 == 1) ? 36 : 23;
        this.addKeyboard();
        this.rowMax = this.guess.length;
        this.colMax = this.guess[0].length;
        this.selectedColor = 0xfae05a;
        this.restColor = 0xa1c9b8;
        this.regColor = 0xffffff;
        this.setUp("Across");
        this.word = 1;
        this.acrossClues = (day % 2 == 1) ? 8 : 5;
        this.downClues = (day % 2 == 1) ? 7 : 5;
        this.addResult();
    }

    getPopUp () {
      this.under = this.add.rectangle(this.center_width, 700, 450, 200, 0x97ba97, 0.0).setOrigin(0.5).setDepth(100);
      this.popUp1 = this.add.bitmapText(this.center_width, 650, "lemonbold", "Almost!", 40).setTint(0x000000).setOrigin(0.5).setAlpha(0.0)//.setDepth(200);
      this.popUp2 = this.add.bitmapText(this.center_width, 700, "lemonmilk", "At least one square is off...", 20).setTint(0x000000).setOrigin(0.5).setAlpha(0.0)//.setDepth(200);
      this.button = this.add.sprite(this.center_width, 760, "ellipse").setOrigin(0.5).setDisplaySize(150, 50).setAlpha(0.0);
      this.tryAgain = this.add.bitmapText(this.center_width, 756, "lemonbold", "Try again", 20).setTint(0x000000).setOrigin(0.5).setAlpha(0.0)
      this.button.setInteractive();
      this.menuButton.on("pointerdown", () => {
          //this.sound.add("move").play(); //maybe add sound effects when clicked?
          this.setPopUp(0.0);
      });
    }

    loadBoards () {
      if (day % 2 == 0) {
        BOARD = BOARD_SAT;
        NUM = NUM_SAT;
        ACROSS = ACROSS_SAT;
        DOWN = DOWN_SAT;
        clues = {
        "1 Across": "Sounds from a flock",
        "5 Across": "Dye used for hair or mehndi",
        "6 Across": "Divine counterparts to the AEsir in Norse Mythology",
        "7 Across": "Finland in Finland",
        "8 Across": "Irritation in the eye",
        "1 Down": "A sight to see (for short)",
        "2 Down": "Irritate",
        "3 Down": "Japanese cartoons",
        "4 Down": "Indian women's garment",
        "5 Down": "Horizontal volute suspension system"
        };
        this.guess = [["0","","","",""],
                      ["","","","",""],
                      ["","","","",""],
                      ["","","","",""],
                      ["","","","","0"]];
      }
      else if (day % 2 !== 0) {
        BOARD = BOARD_SUN;
        NUM = NUM_SUN;
        ACROSS = ACROSS_SUN;
        DOWN = DOWN_SUN;
        clues = {
        "1 Across": "Suffix in Marathi names denoting a place of origin",
        "4 Across": "Possibilities",
        "5 Across": "Sixty minutes",
        "6 Across": "Get back on the horse",
        "7 Across": "Krishna's grand city in Hindu mythology",
        "8 Across": "Workplace authority on a hard metal",
        "9 Across": "Neuromyelitis optica",
        "10 Across": "Letter without which it is slightly tricky to construct crossword clues",
        "1 Down": "Ted ____, DC's second Blue Beetle",
        "2 Down": "Something into which a witch might turn you",
        "3 Down": "Stay",
        "4 Down": "What you might text someone you feel an obligation to meet (in short)",
        "5 Down": "Author Cornelia or analytical therapist/actor Tobias",
        "6 Down": "Young woman's title en Esp.",
        "7 Down": "Finnish word for the fireweed plant"
        };
        this.guess = [["","","","0","","",""],
                      ["","","","","","",""],
                      ["","","","","","",""],
                      ["","","","","","",""],
                      ["0","","","","","","0"],
                      ["0","0","","","","0","0"],
                      ["0","0","0","","0","0","0"]];
      }
    }

    setPopUp (alpha) {
      this.under.setAlpha(alpha);
      this.popUp1.setAlpha(alpha);
      this.popUp2.setAlpha(alpha);
      this.button.setAlpha(alpha);
      this.tryAgain.setAlpha(alpha);
    }

    getFirstRowInColumn (col) {
      for (let i = 0; i < BOARD.length; i++) {
        const row = BOARD[i];
        if (row[col] !== "0") {
          return i; // Return the row index of the first non-zero value
        }
      }
    }

    setNewSpace () {
      //let start = 0;
      if (this.direction === "Across") {
        if (this.column === this.colMax - 1 || this.squares[this.row][this.column + 1].letter === "0") {
            if (this.lastWord()) {this.setUp("Down")}
            else {this.newWord();}
        } else {
          this.column += 1;
          for (let i = 0; i < BOARD[this.row].length; i++) {
            if(this.squares[this.row][i].isPlayable()) {
              this.squares[this.row][i].setColor(this.restColor);
            }
          }
        }  
      } else if (this.direction === "Down") {
          if (this.row === this.rowMax - 1 || this.squares[this.row + 1][this.column].letter === "0") {
              if (this.lastWord()) {this.setUp("Across")}
              else {this.newWord();}
          } else {
            this.row += 1;
            for (let i = 0; i < BOARD.length; i++) {
              if(this.squares[i][this.column].isPlayable()) {
                this.squares[i][this.column].setColor(this.restColor);
              }
            }
          }
      }
      this.squares[this.row][this.column].setColor(this.selectedColor)
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
      let box_size = (day % 2 == 1) ? 90 : 120;
      let x =  (day % 2 == 1) ? this.center_width -(box_size*3.33) : this.center_width - (box_size*2.16);
      let y = (day % 2 == 1) ? 230 : 300;
      //this.backboard = new Phaser.GameObjects.Rectangle(this, 35, 145, 350, 350, 0x000000).setOrigin(0.5);
      //this.add(this.backboard);
      let backboardsize = (box_size*BOARD[0].length) + (10*(BOARD[0].length-1)) + 30
      let backboardheight = (day % 2 == 1) ? 530 : 560;
      this.add.rectangle(this.center_width, backboardheight, backboardsize, backboardsize, 0x000000);
      for (let i = 0; i < BOARD.length; i++) {
        this.squares.push([]);
        for (let j = 0; j < BOARD[0].length; j++) {
            let letter = BOARD[i][j];
            let num = NUM[i][j];
            const box = new Box(this, x, y, letter, num, i, j);
            this.squares[i].push(box);
            x+=box_size+10
        }
        x = (day % 2 == 1) ? this.center_width -(box_size*3.33) : this.center_width - (box_size*2.16)
        y += box_size+10
      }
    }

    addKeyboard () {
      const alphabet = "QWERTYUIOP-ASDFGHJKL-ZXCVBNM";
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
        stepY += isDash ? 142 : 0//48 : 0 
        stepX = isDash ? 0 : stepX + 86//48;
        y = 1150 + stepY;

        if (isDash) {
          level = level + 1;
          return;
        }
        const key = new Key(this, x, y, letter)
        this.keyboard[letter] = key;
      })
      this.keyboard["<<<"] = new Key(this, x + 107, y, "<<<");
      this.keyboard["<<<"].setTextSize(30);
      //this.helpText = this.add.bitmapText(this.center_width, 630, "mario", "", 30).setTint(0x4d4d4d).setOrigin(0.5)
    }

    clickedBox(box) {
      //let 
      if (this.row === box.row && this.column === box.col) {
        if (this.direction === "Across") {
          this.direction = "Down";
          //reset the row
          for (let i = 0; i < BOARD[0].length; i++) {
            if(this.squares[this.row][i].isPlayable() && (i !== this.column)) {
              this.squares[this.row][i].setColor(this.regColor);
            }
          }
          //set up the column      
          for (let i = 0; i < BOARD.length; i++) {
            if(this.squares[i][this.column].isPlayable() && (i !== this.row)) {
              this.squares[i][this.column].setColor(this.restColor);
            }
          }
        } else if (this.direction === "Down") {
          this.direction = "Across";
          //reset the row
          for (let i = 0; i < BOARD.length; i++) {
            if(this.squares[i][this.column].isPlayable() && (i !== this.row)) {
              this.squares[i][this.column].setColor(this.regColor);
            }
          }
          //set up the column      
          for (let i = 0; i < BOARD[0].length; i++) {
            if(this.squares[this.row][i].isPlayable() && (i !== this.column)) {
              this.squares[this.row][i].setColor(this.restColor);
            }
          }        
        }
      // } else if ((this.direction === "Across" && box.row === this.row) 
      //             || (this.direction === "Down" && box.col === this.column)) {
      //   this.row
      } else {
        this.row = box.row;
        this.column = box.col;

      //set up the colors

        if (this.direction === "Across") {
          for (let i = 0; i < BOARD.length; i++) {
            for (let j = 0; j < BOARD[0].length; j++) {
              if (this.squares[i][j].isPlayable()) {
                if (i === this.row && j === this.column) {
                  this.squares[i][j].setColor(this.selectedColor);
                } else if (i === this.row) {
                  this.squares[i][j].setColor(this.restColor);
                } else {this.squares[i][j].setColor(this.regColor);}
              }
            }
          }
          //this.squares[this.row][this.column].setColor(this.selectedColor)
        } else if (this.direction === "Down"){
          for (let i = 0; i < BOARD.length; i++) {
            for (let j = 0; j < BOARD[0].length; j++) {
              if (this.squares[i][j].isPlayable()) {
                if (i === this.row && j === this.column) {
                  this.squares[i][j].setColor(this.selectedColor);
                } else if (j === this.column) {
                  this.squares[i][j].setColor(this.restColor);
                } else {this.squares[i][j].setColor(this.regColor);}
              }
            }
          }        
        }
      }
      if (this.direction === "Across") {
        let col = BOARD[this.row].indexOf(BOARD[this.row].find(element => element !== "0"));
        this.word = ACROSS[this.row][col];
      } else if (this.direction === "Down") {
        let row = this.getFirstRowInColumn(this.column);
        this.word = DOWN[row][this.column];
      }
      this.showClue();
    }

    clickedLetter(letter) {
      const allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      if (allowed.indexOf(letter) >= 0 && this.enabled) {
        this.guess[this.row][this.column] = letter;
        this.guessLine += letter;
        this.squares[this.row][this.column].setLetter(letter);
        if (this.guessLine.length === this.numOfBoxes) {
          this.gameEnd();
        } else {
          this.setNewSpace();
        }
      } else if (letter === "<<<") {
        this.deleteOne();
      }
    }


  setUp(direction) {
    console.log("setup");
    this.word = 1;
    this.direction = direction;
    if (this.direction === "Across") {
      this.row = 0;
      this.column = BOARD[0].indexOf(BOARD[0].find(element => element !== "0"));
      for (let i = 0; i < BOARD.length; i++) {
        for (let j = 0; j < BOARD[0].length; j++) {
          if (this.squares[i][j].isPlayable()) {
            if (i === this.row && j === this.column) {
              this.squares[i][j].setColor(this.selectedColor);
            } else if (i === this.row) {
              this.squares[i][j].setColor(this.restColor);
            } else {this.squares[i][j].setColor(this.regColor);}
          }
        }
      }
      //this.squares[this.row][this.column].setColor(this.selectedColor)
    } else if (this.direction === "Down"){
      this.row = 0;
      this.column = BOARD[0].indexOf(BOARD[0].find(element => element !== "0"));
      for (let i = 0; i < BOARD.length; i++) {
        for (let j = 0; j < BOARD[0].length; j++) {
          if (this.squares[i][j].isPlayable()) {
            if (i === this.row && j === this.column) {
              this.squares[i][j].setColor(this.selectedColor);
            } else if (j === this.column) {
              this.squares[i][j].setColor(this.restColor);
            } else {
              this.squares[i][j].setColor(this.regColor);
            }
          } 
        }
      }        
    }
    this.showClue();
  }   

  newWord () {
    console.log("newword");
    //needs to know what word I'm on and what direction and then jump to start of new word
    let found = false;
    let board = this.direction === "Across" ? ACROSS : DOWN;
    for (let i = 0; i < BOARD.length; i++) {
      for (let j = 0; j < BOARD[0].length; j++) {
        if(this.squares[i][j].isPlayable()) {
          if (board[i][j] === this.word+1) {
            found = true;
            this.row = i;
            this.column = j;
            this.squares[i][j].setColor(this.selectedColor);
          } else if (found && ((this.direction === "Across" && i === this.row) ||(this.direction === "Down" && j === this.column))) {
            this.squares[i][j].setColor(this.restColor);
          } else {
            this.squares[i][j].setColor(this.regColor);
          }
        }
      }
    }
    this.word += 1;
    this.showClue();
  } 


  lastWord() {
    if ((this.direction === "Across" && this.word === 5) || (this.direction === "Down" && this.word === 5)) {
      return true;
    } else {return false;}
  }

  firstWord () {
    if  (this.word === 1) {
      return true;
    } else {return false;}    
  }

  addResult () {
    this.resultText = this.add.bitmapText(this.center_width, 580, "lemonmilk", "", 40).setTint(0x000000).setOrigin(0.5)
  }

  gameEnd () {
    let correct = 0;
    for(let i = 0; i < BOARD.length; i++) {
      for(let j = 0; j < BOARD[0].length; j++) {
        if (BOARD[i][j] === this.guess[i][j]) { correct = 1}
        else {correct = 0}
      }
    }
    if (correct === 1) {
    // if (this.guess === BOARD) {
      console.log("you win")
      this.resultText.setText("WIN").setAlpha(1).setTint(0xffffff).setScale(2).setDropShadow(3, 4, 0x222222, 0.7);
      this.tweens.add({
        targets: this.resultText,
        scale: { from : 2, to: 3},
        repeat: -1,
        duration: 500,
        yoyo: true
      })
    } else {
      this.setPopUp(1.0);
    }
  }

  addClues () {
    this.add.rectangle(this.center_width, 1000, 700, 175, 0xf5ecdc);
    this.clueText = this.add.bitmapText(this.center_width, 995, "lemonmilk", "", 40).setTint(0x000000).setOrigin(0.5)
    this.clueText.setMaxWidth(700)
  }

  showClue () {
    let num = 0;
    if (this.direction === "Across") {
      let ind = ACROSS[this.row].findIndex(value => value !== 0);
      num = NUM[this.row][ind];
    } else if (this.direction === "Down") {
      let ind = 0;
      for (let i = 0; i < BOARD.length; i++) {
        if (DOWN[i][this.column] != 0) {ind = i}
      }
      num = NUM[ind][this.column];
    }
    let clueNum = num + " " + this.direction
    let clueHint = clueNum + ": " + clues[clueNum]
    this.clueText.setText(clueHint);
  }

  deleteOne () {
    let newCol = 0;
    let newRow = 0;
    //let board = this.direction === "Across" ? ACROSS : DOWN;
    if (this.direction === "Across") {
      if (this.column === 0 || this.squares[this.row][this.column - 1].letter === "0") {
        if (this.firstWord()) {
          //then it's first box and we want to delete last box
          for (let i=0; i < BOARD.length; i ++) {
            for (let j=0; j < BOARD[0].length; j++) {
              if (DOWN[i][j] === this.downClues) {
                newRow = i;
                newCol = j;
              }
            }
          }
          for (let k=newRow; k < BOARD.length; k++) {
            if (this.squares[k][newCol].isPlayable()) {
              newRow = k;
            }
          }
          this.direction = "Down"
        } else {
          //then its beginning of word and we need to go back a word
          newRow = this.row - 1;
          for (let i = 0; i < BOARD[0].length; i++) {
            if (BOARD[newRow][i] !== "0") {
              newCol = i;
            }
          }      
        }
        this.squares[newRow][newCol].setLetter("");
        this.guess[newRow][newCol] = "";
        this.guessLine = this.guessLine.slice(0,-1);
        this.clickedBox(this.squares[newRow][newCol]); 
      } else { //middle of word
        newCol = this.column - 1;
        this.squares[this.row][newCol].setLetter("");
        this.guess[this.row][newCol] = "";
        this.guessLine = this.guessLine.slice(0,-1);
        this.clickedBox(this.squares[this.row][newCol]);
      }
    } 
    else if (this.direction === "Down") {
      if (this.row === 0 || this.squares[this.row-1][this.column].letter === "0") {
        if (this.firstWord()) {
          //then it's first box and we want to delete last box
          for (let i=0; i < BOARD.length; i++) {
            for (let j=0; j < BOARD[0].length; j++) {
              if (ACROSS[i][j] === this.acrossClues) {
                newRow = i;
                newCol = j;
              }
            }
          }
          for (let k=newCol; k < BOARD[0].length; k++) {
            if (this.squares[newRow][k].isPlayable()) {
              newCol = k;
            }
          }
          this.direction = "Across"
        } else {
          //then its beginning of word and we need to go back a word
          newCol = this.column - 1;
          for (let i = 0; i < BOARD.length; i++) {
            if (BOARD[i][newCol] !== "0") {
              newRow = i;
            }
          }
        }
        this.squares[newRow][newCol].setLetter("");
        this.guess[newRow][newCol] = "";
        this.guessLine = this.guessLine.slice(0,-1);
        this.clickedBox(this.squares[newRow][newCol]);     
      } else { //middle of word
        newRow = this.row - 1;
        this.squares[newRow][this.column].setLetter("");
        this.guess[newRow][this.column] = "";
        this.guessLine = this.guessLine.slice(0,-1);
        this.clickedBox(this.squares[newRow][this.column]);
      }
    }
  }

}