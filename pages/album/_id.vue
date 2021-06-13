<template>
  <div class="container">
    <div class="row py-2">
      <div class="col-12 py-4">
        <h1>{{ album.name }}</h1>
      </div>
      <div v-for="photo in photos" :key="photo.uuid" class="col-6">
        <album-content-item :photo="photo" :id="photo.uuid"></album-content-item>
      </div>
    </div>
  </div>
</template>
<script>
import AlbumContentItem from "../../components/AlbumContentItem";
export default {
  name: "Album",
  components: { AlbumContentItem },
  mounted() {
    this.getPhotos();
  },
  methods: {
    async getPhotos() {
      await this.$axios
        .$get("https://pics.thomas.gg/api/albums/retrieve?id=" + this.$route.params.id, {})
        .then(res => {
          this.album = res.album;
          this.photos = res.photos;
          this.loaded = true;
          if(this.$route.hash) {
            this.$nextTick(() => {
              document.getElementById(this.$route.hash.replace("#", "")).scrollIntoView(true);
            })
          }
        })
        .catch(res => {});
    },
  },
  data() {
    return {
      photos: [],
      album: {},
      loaded: false
    };
  }
};
</script>
