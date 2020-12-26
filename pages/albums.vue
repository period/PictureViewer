<template>
  <div class="container">
    <div>
      <b-overlay :show="!loaded">
        <b-card-group>
            <div v-for="album in albums" :key="album.id">
              <album-item :album="album"></album-item>
            </div>
        </b-card-group>
      </b-overlay>
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
        .$get("https://pics.thomas.gg/api/v1/albums", {})
        .then(res => {
          this.albums = res.data.filter((album) => { return album.id != 1 }); // do not show featured album
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
