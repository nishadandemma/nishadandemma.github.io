export class Start extends Phaser.Scene
{
    constructor()
    {
        super('Start');
    }

    preload()
    {
        this.load.image('background', 'assets/eucalyptus.png');
        this.load.image('title', 'assets/title.png');      
        this.load.bitmapFont(
            "mario",
            "assets/fonts/mario.png",
            "assets/fonts/mario.xml"
        );
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.load.image("blue", "assets/blue.png");
        this.load.image("block0", "assets/block0.png");
        this.load.image("letter", "assets/letter.png");
        this.load.image("dot", "assets/red_dot.png");
        this.load.spritesheet("keycup", "assets/keycup.png", { frameWidth: 48, frameHeight: 48 });
    //    this.load.image('connections', 'assets/blue.png');
    //    this.load.image('minicrossword', 'assets/blue.png');
    //    this.load.image('strands', 'assets/blue.png');
    //    this.load.image('wordle', 'assets/blue.png');
    
/*
        this.add.text(500, 360, 'Connections', {color: '0x581845' });
        this.add.text(500, 535, 'Strands', {color: '0x581845' });
        this.add.text(700, 360, 'Mini Crossword', {color: '0x581845' });
        this.add.text(700, 535, 'Wordle', {color: '0x581845' });
        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        //this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
*/
    }


    addConnectionsButton() {
        this.connectionsButton = this.add
            .bitmapText(150, 360, "mario", "Connections", 15)
            .setOrigin(0.5)
            .setTint(0xffe066)
          //  .setDropShadow(2, 3, 0x693600, 0.7);
        this.connectionsButton.setInteractive();
        this.connectionsButton.on("pointerdown", () => {
            //this.sound.add("move").play(); //maybe add sound effects when clicked?
            this.startConnections();
        });
        this.connectionsButton.on("pointerover", () => {
            this.connectionsButton.setTint(0x3e6875);
        });
        this.connectionsButton.on("pointerout", () => {
            this.connectionsButton.setTint(0xffe066);
        });
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: { from: 0, to: 1 },
            repeat: -1,
            yoyo: true,
        });
    }

    addWordleButton() {
        this.wordleButton = this.add
            .bitmapText(350, 360, "mario", "Wordle", 15)
            .setOrigin(0.5)
            .setTint(0xffe066)
         //   .setDropShadow(2, 3, 0x693600, 0.7);
        this.wordleButton.setInteractive();
        this.wordleButton.on("pointerdown", () => {
            //this.sound.add("move").play(); //maybe add sound effects when clicked?
            this.startWordle();
        });
        this.wordleButton.on("pointerover", () => {
            this.wordleButton.setTint(0x3e6875);
        });
        this.wordleButton.on("pointerout", () => {
            this.wordleButton.setTint(0xffe066);
        });
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: { from: 0, to: 1 },
            repeat: -1,
            yoyo: true,
        });
    }

     addStrandsButton() {
        this.strandsButton = this.add
            .bitmapText(150, 450, "mario", "Strands", 15)
            .setOrigin(0.5)
            .setTint(0xffe066)
           // .setDropShadow(2, 3, 0x693600, 0.7);
        this.strandsButton.setInteractive();
        this.strandsButton.on("pointerdown", () => {
            //this.sound.add("move").play(); //maybe add sound effects when clicked?
            this.startStrands();
        });
        this.strandsButton.on("pointerover", () => {
            this.strandsButton.setTint(0x3e6875);
        });
        this.strandsButton.on("pointerout", () => {
            this.strandsButton.setTint(0xffe066);
        });
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: { from: 0, to: 1 },
            repeat: -1,
            yoyo: true,
        });
    }

    addMiniCrosswordButton() {
        this.miniCrosswordButton = this.add
            .bitmapText(350, 450, "mario", "Mini-Crossword", 15)
            .setOrigin(0.5)
            .setTint(0xffe066)
         //   .setDropShadow(2, 3, 0x693600, 0.7);
        this.miniCrosswordButton.setInteractive();
        this.miniCrosswordButton.on("pointerdown", () => {
            //this.sound.add("move").play(); //maybe add sound effects when clicked?
            this.startMiniCrossword();
        });
        this.miniCrosswordButton.on("pointerover", () => {
            this.miniCrosswordButton.setTint(0x3e6875);
        });
        this.miniCrosswordButton.on("pointerout", () => {
            this.miniCrosswordButton.setTint(0xffe066);
        });
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: { from: 0, to: 1 },
            repeat: -1,
            yoyo: true,
        });
    }

    create()
    {
        this.background = this.add.tileSprite(this.center_width, this.center_height, 500, 800, 'background');

        this.title = this.add.image(window.innerWidth / 2, 100, 'title');

    //    const connections = this.add.image(500, 360, 'connections');
    //    const minicrossword = this.add.image(700, 360, 'minicrossword');
    //    const strands = this.add.image(500, 535, 'strands');
    //    const wordle = this.add.image(700, 535, 'wordle');

        this.addConnectionsButton();
        this.addWordleButton();
        this.addStrandsButton();
        this.addMiniCrosswordButton();

    /*   ship.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });
    
        ship.play('fly');

        this.tweens.add({
            targets: ship,
            y: 400,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });
    */
    }

    startConnections()
    {
        this.scene.start("Connections")
    }

    startWordle()
    {
        this.scene.start("Wordle")
    }

    startStrands()
    {
        this.scene.start("Strands")
    }

    startMiniCrossword()
    {
        this.scene.start("MiniCrossword")
    }

    update()
    {
       // this.background.tilePositionX += 2;
    }
}
/*
//end scene and switch to another
  finishScene() {
    this.theme.stop();
    this.playAudio("dead");
    this.registry.set("score", "" + this.score);
    this.scene.start("gameover");
  }
*/