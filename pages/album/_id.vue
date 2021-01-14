<template>
  <div class="container">
    <div>
      <h1>{{ album.name }}</h1>
      <overlay :show="!loaded">
        <div class="card-group">
            <div v-for="photo in photos" :key="photo.uuid">
              <album-content-item :photo="photo" :id="photo.uuid"></album-content-item>
            </div>
        </div>
      </overlay>
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
