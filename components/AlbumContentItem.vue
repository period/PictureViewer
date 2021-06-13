<template>
  <n-link :to="'/photo/' + photo.uuid" class="nocolour">
    <div class="card mb-4 card-hover">
      <img
          :src="
            'https://pics.thomas.gg/storage/thumbnails/' + photo.uuid + '.jpg'
          "
          style="min-width: 512px"
          class="card-img-top"
        >
      <div class="card-body">
          <h5 class="card-title">{{ photo.aircraft.registration }}</h5>
          <div class="row text-muted">
            <div class="col-md-5">
              <p class="card-muted"><strong><fa class="card-icon fa-fw align-middle" :icon="['fas', 'calendar-day']" /></strong> Taken <strong>{{ time }}</strong></p>
            </div>
            <div class="col-md-7">
              <p class="card-muted"><strong><fa class="card-icon fa-fw align-middle" :icon="['fas', 'camera']" /></strong> {{ photo.camera }}</p>
            </div>
          </div>
      </div>
    </div>
  </n-link>
</template>
<script>
export default {
  name: "AlbumContentItem",
  props: {
    photo: {
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
    this.time = this.$moment.unix(this.photo.timestamp).fromNow();
    setInterval(() => {
      this.time = this.$moment.unix(this.photo.timestamp).fromNow();
    }, 1000);
  }
};
</script>
