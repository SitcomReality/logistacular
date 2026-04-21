import { GameState } from './state.js';
import { GameEngine } from './engine.js';
import { Renderer } from './renderer.js';
import { UI } from './ui.js';
import { InputHandler } from './input.js';
import { audioManager } from './audio.js';
import { createIcons, icons } from 'lucide';

class App {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.initMenu();
        
        // Initialize audio on first interaction to comply with browser policies
        const initAudio = () => {
            audioManager.init();
            window.removeEventListener('mousedown', initAudio);
            window.removeEventListener('touchstart', initAudio);
        };
        window.addEventListener('mousedown', initAudio);
        window.addEventListener('touchstart', initAudio);

        createIcons({ icons });
    }

    initMenu() {
        const splash = document.getElementById('splash-screen');
        const app = document.getElementById('app');
        const btnContinue = document.getElementById('btn-continue');
        const btnNewGame = document.getElementById('btn-new-game');
        const warning = document.getElementById('new-game-warning');

        const hasSave = localStorage.getItem('factory-save') !== null;
        
        if (!hasSave) {
            btnContinue.style.display = 'none';
            warning.style.display = 'none';
        }

        btnContinue.onclick = () => {
            splash.style.display = 'none';
            app.style.display = 'flex';
            this.startGame();
        };

        btnNewGame.onclick = () => {
            if (hasSave) {
                localStorage.removeItem('factory-save');
                localStorage.removeItem('factory-state');
            }
            splash.style.display = 'none';
            app.style.display = 'flex';
            this.startGame();
        };
    }

    startGame() {
        this.state = new GameState();
        this.engine = new GameEngine(this.state);
        this.renderer = new Renderer(this.canvas, this.engine, this.state);
        this.ui = new UI(this.state, this.engine);
        this.input = new InputHandler(this.canvas, this.engine, this.state, this.renderer);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.loop();
    }

    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    loop() {
        this.engine.update();
        this.renderer.render();
        requestAnimationFrame(() => this.loop());
    }
}

new App();