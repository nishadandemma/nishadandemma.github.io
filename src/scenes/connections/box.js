export default class Box extends Phaser.GameObjects.Container {
    constructor (scene, x, y, word = "") {
        //super('Step'); 
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.row = (y-150)/74;
        this.col = (x-75)/74;
        this.scene = scene;
        //this.selectedBoxes = this.scene.selectedBoxes;
        this.word = word// === "ñ" ? "n" : letter;
        this.scene.add.existing(this);
        this.square = new Phaser.GameObjects.Rectangle(this.scene, 64, 32, 48, 48, 0xa5ed1f).setOrigin(0.5)
        this.add(this.square);
        this.selected = 0;
        this.box = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "letter").setOrigin(0.5);
        this.add(this.box);
        //this.scene.add.existing(new Phaser.GameObjects.BitmapText(this.scene, 20, 550, "pixelFont", "a", 30));
        this.wordText = new Phaser.GameObjects.BitmapText(this.scene, 64, 32, "lemonmilk", this.word, 10).setTint(0x000000).setOrigin(0.5)
        this.add(this.wordText);
        this.setListeners();

    }

    setWord (word = "") {
        this.wordText.setText(word);
    }

    setColor (color) {
        this.square.setFillStyle(color);
    }

    setStatus(status) {
        this.selected = status;
    } 

    setListeners () {
        this.box.setInteractive();
        this.box.on('pointerdown', () => {
            if (!this.scene.enabled) return;
            //this.scene.playAudio("key");
            if (this.selected === 0 && this.scene.selectedBoxes < 4) {
                this.scene.clickedWord(this);
                this.square.setFillStyle(0xed0e28);
                this.selected = 1;
            } else if (this.selected === 1) {
                this.scene.clickedWord(this);
                this.square.setFillStyle(0xa5ed1f);
                this.selected = 0;
            } else return;
           // if (/^[a-z]{1}$/.test(this.letter) )
             //   this.scene.penguin.moveIt();
        });

        this.box.on('pointerover', () => {
            if (!this.scene.enabled || this.selected === 1 || this.scene.selectedBoxes === 4) return;
            else {
                this.backupColor = this.square.fillColor;
                this.square.setFillStyle(0xc93a4b);
                this.depthBackup = this.depth; 
                //this.scene.playAudio("over");
                this.depth = 10;
            }
            //this.scene.setHelpText(this.letter)
            //this.setScale(1.2)
        })

        this.box.on('pointerout', () => {
            if (this.selected === 1){
                this.square.setFillStyle(this.backupColor);
                this.depth = 0;
                this.square.setFillStyle(0xed0e28);
            }
            else if (this.selected === 0) {
                this.square.setFillStyle(this.backupColor);
                this.depth = 0;
                this.square.setFillStyle(0xa5ed1f);
            }
            //this.scene.setHelpText("")
            //this.setScale(1)
        });
        
    }

    setPos (newX, newY) {
        this.x = newX
        this.y = newY;
    }

}