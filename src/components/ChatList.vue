<template>
  <v-content>
    <v-card class="mx-auto" max-width="300" tile>
      <v-list flat>
        <v-subheader><v-btn text large color="primary" @click="createChatRoom()"
        >Create New Chat Room</v-btn
      ></v-subheader>
        <v-list-item-group v-model="chats" color="primary">
          <v-list-item v-for="chat in chats" :key="chat.id">
            <v-list-item-content @click="$router.push(`chats/${chat.id}`)">
              <v-list-item-title>
                    {{ chat.id }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-content>
</template>

<script>
import firebase from "firebase";
import { db } from "../firebase";

export default {
  data() {
    return {
      chats: [],
    };
  },
  firestore() {
    return {
      chats: db
        .collection("chats")
        .where("owner", "==", this.uid)
        .orderBy("createdAt"),
    };
  },
  methods: {
    async createChatRoom() {
      const newChat = await db.collection("chats").add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        owner: this.uid,
        members: [this.uid],
      });
      console.log(newChat);
    },
  },
  props: ["uid"],
};
</script>
