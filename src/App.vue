<template>
  <v-app>
    <v-app-bar app color="secondary" dark>
      <div></div>
      <div class="d-flex justify-space-between m-3">
        <h2>Chat Rooms</h2>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex justify-space-between m-3">
        <portal-target name="header"></portal-target>
      </div>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
