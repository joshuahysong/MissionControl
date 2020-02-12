import { Scene } from 'phaser'
import { Constants } from './../constants';

export default class PlayScene extends Scene {
    constructor() {
        super({ key: 'PlayScene' })
    }
    
    private bg: Phaser.GameObjects.TileSprite;
    private stars: Phaser.GameObjects.TileSprite;
    private ship: Phaser.Physics.Arcade.Image;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private mainEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private portEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private starboardEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private missioncontrol: Phaser.GameObjects.Sprite;

    public create() {
        this.bg = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'background').setOrigin(0).setScrollFactor(0);

        let galaxy = this.add.image(5345 + 1024, 327 + 1024, 'space', 'galaxy').setBlendMode(1).setScrollFactor(0.6);

        for (let i = 0; i < 8; i++)
        {
            this.add.image(Phaser.Math.Between(0, Constants.worldSizeX), Phaser.Math.Between(0, Constants.worldSizeY), 'space', 'eyes').setBlendMode(1).setScrollFactor(0.55);
        }

        this.add.image(1100, 900, 'space', 'blue-planet').setOrigin(0).setScrollFactor(0.8);
        this.add.image(2833, 1246, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6);
        this.add.image(3875, 531, 'space', 'sun').setOrigin(0).setScrollFactor(0.6);
        this.add.image(908, 3922, 'space', 'gas-giant').setOrigin(0).setScrollFactor(0.6);
        this.add.image(3140, 2974, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6).setScale(0.8).setTint(0x882d2d);
        this.add.image(6052, 4280, 'space', 'purple-planet').setOrigin(0).setScrollFactor(0.6);

        this.stars = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight, 'stars').setScrollFactor(0);
        this.missioncontrol = this.add.sprite(Constants.worldSizeX / 2 + 200, Constants.worldSizeY / 2, 'missioncontrol');
        this.missioncontrol.setScale(0.5);

        let particles = this.add.particles('space');
        this.mainEmitter = particles.createEmitter({
            on: false,
            frame: 'yellow',
            lifespan: 600,
            angle: {
                onEmit: () => {
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
        let thrustEmitterConfig = {
            on: false,
            frame: 'smoke',
            lifespan: 200,
            alpha: 0.85,
            scale: { start: 0.1, end: 0 },
            blendMode: 'ADD',
            speedX: {
                onEmit: () => {
                    return (<Phaser.Physics.Arcade.Body>this.ship.body).velocity.x * 1.05;
                } 
            },
            speedY: {
                onEmit: () => {
                    return (<Phaser.Physics.Arcade.Body>this.ship.body).velocity.y * 1.05;
                } 
            }
        }
        this.portEmitter = particles.createEmitter(thrustEmitterConfig);
        this.starboardEmitter = particles.createEmitter(thrustEmitterConfig);  

        this.ship = this.physics.add.image(Constants.worldSizeX / 2, Constants.worldSizeY / 2, 'ship').setDepth(2);
        this.ship.displayWidth = 128;
        this.ship.scaleY = this.ship.scaleX;
        this.ship.setDrag(0);
        this.ship.setAngularDrag(400);
        this.ship.rotation = -Math.PI / 2;
        (<Phaser.Physics.Arcade.Body>this.ship.body).setMaxSpeed(600);

        this.mainEmitter.startFollow(this.ship);
        this.portEmitter.startFollow(this.ship);
        this.starboardEmitter.startFollow(this.ship);
        this.cameras.main.startFollow(this.ship);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.tweens.add({
            targets: this.missioncontrol,
            angle: 360,
            duration: 100000,
            ease: 'Linear',
            loop: -1
        });
        this.tweens.add({
            targets: galaxy,
            angle: 360,
            duration: 100000,
            ease: 'Linear',
            loop: -1
        });
    }

    public update() {
        let mainEmitterPoint = new Phaser.Geom.Point(-40, 0);
        Phaser.Math.RotateAround(mainEmitterPoint, 0, 0, this.ship.rotation);
        this.mainEmitter.followOffset = new Phaser.Math.Vector2(mainEmitterPoint.x, mainEmitterPoint.y);

        let portEmitterPoint = new Phaser.Geom.Point(40, -8);
        Phaser.Math.RotateAround(portEmitterPoint, 0, 0, this.ship.rotation);
        this.portEmitter.followOffset = new Phaser.Math.Vector2(portEmitterPoint.x, portEmitterPoint.y);

        let starboardEmitterPoint = new Phaser.Geom.Point(40, 8);
        Phaser.Math.RotateAround(starboardEmitterPoint, 0, 0, this.ship.rotation);
        this.starboardEmitter.followOffset = new Phaser.Math.Vector2(starboardEmitterPoint.x, starboardEmitterPoint.y);

        if (this.cursors.left.isDown)
        {
            this.starboardEmitter.on = true;
            this.ship.setAngularVelocity(-150);
        }
        else if (this.cursors.right.isDown)
        {
            this.portEmitter.on = true;
            this.ship.setAngularVelocity(150);
        }
        else
        {
            this.portEmitter.on = false;
            this.starboardEmitter.on = false;
            this.ship.setAngularVelocity(0);
        }

        if (this.cursors.up.isDown)
        {
            this.mainEmitter.on = true;
            this.physics.velocityFromRotation(this.ship.rotation, 600, (<Phaser.Physics.Arcade.Body>this.ship.body).acceleration);
        }
        else
        {
            this.mainEmitter.on = false;
            this.ship.setAcceleration(0);
        }

        this.bg.tilePositionX += this.ship.body.deltaX() * 0.5;
        this.bg.tilePositionY += this.ship.body.deltaY() * 0.5;

        this.stars.tilePositionX += this.ship.body.deltaX() * 2;
        this.stars.tilePositionY += this.ship.body.deltaY() * 2;
    }
}
