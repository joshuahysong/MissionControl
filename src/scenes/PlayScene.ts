import { Scene } from 'phaser'

export default class PlayScene extends Scene {
    constructor() {
        super({ key: 'PlayScene' })
    }
    
    private bg: Phaser.GameObjects.TileSprite;
    private stars: Phaser.GameObjects.TileSprite;
    private ship: Phaser.Physics.Arcade.Image;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    public create() {
        this.bg = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'background').setOrigin(0).setScrollFactor(0);

        let galaxy = this.add.image(5345 + 1024, 327 + 1024, 'space', 'galaxy').setBlendMode(1).setScrollFactor(0.6);

        this.add.image(512, 680, 'space', 'blue-planet').setOrigin(0).setScrollFactor(0.6);
        this.add.image(2833, 1246, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6);
        this.add.image(3875, 531, 'space', 'sun').setOrigin(0).setScrollFactor(0.6);
        this.add.image(908, 3922, 'space', 'gas-giant').setOrigin(0).setScrollFactor(0.6);
        this.add.image(3140, 2974, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6).setScale(0.8).setTint(0x882d2d);
        this.add.image(6052, 4280, 'space', 'purple-planet').setOrigin(0).setScrollFactor(0.6);

        for (let i = 0; i < 8; i++)
        {
            this.add.image(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'space', 'eyes').setBlendMode(1).setScrollFactor(0.8);
        }

        this.stars = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight, 'stars').setScrollFactor(0);

        let particles = this.add.particles('space');

        this.emitter = particles.createEmitter({
            on: false,
            frame: 'yellow',
            lifespan: 750,
            angle: {
                onEmit: (particle: Phaser.GameObjects.Particles.Particle, key: string, value: number) => {
                    let v = Phaser.Math.Between(-5, 5);
                    return (this.ship.angle - 180) + v;
                } 
            },
            alpha: 0.85,
            scale: { start: 0.6, end: 0 },
            blendMode: 'ADD',
            speed: {
                onEmit: () => {
                    return (750 - (<Phaser.Physics.Arcade.Body>this.ship.body).speed);
                }
            }
        });        

        this.ship = this.physics.add.image(4000, 3000, 'ship').setDepth(2);
        this.ship.displayWidth = 128;
        this.ship.scaleY = this.ship.scaleX;
        this.ship.setDrag(0);
        this.ship.setAngularDrag(400);
        (<Phaser.Physics.Arcade.Body>this.ship.body).setMaxSpeed(600);

        this.emitter.startFollow(this.ship);

        this.cameras.main.startFollow(this.ship);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.tweens.add({
            targets: galaxy,
            angle: 360,
            duration: 100000,
            ease: 'Linear',
            loop: -1
        });
    }

    public update() {        
        let point = new Phaser.Geom.Point(-40, 0);
        Phaser.Math.RotateAround(point, 0, 0, this.ship.rotation);
        this.emitter.followOffset = new Phaser.Math.Vector2(point.x, point.y);
        if (this.cursors.left.isDown)
        {
            this.ship.setAngularVelocity(-150);
        }
        else if (this.cursors.right.isDown)
        {
            this.ship.setAngularVelocity(150);
        }
        else
        {
            this.ship.setAngularVelocity(0);
        }

        if (this.cursors.up.isDown)
        {
            this.emitter.on = true;
            this.physics.velocityFromRotation(this.ship.rotation, 600, (<Phaser.Physics.Arcade.Body>this.ship.body).acceleration);
        }
        else
        {
            this.emitter.on = false;
            this.ship.setAcceleration(0);
        }

        this.bg.tilePositionX += this.ship.body.deltaX() * 0.5;
        this.bg.tilePositionY += this.ship.body.deltaY() * 0.5;

        this.stars.tilePositionX += this.ship.body.deltaX() * 2;
        this.stars.tilePositionY += this.ship.body.deltaY() * 2;
    }
}
