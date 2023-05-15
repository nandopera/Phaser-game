let game
window.onload = function(){
    const config = {
        type: Phaser.CANVAS,
        pixelArt: true,
        width: 800,
        height: 600,
        scene: [Scene01],
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y:1000}
            }
        }
    }
    game = new Phaser.Game(config)
}