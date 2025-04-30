export default class Tile extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter) {
        //super('Step'); 
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.scene = scene;
        this.scene.add.existing(this);
        this.tile = new Phaser.GameObjects.Arc(this.scene, 64, 32, 30, 0, 360, false, 0xa5ed1f).setOrigin(0.5)
        this.add(this.tile);
        //this.tile = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "letter").setOrigin(0.5);
        //this.add(this.tile);
        //this.scene.add.existing(new Phaser.GameObjects.BitmapText(this.scene, 20, 550, "pixelFont", "a", 30));
        this.wordText = new Phaser.GameObjects.BitmapText(this.scene, 64, 32, "mario", letter, 20).setTint(0x000000).setOrigin(0.5)
        this.add(this.wordText);
        this.setListeners();

    }

    setListeners () {
        this.tile.setInteractive();
        this.tile.on('pointerdown', () => {
            if (!this.scene.enabled) return;
            //else {
            this.tile.setFillStyle(0xe05ccf);
            this.scene.addGuess(this);
            //this.scene.playAudio("key");
            /*if (this.selected === 0 && this.scene.selectedBoxes < 4) {
                this.scene.clickedWord(this);
                this.tile.setFillStyle(0xed0e28);
                this.selected = 1;
            } else if (this.selected === 1) {
                this.scene.clickedWord(this);
                this.tile.setFillStyle(0xa5ed1f);
                this.selected = 0;
            } else return;*/
           // if (/^[a-z]{1}$/.test(this.letter) )
             //   this.scene.penguin.moveIt();
            //}
        });

        this.tile.on('pointerup', ()=> {
            this.scene.guessIt();
        });

        this.tile.on('pointerover', () => {
            let g = this.scene.getGuess()
            let l = this.scene.lastTile;
            if (!this.scene.enabled) return;
            if(g.length !== 0) {
                if(g.includes(this)) {
                    l.setColor(0xa5ed1f)
                    this.scene.removeGuess()
                    this.scene.lastTile = this;
                }
                else {
                this.tile.setFillStyle(0xe05ccf);
                this.scene.addGuess(this);
                this.scene.lastTile = this;
                }
            }
            else {return}
            //this.scene.setHelpText(this.letter)
            //this.setScale(1.2)
        })
/*
        this.tile.on('pointerout', () => {
            let g = this.scene.getGuess()
            if (g.length !== 0) {


            }
            //this.scene.setHelpText("")
            //this.setScale(1)
        })*/;
        
    }

    setColor(color) {
        this.tile.setFillStyle(color)
    }
}