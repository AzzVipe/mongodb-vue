<template>
  <main class="container">
    <Card>
      <template #title>
        <h1>Sign in</h1>
      </template>
      <template #content>
        <span class="p-float-label">
          <InputText id="email" type="email" v-model="email" placeholder="Email"/>
          <label for="email">Email</label>
        </span>
        <span class="p-float-label">
          <InputText id="password" type="password" v-model="password" placeholder="Password"/>
          <label for="password">Password</label>
        </span>
        <p class="error-msg" v-if="errMsg"> {{ errMsg }} </p>
        <router-link to="/sign-up" class="router-link">Don't have a account ? Sign Up !</router-link>
      </template>
      <template #footer>
        <Button @click="signIn" label="Sign In" />
        <Button class="p-button-secondary" @click="signInAnonymously" label="Sign In Anonymously" />
      </template>
    </Card>
  </main>
</template>

<script>

import * as Realm from "realm-web";

export default {
  name: 'SignInPage',

  data() {
    return {
      email: null,
      password: null,
      errMsg: '',
      userData: {},
    }
  },

  methods: {
    signIn() {
      if (this.email == null || this.password == null) {
        this.errMsg = "*Empty fields";

        return;
      }
      const credentials = Realm.Credentials.emailPassword(this.email, this.password);
      const app = Realm.getApp("application-0-kmolw");
      app.logIn(credentials)
      .then((user) => {
        console.log(user);
        this.$router.push({ name: 'UserPage' })
      })
      .catch((err) => {
        this.errMsg = "* Invalid username/password";
        console.log(err);
      })
    },

    signInAnonymously() {
      const credentials = Realm.Credentials.anonymous();
      const app = Realm.getApp("application-0-kmolw");
      app.logIn(credentials)
      .then((user) => {
        console.log(user);
        this.$router.push({ name: 'UserPage' })
      })
      .catch((err) => {
        this.errMsg = "* Invalid";
        console.log(err);
      })
    }
  }
};

</script>