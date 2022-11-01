<template>
  <Card>
    <template #title>
      <h1> Add an User </h1>
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
      <Dropdown v-model="selectedRole" :options="userRoles" 
        optionLabel="name" placeholder="Select the role" />
      <p class="error-msg" v-if="errMsg"> {{ errMsg }} </p>
    </template>
    <template #footer>
      <Button @click="addUser" label="Done" />
    </template>
  </Card>
</template>

<script>

import * as Realm from "realm-web";

export default {
  name: 'AddUser',
  
  data() {
    return {
      name: '',
      email: '',
      password: '',
      selectedRole: '',
      selectedDesignation: '',
      errMsg: null,
      userData: [],
      userRoles: [
        {name: 'Manager'},
        {name: 'Employee'},
        {name: 'Intern'}
      ],
    }
  },

  created() {
    this.realmApp = Realm.getApp("application-0-kmolw");
  },

  methods: {
    addUser() {
      const email = this.email;
      const password = this.password;
      this.realmApp.currentUser.callFunction("addUser", this.email, this.name, this.selectedRole.name)
      .then((data) => {
        console.log(data);
        if (data == true) {
          const credentials = Realm.Credentials.emailPassword(email, password);
          this.realmApp.emailPasswordAuth.registerUser({email, password})
          .catch((err) => {
            console.log(err);
            this.errMsg = "Register Failed !"
            // this.realmApp.currentUser.callFunction("deleteUser", this.email)
          })    
        } else {
          this.errMsg = "Register Failed !"
        }
      });
    },
  }
};

</script>