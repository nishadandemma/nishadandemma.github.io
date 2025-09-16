export default class Groups extends Phaser.GameObjects.Container {
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
        //this.block = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "dot").setOrigin(0.5);
        //this.add(this.dot);
        this.block = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 745, 175, 0x670eed, 0.0).setOrigin(0.5);
        this.add(this.block);        //this.scene.add.existing(new Phaser.GameObjects.BitmapText(this.scene, 20, 550, "pixelFont", "a", 30));
        this.groupText = new Phaser.GameObjects.BitmapText(this.scene, 0, 0, "lemonmilk", "", 60).setTint(0x210152).setOrigin(0.5, 1.3).setAlpha(0.0);
        this.detailText = new Phaser.GameObjects.BitmapText(this.scene, 0, 0, "lemonmilk", "", 30).setTint(0x210152).setOrigin(0.5, -0.5).setAlpha(0.0);
        this.add(this.groupText);
        this.add(this.detailText);
        //this.setListeners();

    }
    setAlphaValue(a) {
        this.block.setAlpha(a);
        this.groupText.setAlpha(a);
        this.detailText.setAlpha(a);
    }
    setGroupName(name) {
        this.groupText.setText(name);
    }
    setDetailName(detail) {
        this.detailText.setText(detail);
    }
    setGroupColor(color) {
        this.block.setFillStyle(color);
    }
    revealGroup(name, color, detail) {
        this.setGroupName(name);
        this.setDetailName(detail);
        this.setGroupColor(color);
        this.setAlphaValue(1.0);
        //container.bringToTop(this);
    }
}