<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <!--App title-->
      <h1 class="app-title">🍽 Restaurant review</h1>
      <v-spacer></v-spacer>

      <!--App navigation-->
      <nav class="navigation">
        <router-link
          exact
          to="/"
          active-class="amber--text"
        >
          Restaurants
        </router-link>

        <router-link
          v-if="isAdmin"
          to="/users"
          active-class="amber--text"
        >
          Users
        </router-link>

        <router-link
          v-if="!userName"
          to="/login"
          active-class="amber--text"
        >
          Sign In
        </router-link>

        <router-link
          v-if="!userName"
          to="/signup"
          active-class="amber--text"
        >
          Sign Up
        </router-link>

        <template v-if="userName">
          <div class="user-hello">
            Hello, {{ userName }}
          </div>
          <div class="user-separator">|</div>
          <a
            class="logout-link"
            v-if="userName"
            @click="logout"
          >
            Log out
          </a>
        </template>
      </nav>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <!--Notification snackbar called via Vuex-->
    <v-snackbar
      top
      right
      multi-line
      timeout="5000"
      transition="slide-y-transition"
      v-model="snackbarModel"
      :color="snackbar.type"
    >
      <h4 class="snackbar-title">
        {{ snackbar.title }}
      </h4>
      <p class="snackbar-message">
        {{ snackbar.message }}
      </p>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      userRole: state => state.user.userRole,
      snackbar: state => state.snackbar,
    }),

    isAdmin() {
      return this.userRole === 'admin';
    },

    snackbarModel: {
      get() {
        return this.$store.state.snackbar.model;
      },
      set() {
        this.$store.commit('snackbar/hide');
      },
    },
  },

  methods: {
    ...mapActions({
      logout: 'user/logout',
    }),
  },
};
</script>

<style scoped lang="scss">
  .app-title {
    font-family: 'Dancing Script', cursive;
    font-size: 2rem;
  }

  .navigation {
    display: flex;
    align-items: center;
  }

  .user-hello {
    margin-left: 2rem;
  }

  .user-separator {
    margin: 0 0.8rem;
    font-size: 1.5rem;
  }

  .v-app-bar a {
    margin: 1rem;
    color: #FFF;
    font-size: 1.2rem;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: lightgrey;
    }

    &.logout-link {
      margin-left: 0;
    }
  }
</style>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&display=swap');

  html#root {
    overflow: auto;

    @media only screen and (max-width: 600px) {
      font-size: 12px;
    }

    @media only screen and (min-width: 600px) {
      font-size: 13px;
    }

    @media only screen and (min-width: 768px) {
      font-size: 14px;
    }

    @media only screen and (min-width: 992px) {
      font-size: 15px;
    }

    @media only screen and (min-width: 1200px) {
      font-size: 16px;
    }

    @media only screen and (min-width: 1440px) {
      font-size: 18px;
    }
  }

  .v-snack {
    .v-snack__wrapper {
      max-width: 30%;
    }

    .snackbar-title {
      margin-bottom: 0.4rem;
      font-size: 1.2rem;
    }

    .snackbar-message {
      margin-bottom: 0;
      font-size: 1rem;
    }
  }
</style>
