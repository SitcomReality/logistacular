import { MAP_SIZE } from './constants.js';
import { generateTerrain, generateMap } from './engine/terrain.js';
import { updateItemMovement } from './engine/item-logic.js';
import { processEntity } from './engine/entity-logic.js';
import { getInitialEntityState } from './engine/entity-factory.js';

export class GameEngine {
    constructor(state) {
        this.state = state;
        this.tiles = [];
        this.entities = [];
        this.items = [];
        this.tick = 0;
        this.notifications = [];
        this.shakeRequest = 0;
        
        this.load();
        this.initAutoSave();
    }

    initAutoSave() {
        setInterval(() => this.save(), 5000);
    }

    load() {
        const saved = localStorage.getItem('factory-save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.tiles = data.tiles || [];
                this.terrain = data.terrain || generateTerrain();
                this.entities = (data.entities || []).filter(e => e !== null);
                this.items = data.items || [];
                
                // Safety migration: Ensure essential state exists for complex buildings
                this.entities.forEach(e => {
                    if (!e.state) e.state = {};
                });
                
                return;
            } catch (e) {
                console.error("Failed to parse save data", e);
            }
        }
        this.terrain = generateTerrain();
        this.tiles = generateMap(this.terrain);
    }

    save() {
        localStorage.setItem('factory-save', JSON.stringify({
            tiles: this.tiles,
            terrain: this.terrain,
            entities: this.entities,
            items: this.items
        }));
    }

    canPlace(x, y, w, h) {
        if (x < 0 || y < 0 || x + w > MAP_SIZE || y + h > MAP_SIZE) return false;
        for (let e of this.entities) {
            if (x < e.x + e.width && x + w > e.x && y < e.y + e.height && y + h > e.y) return false;
        }
        return true;
    }

    addEntity(type, x, y, dir) {
        const { w, h, config } = getInitialEntityState(type, dir);
        
        if (this.canPlace(x, y, w, h)) {
            this.entities.push({ 
                id: Math.random().toString(36).substr(2, 9), 
                type, x, y, width: w, height: h, dir, 
                state: config 
            });
            return true;
        }
        return false;
    }

    removeEntity(x, y) {
        const idx = this.entities.findIndex(e => x >= e.x && x < e.x + e.width && y >= e.y && y < e.y + e.height);
        if (idx !== -1) {
            const e = this.entities[idx];
            this.entities.splice(idx, 1);
            this.items = this.items.filter(item => !(item.x >= e.x && item.x < e.x + e.width && item.y >= e.y && item.y < e.y + e.height));
            return true;
        }
        return false;
    }

    getEntityAt(x, y) {
        return this.entities.find(e => x >= e.x && x < e.x + e.width && y >= e.y && y < e.y + e.height);
    }

    triggerShake(amount) {
        this.shakeRequest = Math.max(this.shakeRequest, amount);
    }

    update() {
        this.tick++;
        this.notifications = this.notifications.filter(n => {
            n.life--;
            n.y -= 0.5;
            return n.life > 0;
        });

        updateItemMovement(this);

        for (let e of this.entities) {
            processEntity(this, e);
        }

        this.checkProgression();
    }

    checkProgression() {
        // Check for progression milestones
        if (!this.state.achievements.hasMiners && this.entities.some(e => e.type === 'miner')) {
            this.state.setAchievement('hasMiners');
            this.state.unlockTier(1);
        }

        if (!this.state.achievements.hasItems && this.items.length > 0) {
            this.state.setAchievement('hasItems');
            this.state.unlockTier(2);
        }

        if (!this.state.achievements.hasPolished && this.items.some(i => i.s > 60)) {
            this.state.setAchievement('hasPolished');
            this.state.unlockTier(3);
        }

        if (!this.state.achievements.hasStitched && this.items.some(i => i.sides >= 4)) {
            this.state.setAchievement('hasStitched');
            this.state.unlockTier(4);
        }

        if (!this.state.achievements.hasBlended && this.items.some(i => i.type === 'mystic')) {
            this.state.setAchievement('hasBlended');
            this.state.unlockTier(5);
        }

        if (!this.state.achievements.hasPrismatic && this.items.some(i => i.s > 80 && i.sides >= 6)) {
            this.state.setAchievement('hasPrismatic');
            this.state.unlockTier(6);
        }

        if (!this.state.achievements.hasCrystallized && this.items.some(i => i.s === 100)) {
            this.state.setAchievement('hasCrystallized');
            this.state.unlockTier(7);
        }
    }

    changeBeltDir(e, dir) {
        if (e.dir !== dir) {
            const oldDir = e.dir;
            e.dir = dir;
            
            // Handle multi-tile building rotations (Swap width/height if needed for non-square)
            if (e.type === 'stitcher' || e.type === 'screw-conveyor') {
                [e.width, e.height] = [e.height, e.width];
            }

            for (const item of this.items) {
                if (item.x >= e.x && item.x < e.x + e.width && item.y >= e.y && item.y < e.y + e.height) {
                    item.outDir = undefined;
                }
            }
        }
    }
}