<template>
    <main>
        <h3>Welcome to room: {{ chatId }}</h3>
        <user>
            <template #user="{ user }">
                <ul v-if="messages.length !== 0">
                    <li v-for="message of messages" :key="message.id">
                        <chat-message 
                            :message="message"
                            :owner="user.uid === message.sender"
                        />
                    </li>
                </ul>

                <label v-if="messages.length === 0" for="message">Enter new text message to start the chat:</label>
                <input v-model="newMessageText" class="input" />
                <hr>
                <h5>Record Audio</h5>

                <button v-if="!recorder" @click="record()" class="button">Record</button>
                <button v-else @click="stop()" class="button">Stop</button>

                <audio v-if="newAudio" :src="newAudioURL" controls></audio>

                <hr>
                <button 
                    :disabled="(!newMessageText && !newAudio) || loading"
                    class="button"
                    :class="{ 'is-loading': loading }"
                    type="text"
                    @click="addMessage(user.uid)">
                    Send
                </button>

            </template>
        </user>
    </main>
</template>

<script>
import User from './User';
import ChatMessage from './ChatMessage'
import firebase from 'firebase';
import { db, storage } from '../firebase';

export default {
    name: "ChatRoom",
    components: { User, ChatMessage },
    data() {
        return {
            newMessageText: '',
            loading: false,
            messages: [],
            newAudio: null,
            recorder: null,
        };
    },
    computed: {
        chatId() {
            return this.$route.params.id;
        },
        messagesCollection() {
            return db.doc(`chats/${this.chatId}`).collection('messages');
        },
        newAudioURL() {
            return URL.createObjectURL(this.newAudio)
        }
    },
    firestore() {
        return {
            messages: this.messagesCollection.orderBy('createdAt').limitToLast(10)
        };
    },
    methods: {
        async addMessage(uid) {
            this.loading = true;

            let audioURL = null;

            const { id: messageID } = this.messagesCollection.doc();

            if (this.newAudio) {
                const storageRef = storage
                    .ref('chats')
                    .child(this.chatId)
                    .child(`${messageID}.wav`);

                await storageRef.put(this.newAudio);

                audioURL = await storageRef.getDownloadURL();
            }


            await this.messagesCollection.doc(messageID).set({
                text: this.newMessageText,
                sender: uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                audioURL
            });

            this.loading = false;
            this.newMessageText = '';
            this.newAudio = null;
        },
        async record() {
            this.newAudio = null;

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });

            const options = { mimeType: "audio/webm" };
            const recordedChunks = [];
            this.recorder = new MediaRecorder(stream, options);

            this.recorder.addEventListener("dataavailable", e => {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            });

            this.recorder.addEventListener("stop", () => {
                this.newAudio = new Blob(recordedChunks);
                console.log(this.newAudio)
            });

            this.recorder.start();
        },
        async stop() {
            this.recorder.stop();
            this.recorder = null;
        }
    }
};
</script>

<style scoped>
ul {
    list-style-type: none;
    margin: 0;
    pad: 0;
    display: flex;
    flex-direction: column;
    min-width: 500px;
    background: #ffffff;
    padding: 10px;
    border-radius: 0;
}

li {
    display: flex;
}

audio {
    outline: none;
}
</style>