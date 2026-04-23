import { TOOLS, PROGRESSION_MILESTONES } from './constants.js';
import { audioManager } from './audio.js';
import { createIcons, icons } from 'lucide';

export class UI {
    constructor(state, engine) {
        this.state = state;
        this.engine = engine;
        this.initTools();
        this.initDirections();
        this.bindEvents();
        
        this.state.subscribe(() => this.updateHUD());
        this.updateHUD();
    }

    initTools() {
        const container = document.getElementById('tool-buttons');
        container.innerHTML = '';
        TOOLS.forEach(tool => {
            const btn = document.createElement('button');
            btn.className = `tool-btn ${this.state.selectedTool === tool.id ? 'active' : ''}`;
            btn.dataset.tier = tool.tier;
            btn.dataset.toolId = tool.id;
            // Convert PascalCase to kebab-case robustly for lucide
            const kebabIcon = tool.icon
                .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
                .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
                .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
                .toLowerCase();
            btn.innerHTML = `<i data-lucide="${kebabIcon}"></i><span>${tool.label}</span>`;
            btn.onclick = () => {
                if (tool.tier <= this.state.unlockedTier) {
                    this.state.setTool(tool.id);
                    audioManager.play('click', 0.2);
                }
            };
            container.appendChild(btn);
        });
        
        // Re-run createIcons to pick up newly added tool icons and direction icons
        createIcons({ icons });
    }


    initDirections() {
        const btns = document.querySelectorAll('.dir-btn');
        btns.forEach(btn => {
            btn.onclick = () => {
                this.state.setDirection(btn.dataset.dir);
                audioManager.play('click', 0.2);
            };
        });
    }

    bindEvents() {
        this.state.subscribe((s) => {
            document.querySelectorAll('.tool-btn').forEach((btn) => {
                const tool = TOOLS.find(t => t.id === btn.dataset.toolId);
                if (tool) {
                    const isUnlocked = tool.tier <= s.unlockedTier;
                    const isNew = s.newUnlocks.includes(tool.tier);
                    btn.classList.toggle('active', tool.id === s.selectedTool);
                    btn.classList.toggle('locked', !isUnlocked);
                    btn.classList.toggle('new-unlock', isNew);
                }
            });
            document.querySelectorAll('.dir-btn').forEach(btn => {
                const isActive = parseInt(btn.dataset.dir) === s.direction;
                btn.classList.toggle('active', isActive);
            });
        });
    }

    updateHUD() {
        document.getElementById('currency-value').innerText = Math.floor(this.state.currency);
        this.updateSelectionPanel();
        this.updateTutorial();
    }

    updateTutorial() {
        const container = document.querySelector('.tutorial-box');
        if (!container) return;

        const currentMilestone = PROGRESSION_MILESTONES[this.state.unlockedTier];
        if (!currentMilestone) return;

        container.innerHTML = `
            <div class="tutorial-header panel-header ${this.state.newUnlocks.length > 0 ? 'pulse-text' : ''}">OBJECTIVE [TIER ${this.state.unlockedTier}]</div>
            <div class="inner-panel">
                <p>${currentMilestone.tutorial}</p>
            </div>
        `;

        if (this.state.newUnlocks.length > 0) {
            setTimeout(() => this.state.clearNewUnlocks(), 3000);
        }
    }

    updateSelectionPanel() {
        const container = document.getElementById('selection-details');
        if (!container) return;

        const id = this.state.selectedEntityId;
        if (!id) {
            container.innerHTML = '<div class="empty-selection">No item selected</div>';
            return;
        }

        const entity = this.engine.entities.find(e => e.id === id);
        if (!entity) {
            container.innerHTML = '<div class="empty-selection">No item selected</div>';
            return;
        }

        const tool = TOOLS.find(t => t.id === entity.type);
        const label = tool ? tool.label : entity.type;

        container.innerHTML = `
            <div class="selection-title">${label}</div>
            <div class="selection-row">
                <span>Position</span>
                <span class="accent">[${entity.x}, ${entity.y}]</span>
            </div>
            <div class="selection-row">
                <span>Dimensions</span>
                <span class="accent">${entity.width} × ${entity.height}</span>
            </div>
            <div class="selection-row" style="margin-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 8px;">
                <span>ID</span>
                <span style="font-size: 10px; opacity: 0.7;">${entity.id}</span>
            </div>
        `;
    }
}