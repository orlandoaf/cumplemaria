import { stateManager } from '../core/StateManager.js';
import { ITEMS_DATABASE } from '../data/items.js';

export class InventoryManager {
    constructor() {
        this.items = stateManager.getState().inventory || [];
    }

    addItem(itemId) {
        if (ITEMS_DATABASE[itemId] && !this.items.includes(itemId)) {
            this.items.push(itemId);
            stateManager.addItem(itemId);
            return true;
        }
        return false;
    }

    hasItem(itemId) {
        return this.items.includes(itemId);
    }

    getInventoryDetails() {
        return this.items.map(id => ITEMS_DATABASE[id]).filter(Boolean);
    }
}
