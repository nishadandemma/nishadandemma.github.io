import Box from "./connections/box.js";
import Groups from "./connections/groups.js";
import Chance from "./connections/chance.js";
import ConnectionsHelper from "./connections/connectionsHelper.js";

const group1 = [];
const group2 = [];
const group3 = [];
const group4 = [];

export class Connections extends Phaser.Scene {
    constructor() {
        super('Connections');
        this.player = null;
        this.score = 0;
        this.scoreText = null;

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
      //this.add.tileSprite(0, 0, 1800, 1800, "background").setOrigin(0.5);
      //this.cameras.main.setBackgroundColor(0xffffff);
      this.background = this.add.tileSprite(this.center_width, this.center_height, 900, 1600, 'background');
      this.addMenuButton();
      this.enabled = true;
      this.selectedBoxes = 0;
      this.misses = 0;
      this.loadCategories();
      this.guess = [];
      this.connections = new ConnectionsHelper(group1, group2, group3, group4)
      this.addTitle();
      this.setUpGroups();
      this.addBoard();
      this.addChances();
      this.addButtons();
      this.addResult();
      this.addOnlyOneText();
      this.previousGuesses = [];
      //mistakes remaining
      //shuffle --always allowed
      //deselect all -- only clickable with >= 1 selected, greyed out otherwise
      //submit -- only clickable when 4 selected, greyed out otherwise
    }

    loadCategories() {
      const today = new Date();
      const day = today.getDate();
      if (day % 2 == 0) {
        group1 = ["apple", "banana", "pear", "cherry"];
        group2 = ["elm", "oak", "maple", "pine"];
        group3 = ["peru", "canada", "japan", "india"];
        group4 = ["blue", "red", "pink", "yellow"];
        group1.category = "Fruits"
        group2.category = "Trees"
        group3.category = "Countries"
        group4.category = "Colors"
        group1.detail = "Apple, Banana, Pear, Cherry"
        group2.detail = "Elm, Oak, Maple, Pine"
        group3.detail = "Peru, Canada, Japan, India"
        group4.detail = "Blue, Red, Pink, Yellow"
      }
      else if (day % 2 !== 0) {
        group1 = ["apple", "banana", "pear", "cherry"];
        group2 = ["elm", "oak", "maple", "pine"];
        group3 = ["peru", "canada", "japan", "india"];
        group4 = ["blue", "red", "pink", "yellow"];
        group1.category = "Fruits"
        group2.category = "Trees"
        group3.category = "Countries"
        group4.category = "Colors"
        group1.detail = "Apple, Banana, Pear, Cherry"
        group2.detail = "Elm, Oak, Maple, Pine"
        group3.detail = "Peru, Canada, Japan, India"
        group4.detail = "Blue, Red, Pink, Yellow"
      }
      
      group1.color = "0x709EAC"//blue
      group2.color = "0xa084bd"//purple
      group3.color = "0xe3dc94"//yellow
      group4.color = "0x7db57d"//green
      this.allOptions = group1.concat(group2, group3, group4)
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
        this.submite = this.add.sprite(600, 1305, "ellipse").setOrigin(0.5).setDisplaySize(225, 75);
        this.submitButton = this.add
            .bitmapText(600, 1300, "lemonbold", "Submit", 36)
            .setOrigin(0.5)
            .setTint(0x050cf8 )
          //  .setDropShadow(2, 3, 0x693600, 0.7);
        this.submitButton.setInteractive();
        this.submitButton.on("pointerdown", () => {
            if (this.guess.length === 4) {
              this.guessGrouping();
            } else return  
        });

        this.deselcte = this.add.sprite(300, 1305, "ellipse").setOrigin(0.5).setDisplaySize(325, 75);
        this.deselectButton = this.add
            .bitmapText(300, 1300, "lemonbold", "Deselect All", 36)
            .setOrigin(0.5)
            .setTint(0x050cf8)
          //  .setDropShadow(2, 3, 0x693600, 0.7);
        this.deselectButton.setInteractive();
        this.deselectButton.on("pointerdown", () => {
            this.deselectAll();
        });
/*
        this.shuffleButton = this.add
            .bitmapText(100, 600, "mario", "Shuffle", 15)
            .setOrigin(0.5)
            .setTint(0x050cf8)
          //  .setDropShadow(2, 3, 0x693600, 0.7);
        this.shuffleButton.setInteractive();
        this.shuffleButton.on("pointerdown", () => {
            console.log("Shuffle")
            //this.scene.start("Start")
        });  
*/
    }

