import { appData, appComputed } from './data.js';
import { appMethods } from './methods.js';
import { appWatchers } from './watchers.js';

new Vue({
    el: '#app',
    data: appData,
    computed: appComputed,
    methods: appMethods,
    watch: appWatchers,
    created() {
        // Lade Chats aus localStorage, falls vorhanden
        const savedChats = JSON.parse(localStorage.getItem('chats'));
        if (savedChats && savedChats.length > 0) {
            this.chats = savedChats;
        } else {
            this.startNewChat();
        }
    }
});
