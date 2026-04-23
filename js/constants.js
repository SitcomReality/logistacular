export const MAP_SIZE = 50;
export const TILE_SIZE = 32;

export const BASE_RESOURCES = {
    bloodrock: { h: 5, s: 50, l: 30, sides: 3, label: 'Bloodrock' },
    tearshard: { h: 220, s: 50, l: 20, sides: 3, label: 'Tearshard' },
    snotstone: { h: 45, s: 50, l: 20, sides: 3, label: 'Snotstone' }
};

export const TOOLS = [
    { id: 'cursor', label: 'Select', icon: 'MousePointer2', tier: 0 },
    { id: 'miner', label: 'Miner', icon: 'Hammer', tier: 0 },
    { id: 'belt', label: 'Belt', icon: 'FastForward', tier: 0 },
    { id: 'deleter', label: 'Delete', icon: 'Trash2', tier: 0 },
    { id: 'screw-conveyor', label: 'Screw', icon: 'Activity', tier: 1 },
    { id: 'splitter', label: 'Splitter', icon: 'GitPullRequest', tier: 1 },
    { id: 'sand-processor', label: 'Polisher', icon: 'Sparkles', tier: 2 },
    { id: 'stitcher', label: 'Stitcher', icon: 'Scissors', tier: 3 },
    { id: 'blender', label: 'Blender', icon: 'Blend', tier: 4 },
    { id: 'hue-rotator', label: 'Prism', icon: 'RefreshCw', tier: 5 },
    { id: 'crystallizer', label: 'Apotheosis', icon: 'Gem', tier: 6 },
    { id: 'slot-machine', label: 'Sacrifice', icon: 'Coins', tier: 7 }
];

export const PROGRESSION_MILESTONES = [
    { tier: 0, condition: 'start', tutorial: 'Place Miners on resource tiles to extract materials. Connect them with Belts to move items.' },
    { tier: 1, condition: 'hasMiners', tutorial: 'Unlock Splitters to divide item flows and Screw Conveyors for faster transport.' },
    { tier: 2, condition: 'hasItems', tutorial: 'Polishers boost saturation and brightness. Feed them raw fragments to create vivid gems!' },
    { tier: 3, condition: 'hasPolished', tutorial: 'Stitchers combine two items into complex polygons. Higher sides = more valuable!' },
    { tier: 4, condition: 'hasStitched', tutorial: 'Blenders mix two different item types into vibrant hybrids. Experiment with combinations!' },
    { tier: 5, condition: 'hasBlended', tutorial: 'Prisms rotate hues across the color spectrum. Chain them for rainbow effects!' },
    { tier: 6, condition: 'hasPrismatic', tutorial: 'Apotheosis perfects items to maximum saturation. The ultimate refinement!' },
    { tier: 7, condition: 'hasCrystallized', tutorial: 'Sacrifice refined items for currency. The prettier the item, the bigger the reward!' }
];

export const DIRECTIONS = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
};