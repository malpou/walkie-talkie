<template>
  <div>
    <portal to="header">
      <div class="m-2">
        Logged in as {{ user.uid }}
        <i class="fas fa-sign-out-alt" @click="auth.signOut()"></i>
      </div>
    </portal>
  </div>
</template>

<script>
import { auth } from "../firebase";

export default {
  name: "UserProfile",
  data() {
    return { auth };
  },
  props: ["user"],
};
</script>
