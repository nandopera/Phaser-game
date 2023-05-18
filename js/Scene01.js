class Scene01 extends Phaser.Scene{
    constructor(){
        super('Scene01')
    }
   
    create(){
        this.sky = this.add.image(0,0,'sky').setOrigin(0,0)
        this.sky.displayWidth = 1000
        this.sky.displayHeight = 600
        
        this.player = this.physics.add.sprite(50,500, 'player').setCollideWorldBounds(true).setScale(2.3).setBounce(0.3)
        this.player.canJump = true
        this.player.body.setSize(16,32)
        this.player.body.setOffset(10, 0);

            
        this.control = this.input.keyboard.createCursorKeys()

        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(0,600,'platformBase').setOrigin(0,1).refreshBody()
        /* this.platforms.create(0,600,'platform').setOrigin(0,1).setScale(2.5,1).refreshBody() */
        this.platforms.create(200,200,'platform')
        this.platforms.create(1100,200,'platform')
        this.platforms.create(1090,475,'platform')
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

            this.Spheres.children.iterate((c) => {
                c.setBounceY(Phaser.Math.FloatBetween(.2,.6))
                c.anims.play('upDown');
                c.body.setSize(20,35);
            })

            this.score = 0
            this.txtScore = this.add.text(15,15,`SCORE: ${this.score}`,{fontSize: `3rem`, fontFamily: `Impact`}).setShadow(0,0, `#000`, 2)
            .setScrollFactor(0)
            this.setScore()

            this.enemies = this.physics.add.group()
            let enemy = this.enemies.create(Phaser.Math.Between(50,950),0, `enemy`)
            .setBounce(1).setCollideWorldBounds(true).setVelocity(Math.random() < .5 ? -200 : 200, 50).setScale(2)

        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.enemies, this.enemyHit, null, this)
        this.physics.add.collider(this.player, this.platformBase)
        this.physics.add.collider(this.player, this.mPlatforms, this.platformMoveThings)
        this.physics.add.collider(this.Spheres, this.platforms)
        this.physics.add.collider(this.enemies, this.platforms)
        this.physics.add.collider(this.enemies, this.mPlatforms)
        this.physics.add.collider(this.Spheres, this.platformBase)
        this.physics.add.collider(this.Spheres, this.mPlatforms, this.platformMoveThings)
        this.physics.add.overlap(this.player, this.Spheres, this.collectSphere, null, this)


        this.physics.world.setBounds(0,0,1000,600)

        this.cameras.main.setBounds(0,0,1000,600).startFollow(this.player)
        this.gameOver = false
    }

    enemyHit(player, enemy){
        this.physics.pause()
        player.setTint(0xff3300)
        player.anims.stop()
        this.gameOver = true
    }    

    setScore(){
        this.txtScore.setText(this.score > 9 ? `SCORE: ${this.score}` : `SCORE: 0${this.score}`)
    }

    collectSphere(p, s){
        s.destroy()
        this.score++
        this.setScore()
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
        if(!this.gameOver){
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
}