new Vue({
    el: '#app',
    data: {
        userInput: '',        // Aktuelle Benutzereingabe
        chats: [],            // Liste aller Chats
        currentChatIndex: 0,  // Index des aktuell ausgewählten Chats
    },
    created() {
        // Lade Chats aus localStorage, falls vorhanden
        const savedChats = JSON.parse(localStorage.getItem('chats'));
        if (savedChats && savedChats.length > 0) {
            this.chats = savedChats;
        } else {
            this.startNewChat();
        }
    },
    computed: {
        // Der aktuell ausgewählte Chat
        currentChat() {
            return this.chats[this.currentChatIndex];
        }
    },
    methods: {
        // Startet einen neuen Chat
        startNewChat() {
            const newChat = {
                session_id: Math.random().toString(36).substr(2, 9),
                messages: [],
                title: 'Neuer Chat ' + (this.chats.length + 1)
            };
            this.chats.unshift(newChat);
            this.currentChatIndex = 0;

            // Nach dem Starten eines neuen Chats scrollen
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        // Lädt einen Chat aus der Historie
        loadChat(index) {
            this.currentChatIndex = index;

            // Nach dem Laden eines Chats scrollen
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        // Sendet eine Nachricht an das Backend
        sendMessage() {
            if (this.userInput.trim() === '') return;

            // Füge die Benutzer-Nachricht hinzu
            this.currentChat.messages.push({ sender: 'user', text: this.userInput });

            // Speichere die Eingabe und lösche das Eingabefeld
            let message = this.userInput;
            this.userInput = '';

            // Automatisches Scrollen nach dem Hinzufügen der Nachricht
            this.$nextTick(() => {
                this.scrollToBottom();
            });

            // Sende die Nachricht an das Backend
            fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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
                    // Füge die Bot-Antwort hinzu
                    this.currentChat.messages.push({ sender: 'bot', text: data.response });

                    // Automatisches Scrollen nach dem Hinzufügen der Bot-Antwort
                    this.$nextTick(() => {
                        this.scrollToBottom();
                    });
                }
            })
            .catch(error => {
                console.error('Fehler:', error);
            });
        },
        // Methode zum Löschen eines Chats
        deleteChat(index) {
            // Bestätigung vom Benutzer einholen
            if (confirm('Möchtest du diesen Chat wirklich löschen?')) {
                // Entferne den Chat aus dem chats-Array
                this.chats.splice(index, 1);
                
                // Aktualisiere currentChatIndex entsprechend
                if (this.currentChatIndex === index) {
                    if (this.chats.length > 0) {
                        // Wähle den ersten Chat aus
                        this.currentChatIndex = 0;
                    } else {
                        // Keine Chats mehr vorhanden, starte einen neuen Chat
                        this.startNewChat();
                    }
                } else if (this.currentChatIndex > index) {
                    // Passe den currentChatIndex an
                    this.currentChatIndex--;
                }
            }
        },
        // Methode zum automatischen Scrollen
        scrollToBottom() {
            if (this.$refs.messagesContainer) {
                const container = this.$refs.messagesContainer;
                container.scrollTop = container.scrollHeight;
            }
        }
    },
    watch: {
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
                // Speichere die Chats im localStorage
                localStorage.setItem('chats', JSON.stringify(this.chats));
            },
            deep: true
        }
    }
});