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
      </template>
      <template #footer>
        <Button @click="signIn" label="Sign In" />
        <Button class="p-button-secondary" @click="signInAnonymously" label="Sign In Anonymously" />
        <!-- <Button @click="callback" label="Sign In with Google" /> -->
      </template>
    </Card>
  </main>
</template>

<script>

import * as Realm from "realm-web";
// import { googleSdkLoaded } from "vue3-google-login"

export default {
  name: 'SignInPage',

  data() {
    return {
      email: null,
      password: null,
      errMsg: null
    }
  },

  created() {
    this.realmApp = Realm.getApp("application-0-kmolw");
  },

  methods: {
    async signIn() {
      if (this.email == null || this.password == null) {
        this.errMsg = "*Empty fields";

        return;
      }
      const credentials = Realm.Credentials.emailPassword(this.email, this.password);

      await this.realmApp.logIn(credentials)
      .then((user) => {
        console.log(user.customData);
        return this.realmApp.currentUser.callFunction("isUserExist", user.id)
      })
      .then((data) => {
        if (data === false) {
          console.log("ok");
          this.realmApp.currentUser.callFunction("syncUser", this.realmApp.currentUser.id, this.email)
          .then((res) => {
            this.realmApp.currentUser.refreshCustomData();
            this.$router.push({ name: 'UserPage' });
          })
        } else {
          this.$router.push({ name: 'UserPage' });
        } 
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
        this.$router.push({ name: 'UserPage' })
      })
      .catch((err) => {
        this.errMsg = "* Invalid";
        console.log(err);
      })
    },
    
    // callback() {
    //   const app = Realm.getApp("application-0-kmolw");
    //   googleSdkLoaded((google) => {
    //     google.accounts.oauth2.initCodeClient({
    //       client_id: "734960750491-ci1nnmaq463gc835qopqsns4drg1d947.apps.googleusercontent.com",
    //       scope: 'email profile openid',
    //       callback: (response) => {
    //         console.log("Handle the response", response)
    //         const cred = Realm.Credentials.google(response);
    //         app.logIn(credentials)
    //         .then((user) => alert(`Logged in with id: ${user.id}`))
    //         .catch((err) => console.log(err));
    //       }
    //     }).requestCode()
    //   })
    //   // console.log("google login", response);
    // }
  }
};

</script>