<template>
  <div class="flex justify-content-center">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Register</div>
      </div>

      <div>
        <div class="flex flex-column align-items-center gap-2 m-3">
          <div class="w-10 flex flex-column align-items-center">
            <label for="username">Username:</label>
            <InputText v-model="username"
                       id="username"
                       :invalid="usernameError !== null"
            />
            <small v-if="usernameError" id="email-error-message">{{ usernameError }}</small>
          </div>
        </div>

        <div class="flex flex-column align-items-center gap-2 m-3">
          <div class="w-10 flex flex-column align-items-center">
          <label for="username">Email:</label>
            <InputText v-model="email"
                       id="username"
                       :invalid="emailError !== null"
            />
            <small v-if="emailError" id="email-error-message">{{ emailError }}</small>
          </div>
        </div>

        <div class="flex flex-column gap-2 align-items-center mb-3">
          <div class="w-10 flex flex-column align-items-center">
          <label for="password">Password:</label>
            <Password :invalid="passwordError !== null" v-model="password"/>
          <small v-if="passwordError" id="password-error-message" class="invalid">{{ passwordError }}</small>
          </div>
        </div>
        <Button label="Register" icon="pi pi-user" @click="register"/>
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
  name: 'RegisterUser',
  components: {
    Button,
    InputText,
    Password,
    Toast
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      usernameError: null,
      emailError: null,
      passwordError: null
    }
  },
  methods: {
    register() {
      this.validateEmail()
      this.validatePassword()
      this.validateName()

      if (this.passwordError || this.emailError || this.usernameError) {
        return
      }

      axiosRequestMaker.post('https://webapihealth20240823092904.azurewebsites.net/api/authentication/register',{
        userName: this.username,
        email: this.email,
        password: this.password
      }).then(response => {
            if (response.data.isSuccess === true) {
              this.$toast.add({severity:'success', summary:'Success', detail:'User registered successfully', life: 3000});
              setTimeout(() => {
                this.$router.push('/login');
              }, 2000);
            } else {
              if (response.data.errorMessages) {
                response.data.errorMessages.forEach(error => {
                  this.$toast.add({severity:'error', summary:'Error', detail:error, life: 3000});
                });
              }
            }
      }).catch(error => {
        console.log(error)
      })
      console.log(this.email, this.password, this.name)
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
    },
    validateName() {
      if (!this.username) {
        this.usernameError = 'Name is required';
      }

      if (this.username.length < 3) {
        this.usernameError = 'Name must be at least 3 characters long';
      }
    }
  }
}
</script>

<style scoped>
.is-invalid {
  border-color: red !important;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
</style>