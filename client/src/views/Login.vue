<template>
  <div class="login-page">
    <v-card
      :loading="loading"
      class="mx-auto"
    >

      <v-card-title>
        {{ this.isLogin ? 'Sign in' : 'Sign up' }}
      </v-card-title>

      <v-card-text>
        <!--User data form-->
        <v-form
          ref="form"
          v-model="formValid"
          @submit="submitForm"
        >
          <!--User role switcher in the sign up form-->
          <v-layout
            v-if="!isLogin"
            align-center
          >
            <div class="i-am">I'm restaurant</div>
            <v-chip-group
              mandatory
              active-class="primary--text"
              v-model="userRole"
            >
              <v-chip v-for="role in roles" :key="role">
                {{ role }}
              </v-chip>
            </v-chip-group>
          </v-layout>

          <!--User name input in the sign up form-->
          <v-text-field
            v-if="!isLogin"
            required
            label="Name"
            v-model="userName"
            :rules="mandatoryField"
          />

          <!--User email input in the log in and sign up forms-->
          <v-text-field
            required
            label="E-mail"
            v-model="email"
            :rules="emailRules"
          />

          <!--User password input in the log in and sign up forms-->
          <v-text-field
            required
            type="password"
            label="Password"
            v-model="password"
            :rules="isLogin ? mandatoryField : passwordRules"
          />

          <!--Submit button-->
          <v-btn
            large
            color="primary"
            :disabled="!formValid"
            :loading="loading"
            @click="submitForm"
          >
            Submit
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',

  data() {
    return {
      isLogin: this.$route.name === 'login',
      formValid: false,
      loading: false,
      email: '',
      password: '',
      userName: '',
      userRole: '',
      roles: ['guest', 'owner'],

      // Inputs validation rules
      mandatoryField: [v => !!v || 'Mandatory field'],
      passwordRules: [v => (v && v.length > 3) || 'Password must be at least 4 characters'],
      emailRules: [
        v => !!v || 'Mandatory field',
        v => /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(v) || 'Invalid email',
      ],
    };
  },

  methods: {
    ...mapActions({
      login: 'user/login',
      signup: 'user/signup',
    }),

    // Submitting form to the server
    submitForm() {
      const action = this.isLogin ? this.login : this.signup;

      // Composing data basing on the page (login/signup)
      const data = {
        email: this.email,
        password: this.password,
      };
      if (!this.isLogin) {
        data.name = this.userName;
        data.role = this.roles[this.userRole];
      }

      this.loading = true;
      action(data)
        .then(() => {
          // Redirecting to the home page
          this.$router.push('/');
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },

  watch: {
    // Watching the route change to reset the form
    $route() {
      this.isLogin = this.$route.name === 'login';
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped lang="scss">
  .login-page {
    .v-card {
      max-width: 30rem;
      margin-top: 2rem;
    }

    .i-am {
      margin-right: 0.4rem;
      font-size: 1rem;
    }

    .v-alert {
      padding: 0.6rem;
      font-size: 0.9rem;
    }

    .v-btn.v-size--large {
      display: block;
      margin: 1.8rem auto 0.4rem;
      height: 100%;
      padding: 0.8rem 1.2rem;
    }
  }
</style>
