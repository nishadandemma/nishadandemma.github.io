export default class Box extends Phaser.GameObjects.Container {
    constructor (scene, x, y, letter) {
        //super('Step'); 
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.scene = scene;
        this.scene.add.existing(this);
        this.baseColor = (this.letter === '0') ? 0x000000 : 0xffffff
        this.square = new Phaser.GameObjects.Rectangle(this.scene, 64, 32, 60, 60, this.baseColor).setOrigin(0.5)
        this.add(this.square);
        //this.tile = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "letter").setOrigin(0.5);
        //this.add(this.tile);
        //this.scene.add.existing(new Phaser.GameObjects.BitmapText(this.scene, 20, 550, "pixelFont", "a", 30));
        //this.wordText = new Phaser.GameObjects.BitmapText(this.scene, 64, 32, "mario", letter, 20).setTint(0x000000).setOrigin(0.5)
        //this.add(this.wordText);
        //this.setListeners();

    }
    
    setColor (color) {
        this.square.setFillStyle(color);
    }
}