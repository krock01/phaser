export class MainSence extends Phaser.Scene {
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Input.Keyboard.CursorKeys;
    score: number = 0;
    scoreText: Phaser.GameObjects.Text;
    bombs: Phaser.GameObjects.Group;
    stars: Phaser.GameObjects.Group;
    gameOver = false;
    gameOverText: Phaser.GameObjects.Text;
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
        //this.add.image(400, 300, 'star');
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
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        // 这只y皱的重力
        this.player.setGravityY(300);
        this.player.setCollideWorldBounds(true);
        // 精灵的动作
        this.anims.create({
            key: 'left',
            // 这个动作由哪些帧组成
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            // 一秒10帧
            frameRate: 10,
            // 无限循环
            repeat: -1
        });
        //  正面的只有一个，所以这里只写了一个帧
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        // 添加精灵和地面组的碰撞检测,避免精灵穿过地面
        this.physics.add.collider(this.player, platforms);
        // 创建键盘事件监听
        this.cursors = this.input.keyboard.createCursorKeys();
        // 创建星星
        this.stars = this.physics.add.group({
            key: 'star',
            // 由于默认会生成一个，所以这里生成11个总共就会出现12个星星
            repeat: 11,
            // 设置星星的排列坐标，第一在（12，0）每次x轴方向间隔70
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (child) {
            // 设置回弹效果
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        }, this);
        // 增加星星和地面的碰撞检测
        this.physics.add.collider(this.stars, platforms);
        // 增减检测星星和精灵碰撞
        this.physics.add.overlap(this.player, this.stars, this.collectionStars, null, this);

        // 初始化记分板 设置坐标，初始化文字，字体设置
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        // 加入炸弹
        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, platforms);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        // 结束语
        this.gameOverText = this.add.text(260,260,'Game Over!!!',{fontSize:'48px', fill:'#ececec'}).setOrigin(0,0);
        this.gameOverText.setDepth(-1);
    }
    collectionStars(player: any, star: any) {
        // 设置星星为不可见状态
        star.disableBody(true, true);
        // 增加分数
        this.score += 10;
        // 更新记分板
        this.scoreText.setText('score: ' + this.score);
        // 判断星星是否收集完成
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            }, this);
            // 根据精灵的位置，随机出现一个炸弹
            const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            const bomb = this.bombs.create(x, 16, 'bomb');
            // 设置回弹
            bomb.setBounce(1);
            // 设置游戏的边界
            bomb.setCollideWorldBounds(true);
            // 随机-200,200之间速度
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            // 关闭重力
            bomb.allowGravity = false;
        }
    }
    hitBomb(player, bomb) {
        // 人物碰到炸弹后的事件
        // 停止游戏
        this.physics.pause();
        this.player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
        this.gameOverText.setDepth(1);
    }
    update() {
        // 精灵的动作
        if(!this.gameOver){
            if (this.cursors.left.isDown) {
                // 设置速度
                this.player.setVelocityX(-160);
                // 播放定义好的左侧跑动的动画
                this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);
    
                this.player.anims.play('right', true);
            }
            else {
                this.player.setVelocityX(0);
    
                this.player.anims.play('turn');
            }
            // 跳跃 判断条件:检测到按上方向键并且player的身体在他的下边缘碰撞
            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-480);
            }
        }
    }
}