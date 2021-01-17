<template>
  <n-link :to="'/photo/' + item.photo" class="nocolour">
    <div class="card mb-3 card-hover">
      <img
          :src="
            'https://pics.thomas.gg/storage/thumbnails/' + item.photo + '.jpg'
          "
          class="card-img-top"
        >
      <div class="card-body">
          <h5 class="card-title">{{ item.registration }} <span class="badge badge-pill badge-warning" v-if="item.state == 'NEEDS_RETAKE'">Needs Retake</span></h5>
          <div class="row text-muted">
            <div class="col-md-5">
              <p class="card-muted"><strong><fa class="card-icon fa-fw align-middle" :icon="['fas', 'calendar-day']" /></strong> Taken <strong>{{ time }}</strong></p>
            </div>
            <div class="col-md-7">
              <p class="card-muted"><strong><fa class="card-icon fa-fw align-middle" :icon="['fas', 'camera']" /></strong> {{ item.camera }}</p>
            </div>
          </div>
      </div>
    </div>
  </n-link>
</template>
<script>
export default {
  name: "CollectionContentItem",
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      time: ""
    };
  },
  mounted() {
    this.time = this.$moment.unix(this.item.timestamp).fromNow();
    setInterval(() => {
      this.time = this.$moment.unix(this.item.timestamp).fromNow();
    }, 1000);
  }
};
</script>
