<template>
  <div class="container">
    <div>
      <h1>Albums</h1>
        <div class="card-deck">
            <div v-for="album in albums" :key="album.id">
              <album-item :album="album"></album-item>
            </div>
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
