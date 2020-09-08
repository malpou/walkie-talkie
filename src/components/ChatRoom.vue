<template>
  <main>
    <portal to="header"> Welcome to room: {{ chatId }} </portal>
    <user>
      <template #user="{ user }">
        <ul v-if="areThereMessages">
          <li v-for="message of messages" :key="message.id">
            <chat-message
              :message="message"
              :owner="user.uid === message.sender"
            />
          </li>
        </ul>

        <label for="message">
          Enter new text message{{
            areThereMessages ? "" : ", to start the chat"
          }}:
        </label>

        <v-text-field
          v-on:keyup.enter="addMessage(user.uid)"
          v-model="newMessageText"
          outlined
          filled
          dense
          append-icon="mdi-ballot-recount-outline"
          class="mr-"
        >
          <template v-slot:append>
            <v-btn
            :disabled="(!newMessageText && !newAudio) || loading"
            :loading="loading"
            color="success"
            type="text"
            class="mb-2"
            @click="addMessage(user.uid)"
          >
            Send
          </v-btn>
          </template>
        </v-text-field>


        <h5>Record Audio</h5>

        <div class="my-2">
          <v-btn color="error" v-if="!recorder" @click="record()">Record</v-btn>
          <v-btn color="error" v-else @click="stop()">Stop</v-btn>
        </div>

        <audio v-if="newAudio" :src="newAudioURL" controls></audio>
      </template>
    </user>
  </main>
</template>

<script>
import User from "./User";
import ChatMessage from "./ChatMessage";
import firebase from "firebase";
import { db, storage } from "../firebase";

export default {
  name: "ChatRoom",
  components: { User, ChatMessage },
  data() {
    return {
      newMessageText: "",
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
      return db.doc(`chats/${this.chatId}`).collection("messages");
    },
    newAudioURL() {
      return URL.createObjectURL(this.newAudio);
    },
    areThereMessages() {
      return this.messages.length !== 0;
    },
  },
  firestore() {
    return {
      messages: this.messagesCollection.orderBy("createdAt").limitToLast(5),
    };
  },
  methods: {
    async addMessage(uid) {
      if ((this.newMessageText || this.newAudio) && !this.loading) {
        this.loading = true;

        let audioURL = null;

        const { id: messageID } = this.messagesCollection.doc();

        if (this.newAudio) {
          const storageRef = storage
            .ref("chats")
            .child(this.chatId)
            .child(`${messageID}.wav`);

          await storageRef.put(this.newAudio);

          audioURL = await storageRef.getDownloadURL();
        }

        await this.messagesCollection.doc(messageID).set({
          text: this.newMessageText,
          sender: uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          audioURL,
        });

        this.loading = false;
        this.newMessageText = "";
        this.newAudio = null;
      }
    },
    async record() {
      this.newAudio = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const options = { mimeType: "audio/webm" };
      const recordedChunks = [];
      this.recorder = new MediaRecorder(stream, options);

      this.recorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });

      this.recorder.addEventListener("stop", () => {
        this.newAudio = new Blob(recordedChunks);
        console.log(this.newAudio);
      });

      this.recorder.start();
    },
    async stop() {
      this.recorder.stop();
      this.recorder = null;
    },
  },
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
