<template>
  <b-card>
    <b-card-title>{{ photo.aircraft.registration }}</b-card-title>
    <b-card-img
      :src="
        'https://pics.thomas.gg/storage/thumbnails/' + photo.uuid + '.jpg'
      "
      top
    ></b-card-img>
    <b-card-text>
      {{ photo.description }}
    </b-card-text>
    <template v-slot:footer>
      <small class="text-muted">Taken with {{ photo.camera }}, {{ time }}</small>
        <b-button class="float-right" variant="primary" :to="'/photo/' + photo.uuid">More</b-button>
    </template>
  </b-card>
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
