const today = new Date();
const day = today.getDate();

export default class Box extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter, num, row, col) {
        //super('Step'); 
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = col;
        this.letter = letter;
        this.scene = scene;
        this.scene.add.existing(this)
        this.size = (day % 2 == 1) ? 90 : 120;
        this.letteroffset = (day % 2 == 1) ? -30 : -50;
        this.fontsize = (day % 2 == 1) ? 75 : 100;
        this.baseColor = (this.letter === '0') ? 0x000000 : 0xffffff
        this.square = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.size, this.size, this.baseColor).setOrigin(0.5)
        this.add(this.square);
        this.num = new Phaser.GameObjects.BitmapText(this.scene, this.letteroffset, this.letteroffset, "lemonmilk", num, 20).setTint(0x000000).setOrigin(0.5)
        this.add(this.num);
        this.display = new Phaser.GameObjects.BitmapText(this.scene, 0, 0, "lemonmilk", "" , this.fontsize).setTint(0x000000).setOrigin(0.5, 0.65)
        this.add(this.display);
        //this.tile = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "letter").setOrigin(0.5);
        //this.add(this.tile);
        //this.scene.add.existing(new Phaser.GameObjects.BitmapText(this.scene, 20, 550, "pixelFont", "a", 30));
        //this.wordText = new Phaser.GameObjects.BitmapText(this.scene, 64, 32, "mario", letter, 20).setTint(0x000000).setOrigin(0.5)
        //this.add(this.wordText);
        this.setListeners();

    }

    setListeners () {
        this.square.setInteractive();
        this.square.on('pointerdown', () => {
            if (!this.scene.enabled) return;
            else {
                this.scene.clickedBox(this);
            }
        }); 
    }

    setColor (color) {
        this.square.setFillStyle(color);
    }

    setLetter (letter) {
        this.display.setText(letter);
    }

    isPlayable () {
        if (this.letter !== "0") {
            return true
        } else { return false }
    }

}