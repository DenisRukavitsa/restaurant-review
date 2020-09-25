import axios from 'axios';
import router from '../router/index';

// Updating user name and role in the state and saving user data in the local storage
const saveUserData = (data, commit) => {
  commit('updateUserName', data.name);
  commit('updateUserRole', data.role);
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.id);
  localStorage.setItem('userName', data.name);
  localStorage.setItem('userRole', data.role);
};

export default {
  namespaced: true,

  state: {
    userName: localStorage.getItem('userName'),
    userRole: localStorage.getItem('userRole'),
    users: [],
  },

  mutations: {
    updateUserName(state, userName) {
      state.userName = userName;
    },

    updateUserRole(state, userRole) {
      state.userRole = userRole;
    },

    updateUsers(state, users) {
      state.users = users;
    },

    updateUser(state, user) {
      const index = state.users.findIndex(rev => rev._id === user._id);
      state.users.splice(index, 1, user);
    },

    deleteUser(state, userId) {
      const index = state.users.findIndex(rest => rest._id === userId);
      state.users.splice(index, 1);
    },
  },

  actions: {
    // User login
    login({ commit }, details) {
      return axios
        .post('/users/login', details)
        .then(({ data }) => saveUserData(data, commit))
        .catch(({ response }) => {
          this.dispatch('snackbar/show', {
            title: 'Login failed',
            message: 'Please check your credentials and try again',
          });

          throw response.data.error;
        });
    },

    // User signup
    signup({ commit }, details) {
      return axios
        .post('/users', details)
        .then(({ data }) => saveUserData(data, commit))
        .catch(({ response }) => {
          const error = response.data.error.includes('duplicate key')
            ? 'Specified email address is already in use'
            : response.data.error;

          this.dispatch('snackbar/show', {
            title: 'Error',
            message: error,
          });

          throw response.data.error;
        });
    },

    // User logout
    logout({ commit }) {
      // Clearing user data in the state and local storage and redirecting to the login page
      commit('updateUserName', '');
      commit('updateUserRole', '');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      router.push('/login');
    },

    // Fetching the list of users
    getUsers({ commit }) {
      return axios
        .get('/users')
        .then(({ data }) => {
          commit('updateUsers', data);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },

    // Update user by id
    updateUser({ commit }, user) {
      return axios
        .patch(`/users/${user._id}`, user)
        .then(() => {
          commit('updateUser', user);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },

    // Delete user by id
    deleteUser({ commit }, userId) {
      return axios
        .delete(`/users/${userId}a`)
        .then(() => {
          commit('deleteUser', userId);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },
  },
};
