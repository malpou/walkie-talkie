<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mx-auto">
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline mb-4">Sign in Anonymously</div>
              <v-list-item
                ><v-btn @click="auth.signInAnonymously()">
                  Sign In
                </v-btn>
              </v-list-item>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col>
        <v-card color="mx-auto">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">
                {{
                  newUser ? "Sign Up for a New Account" : "Sign In with Email"
                }}
              </div>
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item>
                    <v-switch v-model="newUser" :label="`New User?`"></v-switch>
                  </v-list-item>
                  <v-list-item>
                    <v-text-field
                      v-model="email"
                      label="Email"
                      placeholder="mail@domain.com"
                      type="email"
                      class="input"
                      outlined
                    />
                  </v-list-item>
                  <v-list-item>
                    <v-text-field
                      v-model="password"
                      label="Password"
                      placeholder="••••••••"
                      type="password"
                      class="input"
                      outlined
                    />
                  </v-list-item>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  @click="signInOrCreateUser()"
                >
                  {{ newUser ? "Sign Up" : "Login" }}
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-alert
                  v-if="errorMessage"
                  border="left"
                  color="red lighten-2"
                  dark
                >
                  {{ errorMessage }}
                </v-alert>
              </v-list-item>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth } from "../firebase";

export default {
  name: "Login",
  data() {
    return {
      auth,
      newUser: false,
      email: "",
      password: "",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async signInOrCreateUser() {
      this.loading = true;
      this.errorMessage = "";

      try {
        if (this.newUser) {
          await auth.createUserWithEmailAndPassword(this.email, this.password);
        } else {
          await auth.signInWithEmailAndPassword(this.email, this.password);
        }
      } catch (error) {
        this.errorMessage = error.message;
      }

      this.loading = false;
    },
  },
};
</script>
