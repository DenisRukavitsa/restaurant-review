<template>
  <div class="restaurants-page">
    <!--Progressbar while loading list of restaurants-->
    <v-progress-linear
      v-if="loading"
      color="secondary"
      top
      absolute
      indeterminate
    />

    <div
      v-else
      class="restaurants-list"
    >
      <v-layout
        align-center
        :justify-space-between="isOwner"
        :justify-end="!isOwner"
        class="controls"
      >
        <!--Create restaurant button-->
        <v-btn
          v-if="isOwner"
          large
          color="primary"
          @click="createRestaurant"
        >
          create new
        </v-btn>

        <!--Filtering restaurants by rating-->
        <v-select
          solo
          hide-details
          v-model="filter"
          :items="filterItems"
          @change="getRestaurants"
        />
      </v-layout>

      <div
        class="no-data"
        v-if="!restaurants.length"
      >
        No restaurants found matching your criteria
      </div>

      <!--Restaurant cards-->
      <restaurant
        v-for="restaurant in restaurants"
        :key="restaurant._id"
        :restaurant="restaurant"
        :reviews-count="notRepliedReviewsCounts"
        :is-owner="isOwner"
        :can-edit="canEdit"
        @edit="editRestaurant($event)"
        @delete="confirmDeleteRestaurant($event)"
      />
    </div>

    <!--Add/edit restaurant dialog-->
    <restaurant-dialog
      v-if="canEdit && showEditDialog"
      v-model="showEditDialog"
      :restaurant="editedRestaurant"
    />

    <!--Delete restaurant dialog-->
    <confirm-dialog
      v-if="canEdit"
      v-model="showDeleteDialog"
      @confirm="deleteRestaurant(restaurantIdToDelete)"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Restaurant from '@/components/restaurant/RestaurantCard.vue';
import RestaurantDialog from '@/components/restaurant/RestaurantDialog.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

export default {
  name: 'Restaurants',
  components: { Restaurant, RestaurantDialog, ConfirmDialog },
  data() {
    return {
      loading: true,
      showEditDialog: false,
      showDeleteDialog: false,
      editedRestaurant: null,
      restaurantIdToDelete: null,

      filter: 0,
      filterItems: [
        { value: 0, text: 'All' },
        { value: 5, text: '5' },
        { value: 4, text: '4+' },
        { value: 3, text: '3+' },
        { value: 2, text: '2+' },
        { value: 1, text: '1+' },
      ],
    };
  },

  computed: {
    ...mapState({
      userRole: state => state.user.userRole,
      restaurants: state => state.restaurant.restaurants,
      notRepliedReviewsCounts: state => state.restaurant.notRepliedReviewsCounts,
    }),

    isOwner() {
      return this.userRole === 'owner';
    },

    canEdit() {
      return this.userRole === 'owner' || this.userRole === 'admin';
    },
  },

  methods: {
    ...mapActions({
      getRestaurantList: 'restaurant/getRestaurants',
      getNotRepliedReviewsCounts: 'restaurant/getNotRepliedReviewsCounts',
      deleteRestaurant: 'restaurant/deleteRestaurant',
    }),

    createRestaurant() {
      this.showEditDialog = true;
      this.editedRestaurant = null;
    },

    editRestaurant(restaurant) {
      this.showEditDialog = true;
      this.editedRestaurant = restaurant;
    },

    confirmDeleteRestaurant(restaurant) {
      this.showDeleteDialog = true;
      this.restaurantIdToDelete = restaurant._id;
    },

    // Fetching restaurant list filtered by rating
    getRestaurants() {
      // Query params for the request
      const params = { rating: this.filter };
      if (this.isOwner) params.ownerId = localStorage.getItem('userId');

      this.loading = true;
      this.getRestaurantList(params)
        .then(() => {
          this.loading = false;
        });
    },
  },

  mounted() {
    this.getRestaurants();

    if (this.isOwner) {
      this.getNotRepliedReviewsCounts({ ownerId: localStorage.getItem('userId') });
    }
  },
};
</script>

<style scoped lang="scss">
  .restaurants-list {
    margin: 3rem auto 0;
    max-width: 60%;

    .controls {
      margin-bottom: 1rem;
    }

    .v-select {
      padding: 0;
      max-width: 15%;
    }

    .no-data {
      font-size: 1.2rem;
      text-align: center;
    }
  }
</style>
