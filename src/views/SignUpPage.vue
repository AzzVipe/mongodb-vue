<template>
  <main class="container">
    <Card>
      <template #title>
        <h1> Create an Account </h1>
      </template>
      <template #content>
        <span class="p-float-label">
          <InputText id="name" type="name" v-model="name" placeholder="Name"/>
          <label for="name">Name</label>
        </span>
        <span class="p-float-label">
          <InputText id="email" type="email" v-model="email" placeholder="Email"/>
          <label for="email">Email</label>
        </span>
        <span class="p-float-label">
          <InputText id="password" type="password" v-model="password" placeholder="Password"/>
          <label for="password">Password</label>
        </span>
        <!-- <Dropdown v-model="selectedRole" :options="userRoles" optionLabel="name" placeholder="Select your Role" />
        <Dropdown 
          v-model="selectedDesignation" :options="userDesignations" 
          optionLabel="name" placeholder="Select your Designation" /> -->
        <router-link to="/" class="router-link">Already an User ? Sign In !</router-link>
        <p class="error-msg" v-if="errMsg"> {{ errMsg }} </p>
      </template>
      <template #footer>
        <Button @click="register" label="Create Account" />
      </template>
    </Card>
  </main>
</template>

<script>

import * as Realm from "realm-web";

export default {
  name: 'SignUpPage',
  
  data() {
    return {
      name: '',
      email: '',
      password: '',
      selectedRole: '',
      selectedDesignation: '',
      errorMsg: '',
      userData: [],
      // userRoles: [
      //   {name: 'Employee'},
      //   {name: 'Intern'}
      // ],
      // userDesignations: [
      //   {name: 'UI Designer'},
      //   {name: 'Front-End Developer'},
      //   {name: 'Back-End Developer'},
      // ],
    }
  },

  methods: {
    async register() {
      const app = Realm.getApp("application-0-kmolw");
      const email = this.email;
      const password = this.password;
      const credentials = Realm.Credentials.emailPassword(this.email, this.password);
      await app.emailPasswordAuth.registerUser({email, password})
      .then((data) => {
        app.logIn(credentials)
        .then((user) => {
          const mongodb = app.currentUser.mongoClient("mongodb-atlas");
          const collection = mongodb.db("db1").collection("users");
          collection.insertOne(
            { userID: app.currentUser.id, name: this.name }
          );
          console.log(collection);
          this.$router.push({ name: 'UserPage' });
        })
        .catch((err) => {
          console.log(err);
        })
      })
      .catch((err) => {
        this.errorMsg = err;
        console.log(err);
      })
    },
  }
};

</script>