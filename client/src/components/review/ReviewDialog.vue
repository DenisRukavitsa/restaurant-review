<!--Dialog window to edit review on the Restaurant details page-->

<template>
  <v-dialog
    persistent
    content-class="review-dialog"
    v-model="model"
    width="600"
  >
    <v-card>
      <v-card-title>
        Edit review
      </v-card-title>

      <!--Edit review form-->
      <v-form v-model="formValid">
        <div>Rating:</div>
        <v-rating
          color="secondary"
          background-color="secondary"
          v-model="reviewCopy.rating"
        />

        <v-textarea
          auto-grow
          label="Comment"
          :rows="1"
          :rules="mandatoryField"
          v-model="reviewCopy.comment"
        />

        <!--Date picker in menu for selecting review date of visit-->
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="slide-y-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              readonly
              hide-details
              label="Date of visit"
              v-model="reviewCopy.dateOfVisit"
              v-bind="attrs"
              v-on="on"
            />
          </template>

          <v-date-picker
            color="primary"
            v-model="reviewCopy.dateOfVisit"
            :max="new Date().toISOString()"
            @input="dateMenu = false"
          />
        </v-menu>

        <v-textarea
          v-if="reviewCopy.reply !== undefined"
          auto-grow
          label="Reply"
          :rows="1"
          v-model="reviewCopy.reply"
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
  name: 'ReviewDialog',

  props: {
    value: Boolean,
    review: Object,
  },

  data() {
    return {
      loading: false,
      formValid: false,
      reviewCopy: {},
      dateMenu: false,

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
      updateReview: 'review/updateReview',
    }),

    // Sending review details to the server
    save() {
      this.loading = true;
      this.updateReview(this.reviewCopy)
        .then(() => {
          this.model = false;
        });
    },
  },

  mounted() {
    // Copying review to avoid mutating vuex state outside the mutation handlers
    this.reviewCopy = {
      _id: this.review._id,
      comment: this.review.comment,
      dateOfVisit: this.review.dateOfVisit.substring(0, 10),
      rating: this.review.rating,
      reply: this.review.reply,
    };
  },
};
</script>

<style scoped lang="scss">
  .review-dialog {
    .v-card {
      padding: 1rem;
    }

    .v-card__title {
      padding: 0;
      margin-bottom: 0.8rem;
      font-size: 1.2rem;
    }

    .v-rating {
      margin: -0.2rem 0 0.6rem -0.6rem;
    }

    .v-input--is-readonly {
      margin-bottom: 1.4rem;
    }

    .v-btn {
      margin: 0.6rem 0 0 1rem;
    }
  }
</style>
