export const appData = {
    userInput: '',        // Aktuelle Benutzereingabe
    chats: [],            // Liste aller Chats
    currentChatIndex: 0   // Index des aktuell ausgewählten Chats
};

export const appComputed = {
    // Der aktuell ausgewählte Chat
    currentChat() {
        return this.chats[this.currentChatIndex];
    }
};
