class Scene01 extends Phaser.Scene{
    constructor(){
        super('Scene01')
    }
    preload(){
        this.load.image('sky', 'assets/sky.png')
        this.load.image('platform', 'assets/platform.png')
        this.load.image('platformBase', 'assets/platformBase.png')
        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('sphere', 'assets/sphere.png', {frameWidth: 41, frameHeight: 41})
    }
    create(){
        this.sky = this.add.image(0,0,'sky').setOrigin(0,0)
        this.sky.displayWidth = 1000
        this.sky.displayHeight = 600
        
        this.player = this.physics.add.sprite(50,500, 'player').setCollideWorldBounds(true).setScale(3).setBounce(0.3)
        this.player.canJump = true

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }),
            frameRate: 6,
            repeat: -1
        })
        
        this.control = this.input.keyboard.createCursorKeys()

        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(0,600,'platformBase').setOrigin(0,1).refreshBody()
        /* this.platforms.create(0,600,'platform').setOrigin(0,1).setScale(2.5,1).refreshBody() */
        this.platforms.create(200,200,'platform')
        this.platforms.create(1100,200,'platform')
        this.platforms.create(1100,475,'platform')
        this.platforms.create(600,400,'platform').setScale(0.75,1).refreshBody()

        this.mPlatforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        })
        let mPlatform = this.mPlatforms.create(150,475,'platform').setScale(.25,1)
            mPlatform.speed = 2
            mPlatform.minX = 150
            mPlatform.maxX = 300

            mPlatform = this.mPlatforms.create(500,280,'platform').setScale(.25,1)
            mPlatform.speed = 1
            mPlatform.minX = 500
            mPlatform.maxX = 800

        this.Spheres = this.physics.add.group({
            key: 'sphere',
            repeat: 14,
            setXY: {
                x: 12,
                y: 10,
                stepX: 70
            }
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

            this.Spheres.children.iterate((c) => {
                c.setBounceY(Phaser.Math.FloatBetween(.2,.6))
                c.anims.play('upDown')
            })

        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.platformBase)
        this.physics.add.collider(this.player, this.mPlatforms, this.platformMoveThings)
        this.physics.add.collider(this.Spheres, this.platforms)
        this.physics.add.collider(this.Spheres, this.platformBase)
        /* this.physics.add.collider(this.Spheres, this.player) */
        this.physics.add.collider(this.Spheres, this.mPlatforms, this.platformMoveThings)

        this.physics.world.setBounds(0,0,1000,600)
        this.cameras.main.setBounds(0,0,1000,600).startFollow(this.player)
    }

    movePlatform(p){
        if(p.x < p.minX || p.x > p.maxX){
            p.speed *= -1
        }
        p.x += p.speed
    }

    platformMoveThings(sprite,plat){
        sprite.x += plat.speed
    }

    update(){
        if(this.control.left.isDown){
            this.player.flipX = true
            this.player.anims.play('walk', true)
            this.player.setVelocityX(-150)
        } else
        if(this.control.right.isDown){
            this.player.flipX = false
            this.player.anims.play('walk', true)
            this.player.setVelocityX(150)
        } else {
            this.player.setVelocityX(0).setFrame(0)
        }

        if(!this.player.body.touching.down){
            this.player.setFrame(
                this.player.body.velocity.y < 0 ? 1 : 4
            )
        }

        if(this.control.up.isDown && this.player.canJump && this.player.body.touching.down){
            this.player.setVelocityY(-500)
            this.player.canJump = false
        }
        if(!this.control.up.isDown && !this.player.canJump && this.player.body.touching.down){
            this.player.canJump = true
        }

        this.mPlatforms.children.iterate((plat) => {
            this.movePlatform(plat)
        })
    }
}