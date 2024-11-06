export const appMethods = {
    startNewChat() {
        const newChat = {
            session_id: Math.random().toString(36).substr(2, 9),
            messages: [],
            title: 'Neuer Chat ' + (this.chats.length + 1)
        };
        this.chats.unshift(newChat);
        this.currentChatIndex = 0;
        this.$nextTick(() => {
            this.scrollToBottom();
        });
    },
    loadChat(index) {
        this.currentChatIndex = index;
        this.$nextTick(() => {
            this.scrollToBottom();
        });
    },
    sendMessage() {
        if (this.userInput.trim() === '') return;
        this.currentChat.messages.push({ sender: 'user', text: this.userInput });
        let message = this.userInput;
        this.userInput = '';
        this.$nextTick(() => {
            this.scrollToBottom();
        });

        fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: this.currentChat.session_id,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                this.currentChat.messages.push({ sender: 'bot', text: data.response });
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
        });
    },
    deleteChat(index) {
        if (confirm('Möchtest du diesen Chat wirklich löschen?')) {
            this.chats.splice(index, 1);
            if (this.currentChatIndex === index) {
                if (this.chats.length > 0) {
                    this.currentChatIndex = 0;
                } else {
                    this.startNewChat();
                }
            } else if (this.currentChatIndex > index) {
                this.currentChatIndex--;
            }
        }
    },
    scrollToBottom() {
        if (this.$refs.messagesContainer) {
            const container = this.$refs.messagesContainer;
            container.scrollTop = container.scrollHeight;
        }
    }
};
