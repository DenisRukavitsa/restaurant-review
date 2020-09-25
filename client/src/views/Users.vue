<!--Users page-->

<template>
  <div class="users-page">
    <!--Progressbar while loading list of users-->
    <v-progress-linear
      v-if="loading"
      color="secondary"
      top
      absolute
      indeterminate
    />

    <div
      v-else
      class="users-list"
    >
      <v-card
        v-for="user in users"
        :key="user._id"
      >
        <v-card-title>
          <v-layout justify-space-between>
            <div>{{ user.name }}</div>

            <div>
              <v-btn
                outlined
                color="secondary"
                @click="editUser(user)"
              >
                edit
              </v-btn>

              <v-btn
                outlined
                color="secondary"
                @click="confirmDeleteUser(user._id)"
              >
                delete
              </v-btn>
            </div>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <span class="role">{{ user.role }}</span> |
          <span>{{ user.email }}</span>
        </v-card-text>
      </v-card>
    </div>

    <!--Edit user dialog-->
    <user-dialog
      v-if="showEditDialog"
      v-model="showEditDialog"
      :user="editedUser"
    />

    <!--Delete user dialog-->
    <confirm-dialog
      v-model="showDeleteDialog"
      @confirm="deleteUser(userIdToDelete)"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UserDialog from '@/components/user/UserDialog.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

export default {
  name: 'Users',
  components: { UserDialog, ConfirmDialog },
  data() {
    return {
      loading: true,
      showEditDialog: false,
      showDeleteDialog: false,
      editedUser: {},
      userIdToDelete: null,
    };
  },

  computed: {
    ...mapState({
      users: state => state.user.users,
    }),
  },

  methods: {
    ...mapActions({
      getUsers: 'user/getUsers',
      deleteUser: 'user/deleteUser',
    }),

    editUser(user) {
      this.showEditDialog = true;
      this.editedUser = user;
    },

    confirmDeleteUser(userId) {
      this.showDeleteDialog = true;
      this.userIdToDelete = userId;
    },
  },

  mounted() {
    this.getUsers()
      .then(() => {
        this.loading = false;
      });
  },
};
</script>

<style scoped lang="scss">
  .users-list {
    margin: 3rem auto 0;
    max-width: 50%;

    .v-card {
      margin-bottom: 1rem;
    }

    .v-card__title {
      padding: 1rem 1rem 0.4rem;
      font-size: 1.4rem;
    }

    .v-card__text {
      padding: 0 1rem 1rem;
      font-size: 1rem;

      .role {
        font-weight: 600;
      }
    }

    .v-btn {
      margin-left: 0.8rem;
    }
  }
</style>

<style lang="scss">
  .v-list-item__title {
    font-size: 0.875rem;
  }
</style>
