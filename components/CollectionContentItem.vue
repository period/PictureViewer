<template>
  <b-card>
    <b-card-title>{{ item.registration }} <b-badge variant="info" v-if="item.state == 'NEEDS_RETAKE'" style="max-height: 1.5rem;">Needs Retake</b-badge></b-card-title>
    <b-card-img-lazy
      :src="'https://pics.thomas.gg/storage/thumbnails/' + item.photo.uuid + '.jpg'"
      top
    ></b-card-img-lazy>
    <b-card-text>
    </b-card-text>
    <template v-slot:footer>
      <small class="text-muted">Taken {{ time }} using {{ item.photo.camera }}</small>
        <b-button class="float-right" variant="primary" :to="'/photo/' + item.photo.uuid">More</b-button>
    </template>
  </b-card>
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
    this.time = this.$moment.unix(this.item.photo.timestamp).fromNow();
    setInterval(() => {
      this.time = this.$moment.unix(this.item.photo.timestamp).fromNow();
    }, 1000);
  }
};
</script>
