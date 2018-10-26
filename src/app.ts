/// <reference path="../typing/phaser.d.ts" /> 
import {MainSence} from './sences/mainSence';
class App {
    constructor(){
        this.start();
    }
    start(){
        new Phaser.Game(
            {
                type:Phaser.AUTO,
                width:800,
                height:600,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 300 },
                        debug: false
                    }
                },
                scene:[
                    MainSence
                ]
            }
        )
    }
}
new App();