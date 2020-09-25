import axios from 'axios';

export default {
  namespaced: true,

  state: {
    restaurants: [],
    notRepliedReviewsCounts: {},
  },

  mutations: {
    updateRestaurants(state, restaurants) {
      state.restaurants = restaurants;
    },

    createRestaurant(state, restaurant) {
      state.restaurants.push(restaurant);
    },

    updateRestaurant(state, details) {
      const restaurant = state.restaurants.find(rest => rest._id === details._id);
      restaurant.name = details.name;
      restaurant.description = details.description;
    },

    deleteRestaurant(state, restaurantId) {
      const index = state.restaurants.findIndex(rest => rest._id === restaurantId);
      state.restaurants.splice(index, 1);
    },

    updateNotRepliedReviewsCounts(state, data) {
      state.notRepliedReviewsCounts = data;
    },
  },

  actions: {
    // Fetching a list restaurants
    getRestaurants({ commit }, params) {
      return axios
        .get('/restaurants', { params })
        .then(({ data }) => {
          commit('updateRestaurants', data);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },

    // Creating new restaurant
    createRestaurant({ commit }, details) {
      return axios
        .post('/restaurants', details)
        .then(({ data }) => {
          commit('createRestaurant', data);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },

    // Updating restaurant by ID
    updateRestaurant({ commit }, details) {
      return axios
        .patch(`/restaurants/${details._id}`, details)
        .then(() => {
          commit('updateRestaurant', details);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },

    // Deleting restaurant by ID
    deleteRestaurant({ commit }, restaurantId) {
      return axios
        .delete(`/restaurants/${restaurantId}`)
        .then(() => {
          commit('deleteRestaurant', restaurantId);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },

    // Fetching restaurant list with count of not replied reviews
    getNotRepliedReviewsCounts({ commit }, params) {
      return axios
        .get('/restaurants/reviews-count', { params })
        .then(({ data }) => {
          commit('updateNotRepliedReviewsCounts', data);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },
  },
};
