<template>
  <div class="flex justify-content-center">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Log In</div>
        <span class="text-600 font-medium line-height-3">Don't have an account?</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="/register-user">Create today!</a>
      </div>

      <div class="">
        <label for="email1" class="block text-900 font-medium mb-2">Email</label>
        <InputText id="email1" type="text" class="w-full mb-3"/>

        <label for="password1" class="block text-900 font-medium mb-2">Password</label>
        <InputText id="password1" type="password" class="w-full mb-3"/>

        <Button label="Sign In" icon="pi pi-user" @click="logIn"/>
      </div>
    </div>
  </div>
</template>

<script>

import InputText from "primevue/inputtext";
import Button from "primevue/button";
import axios from 'axios'

export default {
  name: 'LogIn',
  components: {
    InputText,
    Button
  },
  props: {
    msg: String
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    logIn() {
      axios.post('https://webapihealth20240823092904.azurewebsites.net/api/users/login', {
        email: this.email,
        password: this.password
      }).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
