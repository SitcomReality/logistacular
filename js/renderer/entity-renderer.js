import { TILE_SIZE } from '../constants.js';
import { particleManager } from './particles.js';

// removed function drawGear() {}
// removed function drawPiston() {}
// removed function drawDrum() {}
// removed function drawChevron() {}
// removed function drawMachineIndicator() {}
// removed function drawSteamVent() {}
// removed function drawArcLightning() {}

import { drawBeltLike, drawMiner, drawScrewConveyor } from './entities/logistics.js';
import { 
    drawSandProcessor, drawBlender, drawStitcher, 
    drawHueRotator, drawCrystallizer, drawSlotMachine 
} from './entities/production.js';

export function drawEntity(ctx, engine, state, e) {
    if (!e) return;
    ctx.save();
    ctx.translate(e.x * TILE_SIZE, e.y * TILE_SIZE);

    if (e.id === state.selectedEntityId) {
        const ew = e.width * TILE_SIZE;
        const eh = e.height * TILE_SIZE;
        
        ctx.save();
        ctx.strokeStyle = '#66FCF1';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#66FCF1';
        ctx.shadowBlur = 10;
        
        // Draw corner brackets instead of a full box
        const len = 8 + Math.sin(engine.tick * 0.1) * 2;
        ctx.beginPath();
        // TL
        ctx.moveTo(0, len); ctx.lineTo(0, 0); ctx.lineTo(len, 0);
        // TR
        ctx.moveTo(ew - len, 0); ctx.lineTo(ew, 0); ctx.lineTo(ew, len);
        // BR
        ctx.moveTo(ew, eh - len); ctx.lineTo(ew, eh); ctx.lineTo(ew - len, eh);
        // BL
        ctx.moveTo(len, eh); ctx.lineTo(0, eh); ctx.lineTo(0, eh - len);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(102, 252, 241, 0.1)';
        ctx.fillRect(0, 0, ew, eh);
        ctx.restore();
    }

    switch (e.type) {
        case 'belt':
        case 'splitter':       drawBeltLike(ctx, engine, e); break;
        case 'screw-conveyor': drawScrewConveyor(ctx, engine, e); break;
        case 'miner':          drawMiner(ctx, engine, e); break;
        case 'sand-processor': drawSandProcessor(ctx, engine, e); break;
        case 'blender':        drawBlender(ctx, engine, e); break;
        case 'stitcher':       drawStitcher(ctx, engine, e); break;
        case 'hue-rotator':    drawHueRotator(ctx, engine, e); break;
        case 'crystallizer':   drawCrystallizer(ctx, engine, e); break;
        case 'slot-machine':   drawSlotMachine(ctx, engine, e); break;
        default:
            ctx.fillStyle = '#1A252F';
            ctx.fillRect(2, 2, e.width * TILE_SIZE - 4, e.height * TILE_SIZE - 4);
    }

    ctx.restore();
}