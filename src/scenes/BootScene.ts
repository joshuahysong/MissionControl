import { Scene } from 'phaser'

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  public preload() {
    this.load.setBaseURL('./../assets/');
    this.load.image('background', 'nebula.jpg');
    this.load.image('stars', 'stars.png');
    this.load.image('ship', 'rocket.png');
    this.load.atlas('space', 'space.png', 'space.json');
  }

  public create() {
    this.scene.start('PlayScene')
  }
}
