<template>
  <div class="flex justify-content-center">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Log In</div>
        <span class="text-600 font-medium line-height-3">Don't have an account?</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="/register-user">Create today!</a>
      </div>

      <div>
        <div class="flex flex-column align-items-center gap-2 m-3">
          <div class="w-10 flex flex-column align-items-center">
            <label for="username">Email</label>
            <InputText v-model="email"
                       id="username"
                       :invalid="emailError !== null"
            />
            <small v-if="emailError" id="email-error-message">{{ emailError }}</small>
          </div>
        </div>

        <div class="flex flex-column gap-2 align-items-center mb-3">
          <div class="w-10 flex flex-column align-items-center">
            <label for="password">Password</label>
            <Password v-model="password"/>
            <small v-if="passwordError" id="password-error-message" class="invalid">{{ passwordError }}</small>
          </div>
        </div>
        <Button label="Register" icon="pi pi-user" @click="logIn"/>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script>

import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import Toast from "primevue/toast";
import axiosRequestMaker from '../../requestMaker.js'

export default {
  name: 'LogIn',
  components: {
    InputText,
    Button,
    Password,
    Toast
  },
  data() {
    return {
      email: '',
      password: '',
      emailError: null,
      passwordError: null
    }
  },
  methods: {
    logIn() {
      this.validateEmail()
      this.validatePassword()
      if (this.passwordError || this.emailError) {
        return
      }
      axiosRequestMaker.post('https://webapihealth20240823092904.azurewebsites.net/api/authentication/login', {
        email: this.email,
        password: this.password
      }).then(response => {
        if (response.data.httpStatusCode === 201 && response.data.isSuccess === true) {
          localStorage.setItem('token', response.data.data.token)
          this.$router.push('/')
        } else if (response.data.httpStatusCode === 403 && response.data.isSuccess === false) {
          this.$toast.add({severity: 'error', summary: 'Error', detail: 'Invalid email or password', life: 3000})
        } else {
          this.$toast.add({severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000})
        }
        localStorage.setItem('token', response.data.data.token)
        this.$router.push('/')
      }).catch(error => {
        console.log(error)
      })
    },
    validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!this.email) {
        this.emailError = 'Email is required';
      } else if (!emailPattern.test(this.email)) {
        this.emailError = 'Please enter a valid email address';
      } else {
        this.emailError = null; // No error, email is valid
      }
    },
    validatePassword() {
      // Example validation: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!this.password) {
        this.passwordError = 'Password is required';
      } else if (!passwordPattern.test(this.password)) {
        this.passwordError = 'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character';
      } else {
        this.passwordError = null; // No error, password is valid
      }
    }
  }
}
</script>
