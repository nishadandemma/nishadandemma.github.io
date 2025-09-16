export default class Connector extends Phaser.GameObjects.Container {
    constructor (scene, tile1, tile2) {
        //super('Step'); 
        super(scene, (tile1.x + tile2.x)/2, (tile1.y + tile2.y)/2);
        this.x = (tile1.x + tile2.x)/2;
        this.y = (tile1.y + tile2.y)/2;
        this.tile1 = tile1;
        this.tile2 = tile2;
        this.w = 40;
        this.orientation = this.getOrientation();
        this.scene = scene;
        this.scene.add.existing(this);
//        this.tile = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.w, 25, 0x000000).setOrigin(0.5).setAlpha(1.0).setRotation(this.orientation);// radians in a circle
        this.tile = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.w, 10, 0x85bc92).setOrigin(0.5).setAlpha(1.0).setRotation(this.orientation);// radians in a circle
        this.add(this.tile);
        //this.tile = new Phaser.GameObjects.Sprite(this.scene, 64, 32, "letter").setOrigin(0.5);
        //this.add(this.tile);
        //this.scene.add.existing(new Phaser.GameObjects.BitmapText(this.scene, 20, 550, "pixelFont", "a", 30));
    }

    getOrientation() {
        //0.0 horizontal
        //0.5*Math.PI vertical
        //(0.25)*Math.PI back slant
        //(0.75)*Math.PI forward slant
        if(this.tile1.y === this.tile2.y) {
            return 0.0;
        }
        else if (this.tile1.x === this.tile2.x) {
            return(0.5*Math.PI)
        }
        else if ((this.tile1.x < this.tile2.x && this.tile1.y > this.tile2.y) ||
                 (this.tile1.x > this.tile2.x && this.tile1.y < this.tile2.y)) {
            this.w = 100;
            return (0.75)*Math.PI;
        }
        else if ((this.tile1.x < this.tile2.x && this.tile1.y < this.tile2.y) ||
                 (this.tile1.x > this.tile2.x && this.tile1.y > this.tile2.y)) {
            this.w = 100;
            return (0.25)*Math.PI;
        }
    }

    getRid () {
        this.destroy();
    }

    setColor (color) {
        this.tile.setFillStyle(color);
    }
}