    addTitle() {
      this.add.bitmapText(this.center_width, 100, "nougat", "CONNECTIONS", 100).setOrigin(0.5);//.setDropShadow(3, 4, 0x222222, 0.7);
    }

    addResult () {
      this.resultText = this.add.bitmapText(this.center_width, 580, "lemonmilk", "", 40).setTint(0x000000).setOrigin(0.5)
    }

    addBoard() {
      this.shuffledBoard = this.shuffleArray(this.allOptions);
      this.boxes = [];
      //let boxY = 0;
      //let boxX = 56;
      let x = this.center_width - (175*1.5+15*1.5);
      let y = 400;
      let ind = 0
      //this.add.rectangle(250, 740, 500, 200, 0x4d4d4d).setOrigin(0.5);
      Array(4).fill(0).forEach((box, i) => {
        this.boxes.push([])
        Array(4).fill(0).forEach((_, j) => {
          let word = this.shuffledBoard[ind]
          const box = new Box(this, x, y, word)
          this.boxes[i].push(box);
          x += 190;
          ind += 1
        })
        //ind += 1
        x = this.center_width - (175*1.5+15*1.5);
        y += 190;
      })
    }

    shuffleBoard() {
      this.shuffledBoard = this.shuffleArray(this.allOptions);
    }

    clickedWord(box) {
      if (this.guess.indexOf(box) === -1 && this.enabled) {
        this.guess.push(box);
        this.selectedBoxes += 1;
      } else if (this.guess.indexOf(box) >= 0 && this.enabled) {
        this.guess.splice(this.guess.indexOf(box), 1);
        this.selectedBoxes = this.selectedBoxes - 1;
      } 
      /* else if (letter === "-") {
        this.deleteOne();
      } else if (letter === "--") {
        this.deleteAll();
      }*/
    } 

    addChances () {
      this.chances = [];
      this.chancesLeft = 3; 
      let x = this.center_width - (84*1.55);
      let y = 1150;    
      Array(4).fill(0).forEach((_, j) => {
          const chance = new Chance(this, x, y)
          this.chances.push(chance);
          x += 64 + 20;
        })

    }

    guessGrouping() {
      console.log("guessing")
      let words = [];
      for (let i = 0; i < this.guess.length; i++) {
            words.push(this.guess[i].word);
      }
      if (this.previousGuesses.includes(words.sort())) {
        this.showAlreadyGuessedText();
        return;
      } else {
        this.previousGuesses.push(words.sort());
        this.connections.guess(this.guess, this.boxes);
        //this.resetBoxes();
        //this.connections.next() //update misses or increase the board index for insert
        let result = this.connections.currentResult();
        let current = this.connections.currentGroupLine();
        if (result === "right") {
          this.guess = [];
          this.updateBoard();
          this.connections.clearUp();
          let [category, color, detail] = this.connections.returnWinnerGroup();
          this.groups[current-1].revealGroup(category, color, detail);
          this.hideboxes(current-1);
        }
        else {
          if (this.connections.isThree()) {this.showOnlyOneText();}
          this.chances[this.chancesLeft].setOpacity();
          this.chancesLeft-=1;
        } 
        this.connections.setOutcome(this.chancesLeft);  
        this.checkEnd();
      }
    }

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    deselectAll () {
      for (let j = 0; j < this.guess.length; j++) {
        this.guess[j].setColor(0xf5ecdc);
        this.guess[j].setStatus(0);
      }
      this.selectedBoxes = 0;      
      this.guess = [];
    }

