<template>
  <div class="container">
    <div class="row py-2">
      <div class="col-12 py-4">
        <h1>Albums</h1>
      </div>
      <div v-for="album in albums" :key="album.id" class="col-6">
        <album-item :album="album"></album-item>
      </div>
    </div>
  </div>
</template>
<script>
import AlbumItem from "../components/AlbumItem";
export default {
  name: "Albums",
  components: { AlbumItem },
  mounted() {
    this.getAlbums();
  },
  methods: {
    async getAlbums() {
      await this.$axios
        .$get("https://pics.thomas.gg/api/albums/list", {})
        .then(res => {
          this.albums = res.albums;
          this.loaded = true;
        })
        .catch(res => {});
    },
  },
  data() {
    return {
      loaded: false,
      albums: []
    };
  }
};
</script>
