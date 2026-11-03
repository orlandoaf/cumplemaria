export class StateManager {
    constructor() {
        this.STORAGE_KEY = 'MARIA_PAULA_LEGADO_MAGIA_AUDITED_SAVE';
        this.defaultState = {
            currentChapter: 1,
            playerPosition: { x: 100, y: 400 },
            house: "Gryffindor",
            inventory: [],
            completedQuests: [],
            openedPresents: [],
            birthdayWishMade: false,
            hasTakenGroupPhoto: false
        };
        this.state = this.loadFromLocalStorage();
    }

    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    updatePosition(x, y) {
        this.state.playerPosition.x = x;
        this.state.playerPosition.y = y;
        this.saveToLocalStorage();
    }

    setChapter(chapterNumber) {
        this.state.currentChapter = chapterNumber;
        this.saveToLocalStorage();
    }

    addItem(itemId) {
        if (!this.state.inventory.includes(itemId)) {
            this.state.inventory.push(itemId);
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
        } catch (error) {
            console.error('Error en auditoría técnica - Fallo al guardar en localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            return savedData ? JSON.parse(savedData) : { ...this.defaultState };
        } catch (error) {
            console.error('Error en auditoría técnica - Fallo al cargar localStorage:', error);
            return { ...this.defaultState };
        }
    }
}

export const stateManager = new StateManager();
