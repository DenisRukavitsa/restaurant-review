<!--Dialog window to edit user on the Users page-->

<template>
  <v-dialog
    persistent
    content-class="user-dialog"
    v-model="model"
    width="600"
  >
    <v-card>
      <v-card-title>
        Edit user
      </v-card-title>

      <!--Edit user form-->
      <v-form v-model="formValid">
        <v-text-field
          label="Name"
          v-model="userCopy.name"
          :rules="mandatoryField"
        />

        <v-text-field
          label="Email"
          v-model="userCopy.email"
          :rules="mandatoryField"
        />

        <v-select
          label="Role"
          v-model="userCopy.role"
          :items="roles"
        />

        <v-layout justify-end>
          <v-btn
            large
            outlined
            color="secondary"
            @click="model = false"
          >
            cancel
          </v-btn>

          <v-btn
            large
            color="primary"
            :loading="loading"
            :disabled="!formValid"
            @click="save"
          >
            save
          </v-btn>
        </v-layout>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'UserDialog',

  props: {
    value: Boolean,
    user: Object,
  },

  data() {
    return {
      loading: false,
      formValid: false,
      userCopy: {},

      roles: ['guest', 'owner', 'admin'],
      mandatoryField: [v => !!v || 'Mandatory field'],
    };
  },

  computed: {
    // Controls dialog visibility
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  methods: {
    ...mapActions({
      updateUser: 'user/updateUser',
    }),

    // Sending user details to the server
    save() {
      this.loading = true;
      this.updateUser(this.userCopy)
        .then(() => {
          this.model = false;
        });
    },
  },

  mounted() {
    // Copying user to avoid mutating vuex state outside the mutation handlers
    this.userCopy = { ...this.user };
  },
};
</script>

<style scoped lang="scss">
  .user-dialog {
    .v-card {
      padding: 1rem;
    }

    .v-card__title {
      padding: 0;
      margin-bottom: 0.8rem;
      font-size: 1.2rem;
    }

    .v-btn {
      margin: 0.6rem 0 0 1rem;
    }
  }
</style>
