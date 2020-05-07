<template>
  <b-card>
    <b-card-title>{{ album.name }}</b-card-title>
    <b-card-img
      :src="
        'https://pics.thomas.gg/storage/thumbnails/' + album.header + '.jpg'
      "
      top
    ></b-card-img>
    <template v-slot:footer>
      <small class="text-muted">{{ album.photos }} photos / Last updated {{ time }}</small>
        <b-button class="float-right" variant="primary" :to="'/album/' + album.id">View</b-button>
    </template>
  </b-card>
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
