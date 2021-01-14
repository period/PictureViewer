<template>
  <n-link :to="'/album/' + album.id" class="nocolour">
    <div class="card mb-3 card-hover">
      <img
        :src="
          'https://pics.thomas.gg/storage/thumbnails/' + album.header + '.jpg'
        "
        class="card-img-top"
      >
      <div class="card-body">
        <h5 class="card-title">{{ album.name }}</h5>
        <div class="row text-muted">
          <div class="col-md-4">
            <p class="card-muted"><strong><fa class="card-icon fa-fw align-middle" :icon="['fas', 'images']" /></strong> <strong>{{ album.photos }}</strong> photos</p>
          </div>
          <div class="col-md-7">
            <p class="card-muted"><strong><fa class="card-icon fa-fw align-middle" :icon="['fas', 'calendar-day']" /></strong> Updated {{ time }}</p>
          </div>
        </div>
      </div>
    </div>
  </n-link>
</template>
<script>
export default {
  name: "AlbumItem",
  props: {
    album: {
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
    this.time = this.$moment.unix(this.album.last_updated).fromNow();
    setInterval(() => {
      this.time = this.$moment.unix(this.album.last_updated).fromNow();
    }, 1000);
  }
};
</script>
