import { stateManager } from '../core/StateManager.js';
import { QUESTS_DATABASE } from '../data/quests.js';

export class QuestManager {
    constructor() {
        this.completedQuests = stateManager.getState().completedQuests || [];
        this.activeQuests = ['QUEST_CH1'];
    }

    startQuest(questId) {
        if (QUESTS_DATABASE[questId] && !this.activeQuests.includes(questId) && !this.completedQuests.includes(questId)) {
            this.activeQuests.push(questId);
        }
    }

    completeQuest(questId) {
        const index = this.activeQuests.indexOf(questId);
        if (index !== -1) {
            this.activeQuests.splice(index, 1);
        }
        if (!this.completedQuests.includes(questId)) {
            this.completedQuests.push(questId);
            stateManager.state.completedQuests = this.completedQuests;
            stateManager.saveToLocalStorage();
        }
    }

    isCompleted(questId) {
        return this.completedQuests.includes(questId);
    }

    getActiveQuests() {
        return this.activeQuests.map(id => QUESTS_DATABASE[id]).filter(Boolean);
    }
}
