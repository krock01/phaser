/// <reference path="../typing/phaser.d.ts" /> 
class App {
    constructor(){
        this.start();
    }
    start(){
        new Phaser.Game(
            {
                width:200,
                height:200
            }
        )
    }
}
new App();