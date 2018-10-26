export class MainSence extends Phaser.Scene {
    constructor() {
        super({
            key: "main"
        });
    }
    preload() {
        this.load.image('sky', '../assets/images/sky.png');
        this.load.image('ground', '../assets/images/platform.png');
        this.load.image('star', '../assets/images/star.png');
        this.load.image('bomb', '../assets/images/bomb.png');
        this.load.spritesheet('dude',
            '../assets/images/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        console.log('preload');
    }
    create() {
        // 第一种方法
        // 这里的400,300是地图的x，y坐标,左上角是0，0
        this.add.image(400, 300, 'sky');
        // 第二种方法
        // phaser3默认以图片的中心为中心点
        // const skyImage = this.add.image(0,0,'sky');
        // 如果只使用上面的代码，只显示了1/4，这就时因为图片的中心点显示在画布的0，0坐标的结果
        // skyImage.setOrigin(0,0);
        // 修改图片的原点为0,0后图片就会显示全
        this.add.image(400, 300, 'star');
        // 应注意图片的加载顺序,如果先加载star sky就会盖住star

        // 使用物理引擎创建地面,物理物体分为动态和静态
        // 他们的区别是动态的可以有速度和重力，碰到后会影响到位置等，
        // 而静态的只有位置和尺寸，碰撞后不发生移动
        // group分组即是把一类相同或者相似的对象放在一个数组中，方便统一操作
        const platforms = this.physics.add.staticGroup();
        // setScale缩放,refreshBody()用来告诉物理引擎我们对静态的物理物体做了改变
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        // 创建player
        const player = this.physics.add.sprite(100,450,'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        // 精灵的动作
        this.anims.create({
            key:'left',
            frames:this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate:10,
            repeat:-1
        });
        this.anims.create({
            key:'turn',
            frames:[ { key: 'dude', frame: 4 } ],
            frameRate:20
        });
        this.anims.create({
            key:'right',
            frames:this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate:10,
            repeat:-1
        });

    }
}