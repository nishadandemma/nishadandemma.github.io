//  "Every great game begins with a single scene. Let's make this one unforgettable!"
import { WORDS } from "./wordle/words.js";
import WordleHelper from "./wordle/wordleHelper.js";
import Step from "./wordle/step.js";
import Key from "./wordle/key.js";

export class Wordle extends Phaser.Scene {
    constructor () {
        super('Wordle');
//        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number;
  }

    preload () {
        this.load.image('background', 'assets/background9x16.png');

    }

    create () {

      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      //this.add.tileSprite(0, 0, 1800, 1800, "background").setOrigin(0.5);
      //this.cameras.main.setBackgroundColor(0xffffff);
      this.background = this.add.tileSprite(this.center_width, this.center_height, 900, 1600, 'background');

      this.addMenuButton();
      this.loadWord();
      this.wordle = new WordleHelper(this.wordToGuess)
      this.guess = "";
      this.enabled = true;
      
      this.addTitle();
      this.addSteps();
      this.addLetters();
      this.addResult();
      // this.popupunder = this.add.rectangle(this.center_width,175,350, 75, 0xf5ecdc, 0.0).setOrigin(0.5);
      this.popup = this.add.bitmapText(this.center_width, 175, "lemonbold", "", 30).setAlpha(0.0).setOrigin(0.5);
      this.previousGuesses = [];
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

    loadWord () {
    //  const lang = getParameters().get("lang") || "en";
    //  const today = `${new Date().getFullYear()}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;
    //  console.log("Loading ", lang, today)
    //  this.wordToGuess = words[lang][today];
    //this.wordToGuess = WORDS[Math.floor(Math.random() * WORDS.length)]
    const today = new Date();
    const day = today.getDate();
    if (day % 2 == 0) {
      this.wordToGuess = "sange";
    }
    else if (day % 2 !== 0) {
      this.wordToGuess = "weddi";
    }
    }

    addTitle() {
      this.add.bitmapText(this.center_width, 100, "nougat", "WORDLE", 100).setOrigin(0.5);//.setDropShadow(3, 4, 0x222222, 0.7);
    }


    addSteps () {
      this.steps = [];
      let x = this.center_width - (2.375*125);
      let y = 260;

      Array(6).fill(0).forEach((letter, i) => {
        this.steps.push([])
        Array(5).fill(0).forEach((_, j) => {
          const step = new Step(this, x, y)
          this.steps[i].push(step);
          x += 150;
        })
        x = this.center_width - (2.375*125);
        y += 150;
      })
    }


    addLetters () {
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

      this.keyboard["enter"] = new Key(this, 25, y, "enter");
      this.keyboard["enter"].setTextSize(30);
      this.keyboard["<<<"] = new Key(this, x + 107, y, "<<<");
      this.keyboard["<<<"].setTextSize(30);
      
      //this.keyboard["--"] = new Key(this, x + 144, y, "--");
    }

    addResult () {
      this.resultText = this.add.bitmapText(this.center_width, 580, "lemonmilk", "", 40).setTint(0x000000).setOrigin(0.5)
    }

    finishScene () {
      this.sky.stop();
      //this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    showResult (points = 0) {
      if (this.wordle.outcome === "lose") {
        this.showAnswer();
        return;
      } 

      //this.penguin.play("playerjump", true)
      //this.playAudio("victory")
      this.resultText.setText(this.wordle.outcome).setAlpha(1).setTint(0xffffff).setScale(2).setDropShadow(3, 4, 0x222222, 0.7);
      this.tweens.add({
        targets: this.resultText,
        scale: { from : 2, to: 3},
        repeat: -1,
        duration: 500,
        yoyo: true
      })
    }

    showAnswer() {
      this.answer = this.add.sprite(this.center_width, 540, "ellipse").setOrigin(0.5).setDisplaySize(825, 225).setTint(0x7db57d);
      Array(5).fill(0).forEach((_, i) => {
        new Step(this, this.center_width - (2.375*125) + (150 * i), 540, this.wordle.word.charAt(i));
      })
      //this.playAudio("defeat")
      //this.penguin.y = 514;
      //this.penguin.anims.play("playerground", true);
    }
  
  setHelpText (letter) {
    const help = {
      "enter": "Enter",
      "<<<": "Delete"//,
     // "--": "Delete all"
    }[letter] || letter;
    //this.helpText.setText(help) 
  }

    clickedLetter (letter) {
      const allowed = "abcdefghijklmnopqrstuvwxyz";

      if (allowed.indexOf(letter) >= 0 && this.guess.length < 5 && this.enabled) {
        this.guess += letter;
        this.steps[this.wordle.current][this.guess.length - 1].setLetter(letter);
      } else if (letter === "enter" && this.guess.length === 5) {
        this.guessLine();
      } else if (letter === "<<<") {
        this.deleteOne();
      }
    }

    guessLine() {
      if (this.previousGuesses.includes(this.guess)) {
        this.showAlreadyGuessed();
      }
      else {
        this.previousGuesses.push(this.guess);
        if (WORDS.includes(this.guess)) {
          this.wordle.guess(this.guess);
          this.updateSteps();
          this.wordle.next()
          this.guess = "";
          this.checkEnd();
        }
        else {
          this.popUp();
          this.steps[this.wordle.current].forEach((step,i) => {
          //this.time.delayedCall(400 * i, () => {
            step.setTween();
          //}, null, this);
        });
        }
      }
    }

    popUp () {
      // this.tweens.add({
      //   targets: this.popupunder,
      //   duration: 800,
      //   alpha: { from: 0.0, to: 1 },
      //   repeat: 0,
      //   yoyo: true
      // });      
      this.popup.setText("Not in word list");
      this.tweens.add({
        targets: this.popup,
        duration: 800,
        alpha: { from: 0.0, to: 1 },
        repeat: 0,
        yoyo: true
      });



      // this.popup.setAlpha(1.0);
      // this.popupunder.setAlpha(1.0);
      // this.time.delayedCall(1000);
      // this.popup.setAlpha(0.0);
      // this.popupunder.setAlpha(0.0);
    }

    checkEnd () {
      if (this.wordle.outcome !== "playing") {
        this.enabled = false;
        this.time.delayedCall(1600 , () => { this.showResult(); }, null, this);
      }
    }

    updateSteps () {
      const status = this.wordle.currentStatus();
      this.steps[this.wordle.current].forEach((step,i) => {
        this.time.delayedCall(200 * i, () => {
          step.setColor(status[i].color);
          this.keyboard[status[i].letter].setColor(status[i].color);
          //this.playAudio(this.colorKeys[status[i].color]);
        }, null, this);
      });
    }

    deleteOne () {
      this.guess = this.guess.substring(0, this.guess.length - 1)
      this.steps[this.wordle.current][this.guess.length].setLetter();
    }

    deleteAll () {
      this.guess = "";
      this.steps[this.wordle.current].forEach(text => {if (text) text.setLetter()});
    }

    showAlreadyGuessed () {
      // this.tweens.add({
      //   targets: this.popupunder,
      //   duration: 800,
      //   alpha: { from: 0.0, to: 1 },
      //   repeat: 0,
      //   yoyo: true
      // });   
      this.popup.setText("Already guessed...")   
      this.tweens.add({
        targets: this.popup,
        duration: 800,
        alpha: { from: 0.0, to: 1 },
        repeat: 0,
        yoyo: true
      });
    }

}