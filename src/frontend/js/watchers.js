export const appWatchers = {
    'currentChat.messages': {
        handler() {
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        deep: true
    },
    chats: {
        handler() {
            localStorage.setItem('chats', JSON.stringify(this.chats));
        },
        deep: true
    }
};
