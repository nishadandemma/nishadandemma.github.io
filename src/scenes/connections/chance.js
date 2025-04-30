export default class Chance extends Phaser.GameObjects.Container {
    constructor (scene, x, y) {
        //super('Step'); 
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        //this.selectedBoxes = this.scene.selectedBoxes;
        // this.word = word// === "ñ" ? "n" : letter;
        this.scene.add.existing(this);
        // this.selected = 0;
        this.dot = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "dot").setOrigin(0.5);
        this.add(this.dot);
        //this.cover = new Phaser.GameObjects.Rectangle(this.scene, 64, 32, 48, 48, 0xda0b5b , 0.25).setOrigin(0.5)
        //this.add(this.cover);        //this.scene.add.existing(new Phaser.GameObjects.BitmapText(this.scene, 20, 550, "pixelFont", "a", 30));
        // this.wordText = new Phaser.GameObjects.BitmapText(this.scene, 64, 32, "mario", this.word, 10).setTint(0x000000).setOrigin(0.5)
        // this.add(this.wordText);
        //this.setListeners();

    }

    setOpacity() {
        this.dot.setAlpha(0);
    }
    /*
    setListeners() {
        this.box.setInteractive();
        this.box.on('pointerdown', () => {
            console.log(this.scene.selectedBoxes)
            if (!this.scene.enabled) return;
            //this.scene.playAudio("key");
            if (this.selected === 0 && this.scene.selectedBoxes < 4) {
                this.scene.clickedWord(this.word);
                this.square.setFillStyle(0xed0e28);
                this.selected = 1;
            } else if (this.selected === 1) {
                this.scene.clickedWord(this.word);
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
    */
}