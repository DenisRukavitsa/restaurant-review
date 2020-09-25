<!--Review card on the restaurant details page-->

<template>
  <div>
    <v-card class="review">
      <!--Guest name, date of visit and review date-->
      <v-card-title>
        <v-layout justify-space-between>
          <div>
            {{ review.userName || review.authorId.name }}
            visited on
            {{ review.dateOfVisit.substr(0, 10) }}
          </div>
          <div class="created-at">
            Commented at {{ review.createdAt.slice(0, -8).split('T').reverse().join(' ') }}
          </div>
        </v-layout>
      </v-card-title>

      <!--Review rating, comment and owner reply-->
      <v-card-text>
        <v-rating
          readonly
          dense
          background-color="primary"
          :value="review.rating"
        />

        <div class="comment">
          {{ review.comment }}
        </div>

        <div
          v-if="review.reply"
          class="reply"
        >
          <div class="teal--text">Owner's reply:</div>
          <div>{{ review.reply }}</div>
        </div>

        <!--Controls for replying to the review for the restaurant owners-->
        <v-layout
          align-start
          v-if="isOwner && !review.reply"
          class="add-reply"
        >
          <v-btn
            v-if="!isReplying"
            outlined
            color="secondary"
            @click="isReplying = true"
          >
            reply
          </v-btn>

          <v-btn
            v-else
            color="primary"
            :disabled="!reply"
            :loading="loading"
            @click="saveReply"
          >
            save
          </v-btn>

          <v-textarea
            v-if="isReplying"
            auto-grow
            hide-details
            label="Your reply"
            :rows="1"
            v-model="reply"
          />
        </v-layout>

        <!--Buttons for editing and deleting review by admins-->
        <div
          v-if="isAdmin"
          class="controls"
        >
          <v-btn
            outlined
            color="secondary"
            @click="showEditDialog = true"
          >
            edit
          </v-btn>

          <v-btn
            outlined
            color="secondary"
            @click="showDeleteDialog = true"
          >
            delete
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!--Edit review dialog-->
    <review-dialog
      v-if="isAdmin"
      v-model="showEditDialog"
      :review="review"
    />

    <!--Delete restaurant dialog-->
    <confirm-dialog
      v-if="isAdmin"
      v-model="showDeleteDialog"
      @confirm="deleteReview(reviewId)"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ReviewDialog from '@/components/review/ReviewDialog.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

export default {
  name: 'Review',
  components: { ReviewDialog, ConfirmDialog },
  props: {
    reviewId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      reply: '',
      isReplying: false,

      showEditDialog: false,
      showDeleteDialog: false,
    };
  },

  computed: {
    ...mapState({
      userRole: state => state.user.userRole,
    }),

    review() {
      return this.$store.state.review.reviews.find(rev => rev._id === this.reviewId);
    },

    isOwner() {
      return this.userRole === 'owner';
    },

    isAdmin() {
      return this.userRole === 'admin';
    },
  },

  methods: {
    ...mapActions({
      updateReview: 'review/updateReview',
      deleteReview: 'review/deleteReview',
    }),

    saveReply() {
      this.loading = true;

      this.updateReview({
        reply: this.reply,
        _id: this.reviewId,
      }).then(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
  .review {
    margin-bottom: 1rem;

    .v-card__title {
      font-size: 1rem;
    }

    .created-at {
      font-size: 0.8rem;
      font-weight: normal;
    }

    .v-rating {
      margin: -1rem 0 0.6rem -0.2rem;
    }

    .comment {
      font-size: 1rem;
    }

    .reply {
      margin-top: 0.8rem;
      padding-left: 0.4rem;
      border-left: 4px solid #00897b;
      font-size: 0.875rem;

      .teal--text {
        font-weight: 600;
      }
    }

    .add-reply {
      margin-top: 1rem;
      width: 40%;

      .v-text-field {
        margin-left: 1rem;
        padding: 0;
      }
    }

    .controls .v-btn {
      margin: 1rem 1rem 0 0;
    }
  }
</style>