    updateBoard() {
        console.log("updating board")
        //const nextGroupLine = this.connections.currentGroupLine();
        //const status = this.connections.currentStatus();
        const move2Group = this.connections.currentMove2Group();
        const move_Out = this.connections.currentMove_Out();
        for (let i = 0; i < move2Group.length; i++) {
          let wrongX = move_Out[i].x;
          let wrongY = move_Out[i].y;
          let corrX = move2Group[i].x;
          let corrY = move2Group[i].y;
          move2Group[i].setPos(wrongX, wrongY);
          move_Out[i].setPos(corrX, corrY);
        }
        this.resetBoxes(move_Out, move2Group);
    }

    resetBoxes(out, inn) {
      const move2Group = inn;
      const move_Out = out;
      for (let i = 0; i < move2Group.length; i++) {
        let [x1, y1] = this.indexOfMulti(this.boxes, move2Group[i]);
        let [x2, y2] = this.indexOfMulti(this.boxes, move_Out[i]);
        let box1 = this.boxes[x1][y1];
        let box2 = this.boxes[x2][y2];
        this.boxes[x1][y1] = box2;
        this.boxes[x2][y2] = box1;
      }
      for (let j = 0; j < this.guess.length; j++) {
        this.guess[j].setColor(0xa5ed1f);
        this.guess[j].setStatus(0);
      }
      this.selectedBoxes = 0
    }

    indexOfMulti(arr, input) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].includes(input)) {
          return [i, arr[i].indexOf(input)];
        }
      }

    }

    setUpGroups() {
      let y = 400;
      this.groups = [];
      for (let i = 0; i < 4; i++) {
        const group = new Groups(this, this.center_width, y)
        this.groups.push(group);      
        y += 190
      }

    }

    hideboxes (index) {
      for (let i = 0; i < 4; i++) {
          this.boxes[index][i].setAlphas();
      }
    }

    checkEnd () {
      if (this.connections.outcome !== "playing") {
        this.enabled = false;
        this.time.delayedCall(1600 , () => { this.showResult(); }, null, this);
      }
    }

    showResult () {
      if (this.connections.outcome === "lose") {
        this.showAnswer();
        return;
      } 

      //this.penguin.play("playerjump", true)
      //this.playAudio("victory")
      this.resultText.setText(this.connections.outcome).setAlpha(1).setTint(0xffffff).setScale(2).setDropShadow(3, 4, 0x222222, 0.7);
      this.tweens.add({
        targets: this.resultText,
        scale: { from : 2, to: 3},
        repeat: -1,
        duration: 500,
        yoyo: true
      })
    }

    showAnswer() {
      this.deselectAll();
      const done = this.connections.groupsTaken;
      const left = [group1, group2, group3, group4];
      for (let i = 0; i < 4; i++) {
        if (left.includes(done[i])) {
          left.splice(left.indexOf(done[i]), 1);
        }      
      }
      if (left.length === 0 ) return
      let working = left[0]
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let word = this.boxes[i][j].word;
          word = word.charAt(0).toUpperCase() + word.slice(1);
          if (working.detail.includes(word)) {
            //this.clickedWord(this.boxes[i][j]);
            this.guess.push(this.boxes[i][j]);
            this.boxes[i][j].setStatus(1);
          }
        }  
      }
      this.guessGrouping();
    }

    addOnlyOneText () {
      this.onlyOne = this.add.bitmapText(this.center_width, 250, "nougat", "", 40).setOrigin(0.5).setAlpha(0.0);
    }

    showOnlyOneText () {
      this.onlyOne.setText("One away...");
      this.tweens.add({
        targets: this.onlyOne,
        duration: 800,
        alpha: { from: 0.0, to: 1 },
        repeat: 0,
        yoyo: true
      });
    } 

    showAlreadyGuessedText () {
      this.onlyOne.setText("Already guessed...");
      this.tweens.add({
        targets: this.onlyOne,
        duration: 800,
        alpha: { from: 0.0, to: 1 },
        repeat: 0,
        yoyo: true
      });
    } 
}
