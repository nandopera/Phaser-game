class Preload extends Phaser.Scene{
    constructor(){
        super(`Preload`)
    }

     preload(){
        this.load.image('sky', 'assets/sky.png')
        this.load.image('platform', 'assets/platform.png')
        this.load.image('platformBase', 'assets/platformBase.png')
        this.load.image('enemy', 'assets/enemy.png')
        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('sphere', 'assets/sphere.png', {frameWidth: 41, frameHeight: 41})
    }

    create(){
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
                key: 'upDown',
                frames: this.anims.generateFrameNumbers('sphere',{
                    start: 0,
                    end: 5
                }),
                frameRate: 6,
                repeat: -1
            })
        this.scene.start(`Scene01`)
    }
}