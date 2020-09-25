<!--Dialog window to add or edit restaurant details on the Restaurants page-->

<template>
  <v-dialog
    persistent
    content-class="restaurant-dialog"
    v-model="model"
    width="600"
  >
    <v-card>
      <v-card-title>
        {{ this.restaurant ? 'Update' : 'Create' }} restaurant
      </v-card-title>

      <!--Edit restaurant details form-->
      <v-form v-model="formValid">
        <v-text-field
          required
          label="Name"
          v-model="name"
          :rules="mandatoryField"
        />

        <v-textarea
          required
          auto-grow
          label="Description"
          v-model="description"
          :rows="1"
          :rules="mandatoryField"
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
  name: 'RestaurantDialog',

  props: {
    value: Boolean,
    restaurant: Object,
  },

  data() {
    return {
      loading: false,
      formValid: false,
      name: '',
      description: '',

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
      createRestaurant: 'restaurant/createRestaurant',
      updateRestaurant: 'restaurant/updateRestaurant',
    }),

    // Sending restaurant details to the server
    save() {
      const action = this.restaurant ? this.updateRestaurant : this.createRestaurant;

      // Combining restaurant details
      const details = {
        name: this.name,
        description: this.description,
      };
      if (this.restaurant) details._id = this.restaurant._id;

      this.loading = true;
      action(details)
        .then(() => {
          this.model = false;
        });
    },
  },

  mounted() {
    // Populating input fields with restaurant details if editing an existing restaurant
    if (this.restaurant) {
      this.name = this.restaurant.name;
      this.description = this.restaurant.description;
    }
  },
};
</script>

<style scoped lang="scss">
  .restaurant-dialog {
    .v-card {
      padding: 1rem;
    }

    .v-card__title {
      padding: 0;
      font-size: 1.2rem;
    }

    .v-text-field {
      width: 100%;
    }

    .v-btn {
      margin: 0.6rem 0 0 1rem;
    }
  }
</style>
