<template>
  <div class="container">
    <div>
      <b-card-group>
          <div v-for="album in albums" :key="album.id">
            <album-item :album="album"></album-item>
          </div>
      </b-card-group>
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
        })
        .catch(res => {});
    },
  },
  data() {
    return {
      albums: []
    };
  }
};
</script>
