import * as Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'

declare global {
    interface Window {
        game: Phaser.Game
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'app',
    title: 'Mission Control',
    version: '0.0.1',
    width: 1920,
    height: 1080,
    scene: [BootScene, PlayScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    disableContextMenu: true,
    resolution: window.devicePixelRatio
}

const game = new Phaser.Game(config)
window.game = game
