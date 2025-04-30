import Box from "./connections/box.js";
import Groups from "./connections/groups.js";
import Chance from "./connections/chance.js";
import ConnectionsHelper from "./connections/connectionsHelper.js";

const group1 = ["apple", "banana", "pear", "cherry"];
const group2 = ["elm", "oak", "maple", "pine"];
const group3 = ["peru", "canada", "japan", "india"];
const group4 = ["blue", "red", "pink", "yellow"];

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
        this.load.image('background', 'assets/eucalyptus.png');
    }

    create() {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      //this.add.tileSprite(0, 0, 1800, 1800, "background").setOrigin(0.5);
      //this.cameras.main.setBackgroundColor(0xffffff);
      this.background = this.add.tileSprite(this.center_width, this.center_height, 500, 800, 'background');
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
      //mistakes remaining
      //shuffle --always allowed
      //deselect all -- only clickable with >= 1 selected, greyed out otherwise
      //submit -- only clickable when 4 selected, greyed out otherwise
    }

    loadCategories() {
      group1.category = "Fruits"
      group2.category = "Trees"
      group3.category = "Countries"
      group4.category = "Colors"
      group1.color = "0x2030e3"//blue
      group2.color = "0x7120e3"//purple
      group3.color = "0xf2eb27"//yellow
      group4.color = "0x4df53d"//green
      this.allOptions = group1.concat(group2, group3, group4)
    }

    addMenuButton() {
        this.menuButton = this.add
            .bitmapText(45, 25, "mario", "Menu", 20)
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
        this.submitButton = this.add
            .bitmapText(334, 600, "mario", "Submit", 15)
            .setOrigin(0.5)
            .setTint(0x050cf8 )
          //  .setDropShadow(2, 3, 0x693600, 0.7);
        this.submitButton.setInteractive();
        this.submitButton.on("pointerdown", () => {
            this.guessGrouping();
        });

        this.deselectButton = this.add
            .bitmapText(166, 600, "mario", "Deselect All", 15)
            .setOrigin(0.5)
            .setTint(0x050cf8)
          //  .setDropShadow(2, 3, 0x693600, 0.7);
        this.deselectButton.setInteractive();
        this.deselectButton.on("pointerdown", () => {
            console.log("Deselect all")
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
      this.add.bitmapText(this.center_width, 40, "mario", "CONNECTIONS", 40).setOrigin(0.5).setDropShadow(3, 4, 0x222222, 0.7);
    }

    addBoard() {
      this.shuffledBoard = this.shuffleArray(this.allOptions);
      this.boxes = [];
      //let boxY = 0;
      //let boxX = 56;
      let x = this.center_width - (64*2.5) - 15;
      let y = 150;
      let ind = 0
      //this.add.rectangle(250, 740, 500, 200, 0x4d4d4d).setOrigin(0.5);
      Array(4).fill(0).forEach((box, i) => {
        this.boxes.push([])
        Array(4).fill(0).forEach((_, j) => {
          let word = this.shuffledBoard[ind]
          const box = new Box(this, x, y, word)
          this.boxes[i].push(box);
          x += 64 + 10;
          ind += 1
        })
        //ind += 1
        x = this.center_width - (64*2.5) - 15;
        y += 64 + 10;
      })
    }

    shuffleBoard() {
      this.shuffledBoard = this.shuffleArray(this.allOptions);
    }

    clickedWord(box) {
        //let word = box.word;
      if (this.guess.indexOf(box) === -1 && this.enabled) {
        this.guess.push(box);
        this.selectedBoxes += 1;
      } else if (this.guess.indexOf(box) >= 0 && this.enabled) {
        this.guess.splice(this.guess.indexOf(box), 1);
        this.selectedBoxes = this.selectedBoxes - 1;
      }/* else if (letter === "-") {
        this.deleteOne();
      } else if (letter === "--") {
        this.deleteAll();
      }*/
    } 

    addChances () {
      this.chances = [];
      this.chancesLeft = 3; 
      let x = this.center_width - (64*2.5) - 15;
      let y = 450;    
      Array(4).fill(0).forEach((_, j) => {
          const chance = new Chance(this, x, y)
          this.chances.push(chance);
          x += 64 + 10;
        })

    }

    guessGrouping() {
      console.log("guessing")
      this.connections.guess(this.guess, this.boxes);
      //this.resetBoxes();
      //this.connections.next() //update misses or increase the board index for insert
      let result = this.connections.currentResult();
      let current = this.connections.currentGroupLine();
      if (result === "right") {
        this.guess = [];
        this.updateBoard();
        this.connections.clearUp();
        let [category, color] = this.connections.returnWinnerGroup();
        this.groups[current-1].revealGroup(category, color);
      }
      else {
        this.chances[this.chancesLeft].setOpacity();
        this.chancesLeft-=1;
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
        this.guess[j].setColor(0xa5ed1f);
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
          console.log(move2Group[i].word + ": x-" + move2Group[i].x + ": y-" + move2Group[i].y)
          console.log(move_Out[i].word + ": x-" + move_Out[i].x + ": y-" + move_Out[i].y)
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
      let y = 150;
      this.groups = [];
      for (let i = 0; i < 4; i++) {
        const group = new Groups(this, this.center_width-26, y)
        this.groups.push(group);      
        y += 74
      }

    }

}
